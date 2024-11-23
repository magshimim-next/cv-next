import "server-only";

import crypto from "crypto";
import { Ok, Err } from "@/lib/utils";
import { Tables, ProfileKeys } from "@/lib/supabase-definitions";
import logger from "../base/logger";
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

export async function getUserByUsername(
  username: string
): Promise<Result<UserModel, string>> {
  try {
    const { data: user, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .select("*")
      .eq(ProfileKeys.username, username);

    if (error) {
      return Err("Error @ " + getUserByUsername.name + "\n", {
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
    return Err("Error @ " + getUserByUsername.name + "\n" + error);
  }
}

async function generateUsername(
  user: UserModel
): Promise<Result<string | undefined, string>> {
  if (!user.display_name) {
    //username generation is based on user's name, fallback to user id..
    return Err("Error @ " + generateUsername.name + "\n", {
      err: Error("User's full name is empty"),
    });
  }

  let username: string | undefined;
  let slugishedName = slugifyName(user.display_name);
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

export const updateUser = async (
  user: Partial<UserModel>
): Promise<Result<void, string>> => {
  if (user?.id === undefined) {
    return Err(updateUser.name, {
      err: Error("User ID is undefined"),
    });
  }
  const { id } = user;
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .update({ ...user })
      .eq(ProfileKeys.id, id);
    if (error) {
      return Err(updateUser.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(updateUser.name, {
      err: err as Error,
    });
  }
};

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

/**
 * check if the username is valid and generate one if it's not
 *
 * @returns {Promise<Result<Boolean, String>} whether the username is valid and was generated or not
 */
export async function validateUsername(): Promise<Result<Boolean, String>> {
  const id = await getCurrentId();

  if (!id.ok || !id.val) {
    return Err(validateUsername.name, { err: Error("No user was connected!") });
  }

  const { data: user, error } = await SupabaseHelper.getSupabaseInstance()
    .from(Tables.profiles)
    .select("*")
    .eq(ProfileKeys.id, id.val)
    .single();

  if (error) {
    return Err(validateUsername.name, { postgrestError: error });
  }

  let isGenerated = false;
  if (user.username === null || user.username === "") {
    const usernameResult = await generateUsername(user as UserModel);
    if (usernameResult.ok && usernameResult.val) {
      //only update the user object if the username was successfully set
      user.username = usernameResult.val;
      isGenerated = true;

      const res = await setFirstLogin(true);
      if (!res.ok) {
        return Err("Error @ " + validateUsername.name + "\n", res.errors);
      }
    }
  }

  return Ok(isGenerated);
}

/**
 * Changes the display name of a given user.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {string} newDisplayName - The new display name.
 * @return {Promise<Result<void, string>>} A promise that resolves with void or rejects with an error message.
 */
export async function setDisplayName(
  userId: string,
  newDisplayName: string
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      //wont work until full_name is changed to full_name in the db
      .update({ display_name: newDisplayName })
      .eq(ProfileKeys.id, userId);
    if (error) {
      return Err(setDisplayName.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setDisplayName.name, {
      err: err as Error,
    });
  }
}

/*
 * Set the first login status of the current user.
 *
 * @param {boolean} isFirstLogin - first login status.
 * @return {Promise<Result<void, string>>} A promise that resolves with void or rejects with an error message.
 */
export async function setFirstLogin(
  isFirstLogin: boolean
): Promise<Result<void, string>> {
  const id = await getCurrentId();
  if (!id.ok || !id.val) {
    return Err(setFirstLogin.name, { err: Error("No user was connected!") });
  }

  try {
    const { data, error } =
      await SupabaseHelper.getSupabaseInstance().auth.updateUser({
        data: { is_first_login: isFirstLogin },
      });
    if (error) {
      return Err(setFirstLogin.name, { authError: error });
    }

    logger.info("First login set to: " + isFirstLogin);
    logger.info(`User data: ${JSON.stringify(data)}`);
    return Ok.EMPTY;
  } catch (err) {
    return Err(setFirstLogin.name, {
      err: err as Error,
    });
  }
}
