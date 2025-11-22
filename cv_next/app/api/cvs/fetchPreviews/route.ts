"use server";

import { NextRequest, NextResponse } from "next/server";
import Definitions from "@/lib/definitions";
import { getIdFromLink, getGoogleImageUrl } from "@/helpers/imageURLHelper";
import SupabaseHelper from "@/server/api/supabaseHelper";
import logger from "@/server/base/logger";
import { Storage } from "@/lib/supabase-definitions";
import { validateGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";
import { getCVSignedPreview } from "@/server/api/cvs";

/**
 * The POST request handler for the revalidatePreview endpoint.
 * @param {NextRequest} req The request object that was sent to the server.
 * @returns {Promise<NextResponse>} The response object with the relevant data or error message.
 */
export async function POST(req: NextRequest) {
  const data = await req.json();
  if (data.pathname.endsWith("revalidatePreview")) {
    return await revalidatePreviewHandler(data);
  }
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

/**
 * Fetch the supabase preview
 * If the hash of the CV that was saved in the map is similar to the one that just got fetched
 * nothing is done. If something changed, the image is uploaded to supabase again
 * @param {string} data - Data sent to the handler
 * @param {string} data.cvLink - The link of the CV to revalidate
 * @returns {Promise<NextResponse>} - The response with the public url of the image, or the relevant message
 */
async function revalidatePreviewHandler(data: {
  cvLink: string;
}): Promise<NextResponse> {
  const cvLink = data.cvLink;

  if (!validateGoogleViewOnlyUrl(cvLink)) {
    logger.error(cvLink, "URL didn't match regex: ");
    return NextResponse.json({ message: "Invalid URL" }, { status: 500 });
  }

  const docsID = getIdFromLink(cvLink);
  const fileName = docsID + ".png";
  const publicUrl = SupabaseHelper.getSupabaseInstance()
    .storage.from(Storage.cvs)
    .getPublicUrl(fileName).data.publicUrl;

  // We do this check because getPublicUrl doesn't actually verify the file's existence - it just constructs the URL...
  try {
    const { status } = await fetch(publicUrl, {
      method: "HEAD",
      redirect: "follow",
    });
    if (status === 200) {
      return NextResponse.json({ publicUrl });
    }
  } catch (error) {
    logger.error(error, "Error fetching supabase preview:");
  }

  logger.debug("No preview found in supabase, fetching from docs...");

  const fetchDocsResponse = await fetch(getGoogleImageUrl(cvLink), {
    next: { revalidate: Definitions.FETCH_WAIT_TIME },
    redirect: "manual",
  });

  if (fetchDocsResponse.status === 302 || fetchDocsResponse.status === 404) {
    logger.error("Redirected when asked for usercontent, probably private");
    return NextResponse.json({ message: "CV is private" }, { status: 500 });
  }

  const docsBlob = await fetchDocsResponse.blob();

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
    const signedUrlResp = await getCVSignedPreview(fileName);
    if (signedUrlResp.ok) {
      return NextResponse.json({ signedUrl: signedUrlResp.val });
    }
    logger.error(signedUrlResp.errors.err, "Failed to get signed URL");
  }
  return NextResponse.json(
    { error: "Failed to revalidate preview" },
    { status: 500 }
  );
}
