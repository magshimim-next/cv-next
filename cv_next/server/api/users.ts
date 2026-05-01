import "server-only";

import crypto from "crypto";
import { decode } from "base64-arraybuffer";
import { QueryData } from "@supabase/supabase-js";
import { Ok, Err } from "@/lib/utils";
import { Tables, ProfileKeys, PermsKeys } from "@/lib/supabase-definitions";
import { checkUsername } from "@/helpers/usernameRegexHelper";
import logger from "@/server/base/logger";
import SupabaseHelper from "./supabaseHelper";

export async function getUserById(
  userId: string
): Promise<Result<UserModel, string>> {
  try {
    const { data: user, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .select("*")
      .eq(ProfileKeys.unique_profile_id, userId);

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

    if (user[0].username === null || user[0].username === "") {
      const usernameResult = await generateUsername(user[0] as UserModel);
      if (usernameResult.ok && usernameResult.val) {
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
      const updateUserNameResult = await setUserName(
        user.unique_profile_id,
        username
      );
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

export async function updateUser(
  user: Partial<UserModel>
): Promise<Result<void, string>> {
  if (user?.unique_profile_id === undefined) {
    return Err(updateUser.name, {
      err: Error("User ID is undefined"),
    });
  }
  const { unique_profile_id } = user;
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .update({ ...user })
      .eq(ProfileKeys.unique_profile_id, unique_profile_id);
    if (error) {
      return Err(updateUser.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(updateUser.name, {
      err: err as Error,
    });
  }
}

export async function setUserName(
  userId: string,
  newUserName: string
): Promise<Result<void, string>> {
  if (!checkUsername(newUserName)) {
    return Err(
      `${setUserName.name} New username should match the requested format`
    );
  }

  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .update({ username: newUserName })
      .eq(ProfileKeys.unique_profile_id, userId);
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

export async function setWorkStatus(
  userId: string,
  newWorkStatus: string
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .update({
        work_status: newWorkStatus as
          | "open for work"
          | "not sharing"
          | "hiring"
          | "enlisted"
          | "employed"
          | undefined,
      })
      .eq(ProfileKeys.unique_profile_id, userId);
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

export async function setWorkCategories(
  userId: string,
  newWorkCategories: string[] | null | undefined
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .update({
        work_categories: newWorkCategories as UserModel["work_categories"],
      })
      .eq(ProfileKeys.unique_profile_id, userId);
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
    const { data: perm, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profile_perms)
      .select(PermsKeys.role)
      .eq(PermsKeys.unique_profile_id, user.user.id)
      .single();
    if (error) {
      return Err(userIsAdmin.name, { postgrestError: error });
    }
    if (perm.role !== PermsKeys.roles_enum.admin) {
      return Err(userIsAdmin.name, { err: Error("User is not an admin") });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(userIsAdmin.name, {
      err: err as Error,
    });
  }
}

export async function validateUsername(): Promise<Result<String, String>> {
  const id = await getCurrentId();

  if (!id.ok || !id.val) {
    return Err(validateUsername.name, { err: Error("No user was connected!") });
  }

  const { data: user, error } = await SupabaseHelper.getSupabaseInstance()
    .from(Tables.profiles)
    .select("*")
    .eq(ProfileKeys.unique_profile_id, id.val)
    .single();

  if (error) {
    return Err(validateUsername.name, { postgrestError: error });
  }

  let username = user.username ?? "";
  if (user.username === null || user.username === "") {
    const usernameResult = await generateUsername(user as UserModel);
    if (usernameResult.ok && usernameResult.val) {
      user.username = usernameResult.val;
      username = usernameResult.val;

      const res = await setFirstLogin(true);
      if (!res.ok) {
        return Err("Error @ " + validateUsername.name + "\n", res.errors);
      }
    }
  }

  return Ok(username);
}

export async function setDisplayName(
  userId: string,
  newDisplayName: string
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .update({ display_name: newDisplayName })
      .eq(ProfileKeys.unique_profile_id, userId);
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

export async function setFirstLogin(
  isFirstLogin: boolean
): Promise<Result<void, string>> {
  const id = await getCurrentId();
  if (!id.ok || !id.val) {
    return Err(setFirstLogin.name, { err: Error("No user was connected!") });
  }

  try {
    const { error } =
      await SupabaseHelper.getSupabaseInstance().auth.updateUser({
        data: { is_first_login: isFirstLogin },
      });
    if (error) {
      return Err(setFirstLogin.name, { authError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setFirstLogin.name, {
      err: err as Error,
    });
  }
}

export async function isCurrentFirstLogin(): Promise<Result<Boolean, string>> {
  try {
    const supabase = await SupabaseHelper.getSupabaseInstance();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return Err(setFirstLogin.name, { authError: error });
    } else if (!user) {
      return Err(setFirstLogin.name, { err: Error("User object is empty") });
    }

    const metadata = user.user_metadata;
    logger.info(`isCurrentFirstLogin ${metadata.is_first_login}`);
    return Ok(metadata.is_first_login);
  } catch (err) {
    return Err(isCurrentFirstLogin.name, {
      err: err as Error,
    });
  }
}

export async function uploadProfilePic(
  fileToUpload: string
): Promise<Result<string, string>> {
  const id = await getCurrentId();
  if (!id.ok || !id.val) {
    return Err(uploadProfilePic.name, { err: Error("No user was connected!") });
  }

  try {
    const { data, error } = await SupabaseHelper.getSupabaseInstance()
      .storage.from("avatars")
      .upload(
        `public/${id.val}D${new Date().toISOString()}.png`,
        decode(fileToUpload),
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    logger.info(`Image uploaded to: ${data?.path}`);
    if (data?.path) {
      return Ok(data.path);
    }

    if (error) {
      return Err(uploadProfilePic.name, { err: error });
    }
    return Err(uploadProfilePic.name, { err: Error("No image found") });
  } catch (err) {
    return Err(uploadProfilePic.name, {
      err: err as Error,
    });
  }
}

export async function getAllUsers(
  userType?: string
): Promise<Result<Partial<UserWithPerms>[], string>> {
  const supabase = SupabaseHelper.getSupabaseInstance();
  try {
    let query = supabase
      .from(Tables.profile_perms)
      .select(
        `*, ${Tables.profiles}(${ProfileKeys.unique_profile_id}, ${ProfileKeys.display_name}, ${ProfileKeys.username}, ${ProfileKeys.avatar_url})`
      )
      .order(PermsKeys.role, { ascending: true });

    type PermissionsWithUserData = QueryData<typeof query>;

    if (userType && userType in PermsKeys.roles_enum) {
      query = query.eq(
        PermsKeys.role,
        userType as keyof typeof PermsKeys.roles_enum
      );
    }

    const { data: users, error } = await query;

    if (error) {
      logger.error(error, "Failed to fetch all users");
      return Err(getAllUsers.name, { postgrestError: error });
    }
    const usersWithPerms: PermissionsWithUserData = users;

    const transformedData = usersWithPerms.map((entry) => ({
      unique_profile_id: entry.unique_profile_id,
      username: entry.profiles?.username,
      avatar_url: entry.profiles?.avatar_url,
      display_name: entry.profiles?.display_name,
      role: entry.role,
    }));

    return Ok(transformedData as Partial<UserWithPerms>[]);
  } catch (err) {
    logger.error(err, "Failed to fetch all users");
    return Err(getAllUsers.name, {
      err: err as Error,
    });
  }
}

export async function setProfilePath(
  newUrl: string
): Promise<Result<void, string>> {
  const id = await getCurrentId();
  if (!id.ok || !id.val) {
    return Err(setProfilePath.name, { err: Error("No user was connected!") });
  }

  const { data } = await SupabaseHelper.getSupabaseInstance()
    .storage.from("avatars")
    .getPublicUrl(newUrl);

  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profiles)
      .update({ avatar_url: data.publicUrl })
      .eq(ProfileKeys.unique_profile_id, id.val);

    if (error) {
      return Err(setProfilePath.name, { postgrestError: error });
    }

    return Ok.EMPTY;
  } catch (err) {
    return Err(setProfilePath.name, {
      err: err as Error,
    });
  }
}

export async function updateUserPerms(
  user: Partial<UserWithPerms>
): Promise<Result<void, string>> {
  const resultAdminCheck = await userIsAdmin();
  if (!resultAdminCheck.ok) {
    logger.error("None admin action detected.");
    return Err(updateUserPerms.name, {
      err: "You are not an admin" as unknown as Error,
    });
  }

  if (user?.unique_profile_id === undefined || user?.role === undefined) {
    return Err(updateUserPerms.name, {
      err: Error("User ID or Permissions aren't undefined"),
    });
  }
  const { unique_profile_id, role } = user;
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profile_perms)
      .update({ role })
      .eq(PermsKeys.unique_profile_id, unique_profile_id);
    if (error) {
      logger.error(error, "Failed to activate the user");
      return Err(updateUserPerms.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(updateUserPerms.name, {
      err: err as Error,
    });
  }
}

export async function activateAllUsers(): Promise<Result<void, string>> {
  const resultAdminCheck = await userIsAdmin();
  if (!resultAdminCheck.ok) {
    logger.error("None admin action detected.");
    return Err(activateAllUsers.name, {
      err: "You are not an admin" as unknown as Error,
    });
  }

  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.profile_perms)
      .update({ role: PermsKeys.roles_enum.member })
      .eq(PermsKeys.role, PermsKeys.roles_enum.pending);
    if (error) {
      logger.error(error, "Failed to activate all users");
      return Err(activateAllUsers.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    logger.error(err, "Failed to activate all users");
    return Err(activateAllUsers.name, {
      err: err as Error,
    });
  }
}
