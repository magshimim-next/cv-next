"use server";

import Definitions from "@/lib/definitions";
import { getIdFromLink, getGoogleImageUrl } from "@/helpers/imageURLHelper";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { compareHashes } from "@/helpers/blobHelper";
import logger from "@/server/base/logger";
import { Storage } from "@/lib/supabase-definitions";
import { getPlaiceholder } from "plaiceholder";
import { NextRequest, NextResponse } from "next/server";

const blobDataMap = new Map<string, Blob>();

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (data.pathname.endsWith("revalidatePreview")) {
    await revalidatePreviewHandler(data);
    return NextResponse.json({ status: 200 });
  }

  if (data.pathname.endsWith("getImageURL")) {
    return await getImageURLHandler(data);
  }

  if (data.pathname.endsWith("getBlurredCv")) {
    return await getBlurredCvHandler(data);
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

/**
 * Revalidate the image a given CV in supabase
 * If the hash of the CV that was saved in the map is similar to the one that just got fetched
 * nothing is done. If something changed, the image is uploaded to supabase again
 * @param {string} cvLink - The cv link to validate
 */
export async function revalidatePreviewHandler(data: { cvLink: string }) {
  const cvLink = data.cvLink;
  const id = getIdFromLink(cvLink);
  const fileName = id + ".png";
  const response = await fetch(getGoogleImageUrl(cvLink), {
    next: { revalidate: Definitions.FETCH_WAIT_TIME },
  });
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
        upsert: true, // Replace if exists
      });

    if (error) {
      logger.error(error, "Upload error:");
    } else {
      logger.debug(data, "File uploaded successfully:");
    }
  } else {
    logger.debug("Files were similar");
  }
}

/**
 * Get the image URL of a given CV from supabase
 *
 * @param {string} cvId - The cv we want to show
 * @return {Promise<string | null>} a promised string with the imag eurl from supabase or null
 */
async function getImageURLHandler(data: { cvId: string }) {
  const cvId = data.cvId;
  let publicUrl = SupabaseHelper.getSupabaseInstance()
    .storage.from(Storage.cvs)
    .getPublicUrl(cvId + ".png").data.publicUrl;
  return NextResponse.json({ publicUrl: publicUrl });
}

/**
 * Get a blurred version of a cv
 *
 * @param {string} cvId - The cv to get a blurred version of
 * @return {Promise<string>} a promised string with the base64 of the blur
 */
async function getBlurredCvHandler(data: { cvLink: string }) {
  const cvLink = data.cvLink;
  const resp = await fetch(cvLink, {
    next: { revalidate: Definitions.FETCH_WAIT_TIME },
  });
  const arrayBuffer = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { base64 } = await getPlaiceholder(buffer, {
    size: Definitions.PLAICEHOLDER_IMAGE_SIZE,
  });
  return NextResponse.json({ base64 });
}
