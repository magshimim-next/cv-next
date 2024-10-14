import "server-only";

import crypto from "crypto";
import { Ok, Err } from "@/lib/utils";
import { Tables, ProfileKeys } from "@/lib/supabase-definitions";
import SupabaseHelper from "./supabaseHelper";

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

    //Generate username if it doesn't exist
    //TODO: add notice to change user-name after first login
    //TODO: change all user APIs to use username instead of id
    if (user[0].username === null || user[0].username === "") {
      const usernameResult = await generateUsername(user[0] as UserModel);
      if (usernameResult.ok && usernameResult.val) {
        //only update the user object if the username was successfully set
        user[0].username = usernameResult.val;
      }
    }

    return Ok(user[0] as UserModel);
  } catch (error) {
    return Err("Error @ " + getUserById.name + "\n" + error);
  }
}

async function generateUsername(
  user: UserModel
): Promise<Result<string | undefined, string>> {
  if (!user.full_name) {
    //username generation is based on user's name, fallback to user id..
    return Err("Error @ " + generateUsername.name + "\n", {
      err: Error("User's full name is empty"),
    });
  }

  let username: string | undefined;
  let slugishedName = slugifyName(user.full_name);
  let isUnique = false;
  let attempt = 0;

  while (!isUnique && attempt < 10) {
    username = generateUsernameAttempt(slugishedName);

    const { data: usernames, error } =
      await SupabaseHelper.getSupabaseInstance()
        .from(Tables.profiles)
        .select(`${ProfileKeys.username}`)
        .eq(ProfileKeys.username, username);

    if (error) {
      return Err("Error @ " + generateUsername.name + "\n", {
        postgrestError: error,
      });
    } else if (!usernames || usernames.length === 0) {
      isUnique = true;
      const updateUserNameResult = await setUserName(user.id, username);
      if (!updateUserNameResult.ok) {
        return Err(
          "Error @ " + generateUsername.name + "\n",
          updateUserNameResult.errors
        );
      } else {
        return Ok(username);
      }
    }
    attempt++;
  }
  return Err("Error @ " + generateUsername.name + "\n", {
    err: Error("Reached maximum username generation attempts"),
  });
}

function generateUsernameAttempt(name: string): string {
  //ensure high entropy by using a random uuid and timestamp
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const uuid = crypto.randomUUID();
  const inputString = `${name}.${timestamp}.${uuid}`;
  const hash = crypto.createHash("sha256").update(inputString).digest("hex");
  const shortHash = hash.slice(0, 8);

  return `${name}.${shortHash}`;
}

function slugifyName(fullName: string): string {
  return fullName
    .split(" ")
    .join("")
    .replace(/\s+/g, ".")
    .replace(/[^a-zA-Z0-9.]/g, "");
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
