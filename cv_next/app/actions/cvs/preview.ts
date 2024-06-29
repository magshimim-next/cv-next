"use server";

import Definitions from "@/lib/definitions";
import { getIdFromLink, getGoogleImageUrl } from "@/helpers/imageURLHelper";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { compareHashes } from "@/helpers/blobHelper";
import logger from "@/server/base/logger";
import { Tables, ProfileKeys, Storage } from "@/lib/supabase-definitions";

const blobDataMap = new Map<string, Blob>();

/**
 * Revalidate the image a given CV in supabase
 * If the hash of the CV that was saved in the map is similar to the one that just got fetched
 * nothing is done. If something changed, the image is uploaded to supabase again
 * @param {string} cvLink - The cv link to validate
 */
export async function revalidatePreview(cvLink: string) {
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
      .storage.from(Tables.cvs)
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
export async function getImageURL(cvId: string): Promise<string | null> {
  let data = SupabaseHelper.getSupabaseInstance()
    .storage.from(Storage.cvs)
    .getPublicUrl(cvId + ".png").data.publicUrl;
  return data;
}

/**
 * Fetch the name of a user
 *
 * @param {string} userId - The user
 * @return {Promise<boolean>} a promised string with the full name of the user, it's username, or null
 */
export async function getUserName(userId: string): Promise<string | null> {
  const { data: user, error } = await SupabaseHelper.getSupabaseInstance()
    .from(Tables.profiles)
    .select("*")
    .eq(ProfileKeys.id, userId)
    .single();
  if (error) {
    logger.error(error, "Error getting username");
  }
  return user?.full_name ?? user?.username ?? null;
}
