"use server";

import Definitions from "@/lib/definitions";
import { getIdFromLink, getGoogleImageUrl } from "@/helpers/imageURLHelper";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { compareHashes } from "@/helpers/blobHelper";
import logger from "@/server/base/logger";

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
      logger.error("Upload error:", error);
    } else {
      logger.log("File uploaded successfully:", data);
    }
  }
}

export async function getImageURL(cvId: string): Promise<string | null> {
  let data = SupabaseHelper.getSupabaseInstance()
    .storage.from("cvs")
    .getPublicUrl(cvId + ".png").data.publicUrl;
  return data;
}

export async function getUserName(userId: string): Promise<string | null> {
  const { data: user, error } = await SupabaseHelper.getSupabaseInstance()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    return null;
  }
  return user.full_name;
}
