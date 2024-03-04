"use server"

import { getIdFromLink, getGoogleImageUrl } from "@/helpers/imageURLHelper"
import SupabaseHelper from "@/server/api/supabaseHelper"

export async function revalidatePreview(cvId: string): Promise<void> {
  const id = getIdFromLink(cvId)
  const fileName = id + ".png"
  const response = await fetch(getGoogleImageUrl(cvId))
  const blob = await response.blob()

  const { data, error } = await SupabaseHelper.getSupabaseInstance()
    .storage.from("cvs")
    .upload(fileName, blob, {
      cacheControl: "3600",
      upsert: true, // Replace if exists
    })

  if (error) {
    console.error("Upload error:", error)
  } else {
    console.log("File uploaded successfully:", data)
  }
}
export async function getImageURL(cvId: string): Promise<string | null> {
  return SupabaseHelper.getSupabaseInstance()
    .storage.from("cvs")
    .getPublicUrl(cvId + ".png").data.publicUrl
}
