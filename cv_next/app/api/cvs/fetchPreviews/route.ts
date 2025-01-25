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
 * @returns {Promise<NextResponse>} - The response with the public url of the image, or the relevant message
 */
async function revalidatePreviewHandler(data: {
  cvLink: string;
}): Promise<NextResponse> {
  const cvLink = data.cvLink;
  const docsID = getIdFromLink(cvLink);
  const fileName = docsID + ".png";
  const fetchDocsResponse = await fetch(getGoogleImageUrl(cvLink), {
    next: { revalidate: Definitions.FETCH_WAIT_TIME },
    redirect: "manual",
  });

  if (fetchDocsResponse.status === 302) {
    logger.error("Redirected when asked for usercontent, probably private");
    return NextResponse.json({ message: "CV is private" }, { status: 500 });
  }

  const docsBlob = await fetchDocsResponse.blob();
  const isSimilar = await compareHashes(
    docsBlob,
    blobDataMap.get(docsID || "") || new Blob()
  );

  if (isSimilar) {
    logger.debug("Files were similar");
    return NextResponse.json({ message: "No changes" });
  }

  blobDataMap.delete(docsID || "");
  blobDataMap.set(docsID || "", docsBlob);

  const { data: uploadedData, error: uploadError } =
    await SupabaseHelper.getSupabaseInstance()
      .storage.from(Storage.cvs)
      .upload(fileName, docsBlob, {
        cacheControl: "3600",
        upsert: true,
      });

  if (
    uploadError &&
    !uploadError?.message.includes("violates row-level security")
  ) {
    logger.error(uploadError, "Upload error:");
    return NextResponse.json(
      { message: "Error revalidating CV" },
      { status: 500 }
    );
  } else if (uploadError) {
    // debug because it's redundant to log RLS
    logger.debug(uploadError, "RLS error on upload");
    return NextResponse.json({ message: "RLS error" });
  } else {
    logger.debug(uploadedData, "File uploaded successfully:");
    const publicUrl = SupabaseHelper.getSupabaseInstance()
      .storage.from(Storage.cvs)
      .getPublicUrl(fileName).data.publicUrl;
    return NextResponse.json({ publicUrl });
  }
}
