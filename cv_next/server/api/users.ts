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
      return Err("Error @ " + getUserById.name + "\n", {
        postgrestError: error,
      });
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
      return Err(setUserName.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setUserName.name, {
      err: err as Error,
    });
  }
}

/**
 * Changes the status of a given user.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {string} newWorkStatus - The new status.
 * @return {Promise<Result<void, string>>} A promise that resolves with void or rejects with an error message.
 */
export async function setWorkStatus(
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
      return Err(setWorkStatus.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setWorkStatus.name, {
      err: err as Error,
    });
  }
}

/**
 * Changes the categories of a given user.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {number[] | null | undefined} newWorkCategories - The new categories.
 * @return {Promise<Result<void, string>>} A promise that resolves with void or rejects with an error message.
 */
export async function setWorkCategories(
  userId: string,
  newWorkCategories: number[] | null | undefined
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .update({
        work_status_categories: newWorkCategories,
      })
      .eq(ProfileKeys.id, userId);
    if (error) {
      return Err(setWorkCategories.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setWorkCategories.name, {
      err: err as Error,
    });
  }
}

/**
 * Get current user ID
 *
 * @return {Promise<Result<string, string>>} A promise that resolves with the id or rejects with an error message.
 */
export async function getCurrentId(): Promise<Result<string, string>> {
  try {
    const { data: user, error: connectedError } =
      await SupabaseHelper.getSupabaseInstance().auth.getUser();
    if (connectedError && !user) {
      return Err(getCurrentId.name, { authError: connectedError });
    }
    if (!user.user) {
      return Err(getCurrentId.name, { err: Error("User object is empty") });
    }
    return Ok(user.user.id);
  } catch (err) {
    return Err(userIsAdmin.name, {
      err: err as Error,
    });
  }
}

/**
 * Check if the current user is an admin
 *
 * @return {Promise<Result<void, string>>} A promise that resolves with void or rejects with an error message.
 */
export async function userIsAdmin(): Promise<Result<void, string>> {
  try {
    const { data: user, error: connectedError } =
      await SupabaseHelper.getSupabaseInstance().auth.getUser();
    if (connectedError && !user) {
      return Err(userIsAdmin.name, { authError: connectedError });
    }
    if (!user.user) {
      return Err(userIsAdmin.name, { err: Error("User object is empty") });
    }
    const { data: admin, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.admins)
      .select("*")
      .eq(ProfileKeys.id, user.user.id)
      .single();
    if (error) {
      return Err(userIsAdmin.name, { postgrestError: error });
    }
    if (admin.id == null) {
      return Err(userIsAdmin.name, { err: Error("No ID found") });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(userIsAdmin.name, {
      err: err as Error,
    });
  }
}
