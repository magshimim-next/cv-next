"use server";

import Definitions from "@/lib/definitions";
import { getIdFromLink, getGoogleImageUrl } from "@/helpers/imageURLHelper";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { compareHashes } from "@/helpers/blobHelper";

const blobDataMap = new Map<string, Blob>();

export async function revalidatePreview(cvId: string) {
  const id = getIdFromLink(cvId);
  const fileName = id + ".png";
  const response = await fetch(getGoogleImageUrl(cvId), {
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
      .storage.from("cvs")
      .upload(fileName, blob, {
        cacheControl: "3600",
        upsert: true, // Replace if exists
      });

    if (error) {
      console.error("Upload error:", error);
    } else {
      console.log("File uploaded successfully:", data);
    }
  }
}

export async function getImageURL(cvId: string): Promise<string | null> {
  let data = SupabaseHelper.getSupabaseInstance()
    .storage.from("cvs")
    .getPublicUrl(cvId + ".png").data.publicUrl;
  return data;
}
