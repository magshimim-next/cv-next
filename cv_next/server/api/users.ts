import "server-only";

import SupabaseHelper from "./supabaseHelper";
import { Ok, Err } from "@/lib/utils";
import logger from "../base/logger";
import { Tables, ProfileKeys } from "@/lib/supabase-definitions";

export async function getUserById(
  userId: string
): Promise<Result<UserModel, string>> {
  try {
    const { data: user, error } = await SupabaseHelper.getSupabaseInstance()
      .from("profiles")
      .select("*")
      .eq("id", userId);

    if (error) {
      return Err("Error @ " + getUserById.name + "\n", error);
    }

    if (!user || user.length !== 1) {
      return Err(
        "Expected only one match for query; users found: " +
          (user ? user.length : 0)
      );
    }

    return Ok(user[0] as UserModel);
  } catch (error) {
    return Err("Error @ " + getUserById.name + "\n" + error);
  }
}

export async function getCurrentUserModel(): Promise<UserModel | null> {
  const { data: user, error } =
    await SupabaseHelper.getSupabaseInstance().auth.getUser();

  if (error) {
    logger.error("Error @ " + getCurrentUserModel.name + "\n", error);
    return null;
  } else {
    const { data: currentUser, error } =
      await SupabaseHelper.getSupabaseInstance()
        .from(Tables.profiles)
        .select("*")
        .eq(ProfileKeys.id, user.user.id)
        .single();

    if (error) {
      logger.error("Error @ " + getCurrentUserModel.name + "\n", error);
      return null;
    }
    return currentUser;
  }
}
