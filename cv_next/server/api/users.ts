import "server-only";

import SupabaseHelper from "./supabaseHelper";
import { Ok, Err } from "@/lib/utils";
import { Tables, ProfileKeys } from "@/lib/supabase-definitions";

export async function getUserById(
  userId: string
): Promise<Result<UserModel, string>> {
  try {
    const { data: user, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .select("*")
      .eq(ProfileKeys.id, userId);

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

/**
 * Changes the username of a given user.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {string} newUserName - The new username.
 * @return {Promise<Result<void, string>>} A promise that resolves with void or rejects with an error message.
 */
export async function setUserName(
  userId: string,
  newUserName: string
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .update({ username: newUserName })
      .eq(ProfileKeys.id, userId);
    if (error) {
      return Err(setUserName.name, error);
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setUserName.name, undefined, err as Error);
  }
}

/**
 * Changes the status of a given user.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {string} newWorkStatus - The new status.
 * @return {Promise<Result<void, string>>} A promise that resolves with void or rejects with an error message.
 */
export async function setWorkStatusName(
  userId: string,
  newWorkStatus: string
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .update({
        work_status: newWorkStatus as
          | "open_to_work"
          | "hiring"
          | "nothing"
          | undefined,
      })
      .eq(ProfileKeys.id, userId);
    if (error) {
      return Err(setUserName.name, error);
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setUserName.name, undefined, err as Error);
  }
}
