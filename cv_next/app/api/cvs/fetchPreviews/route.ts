"use server";

import { NextRequest, NextResponse } from "next/server";
import Definitions from "@/lib/definitions";
import { getIdFromLink, getGoogleImageUrl } from "@/helpers/imageURLHelper";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { compareHashes } from "@/helpers/blobHelper";
import logger from "@/server/base/logger";
import { Storage } from "@/lib/supabase-definitions";

const blobDataMap = new Map<string, Blob>();

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (data.pathname.endsWith("revalidatePreview")) {
    return await revalidatePreviewHandler(data);
  }
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

/**
 * Revalidate the image a given CV in supabase
 * If the hash of the CV that was saved in the map is similar to the one that just got fetched
 * nothing is done. If something changed, the image is uploaded to supabase again
 * @param {string} cvLink - The cv link to validate
 */
async function revalidatePreviewHandler(data: { cvLink: string }) {
  const cvLink = data.cvLink;
  const id = getIdFromLink(cvLink);
  const fileName = id + ".png";
  const response = await fetch(getGoogleImageUrl(cvLink), {
    next: { revalidate: Definitions.FETCH_WAIT_TIME },
    redirect: "manual",
  });

  if (response.status === 302) {
    logger.error("Redirected when asked for usercontent, probably private");
    return NextResponse.json({ message: "CV is private" }, { status: 500 });
  }

  const blob = await response.blob();
  const isSimilar = await compareHashes(
    blob,
    blobDataMap.get(id || "") || new Blob()
  );
  if (!isSimilar) {
    blobDataMap.delete(id || "");
    blobDataMap.set(id || "", blob);

    const { data, error } = await SupabaseHelper.getSupabaseInstance()
      .storage.from(Storage.cvs)
      .upload(fileName, blob, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error && !error?.message.includes("violates row-level security")) {
      logger.error(error, "Upload error:");
    } else if (error) {
      // debug because it's redundant to log RLS
      logger.debug(error, "RLS error on upload");
    } else {
      logger.debug(data, "File uploaded successfully:");
      const publicUrl = SupabaseHelper.getSupabaseInstance()
        .storage.from(Storage.cvs)
        .getPublicUrl(fileName).data.publicUrl;
      return NextResponse.json({ publicUrl });
    }
  } else {
    logger.debug("Files were similar");
  }
  return NextResponse.json({ message: "No changes" });
}
