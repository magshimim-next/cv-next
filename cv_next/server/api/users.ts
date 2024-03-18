import "server-only"

import SupabaseHelper from "./supabaseHelper"
import { Ok, Err } from "@/lib/utils"

export async function getUserById(
  userId: string
): Promise<Result<UserModel, string>> {
  try {
    const { data: user, error } = await SupabaseHelper.getSupabaseInstance()
      .from("profiles")
      .select("*")
      .eq("id", userId)

    if (error) {
      return Err("Error @ " + getUserById.name + "\n", error)
    }

    if (!user || user.length !== 1) {
      return Err(
        "Expected only one match for query; users found: " +
          (user ? user.length : 0)
      )
    }

    return Ok(user[0] as UserModel)
  } catch (error) {
    return Err("Error @ " + getUserById.name + "\n" + error)
  }
}
