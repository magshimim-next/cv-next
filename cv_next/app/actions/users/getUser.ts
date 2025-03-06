"use server";

import { redirect } from "next/navigation";
import {
  getAllUsers,
  getCurrentId,
  getUserById,
  getUserByUsername,
  isCurrentFirstLogin,
} from "@/server/api/users";
import { Err, Ok } from "@/lib/utils";
import logger, { logErrorWithTrace } from "@/server/base/logger";
import SupabaseHelper from "@/server/api/supabaseHelper";
import Definitions from "@/lib/definitions";
import { getCvById } from "@/server/api/cvs";

/**
 * Retrieves user data by user ID.
 *
 * @param {string} userId - The ID of the user to retrieve
 * @return {Promise<Result<UserModel, string>>} A promise that resolves to a Result containing the user data or an error message
 */
//TODO: delete this and replace any user-related fetches with getUser(),
// currently this relies on user id received from the browser which is unsafe.
export const getUserModel = async (
  username: string
): Promise<Result<UserModel, string>> => {
  const result = await getUserByUsername(username);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err(
      "An error has occurred while fetching the user data. Please try again later."
    );
  }
};

export const getUser = async (): Promise<Result<UserModel, string>> => {
  const supabase = SupabaseHelper.getSupabaseInstance();
  const userSession = await supabase.auth.getUser();
  if (!userSession || userSession.error) {
    //403 = session not found, 400 = session missing
    if (userSession.error.status !== 403 && userSession.error.status !== 400) {
      logger.error(userSession.error);
      return Err(
        "An error has occurred while fetching the user data. Please try again later."
      );
    } else {
      return Err("User is not signed in. Code: " + userSession.error.status);
    }
  }
  const result = await getUserById(userSession.data.user.id);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err(
      "An error has occurred while fetching the user data. Please try again later."
    );
  }
};

export const getFirstTimeLogin = async (): Promise<Result<Boolean, string>> => {
  const result = await isCurrentFirstLogin();
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err(
      "An error has occurred while fetching the user data. Please try again later."
    );
  }
};

export async function signInWithSocialProvider(provider: any, nextURL: string) {
  const { data, error } =
    await SupabaseHelper.getSupabaseInstance().auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_BASE_URL +
          Definitions.AUTH_CALLBACK_REDIRECT +
          "?next=" +
          nextURL,
      },
    });

  if (error) logger.error(error, "Error signin");
  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Returns all users with their permission level.
 * @return {Promise<Result<Partial<UserWithPerms>[], string>>} A Promise with the result of the operation.
 */
export const getAllUsersPerms = async (): Promise<
  Result<Partial<UserWithPerms>[], string>
> => {
  const result = await getAllUsers();
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err("Couldn't get all users", result.errors);
  }
};

/**
 * Returns if the user is the author of the CV.
 * @param cvId The CV id we want to check if the user is the author of
 * @returns {Promise<Result<boolean, string>>} A Promise with the result of the operation or error string.
 */
export const isUserAuthor = async (
  cvId: string
): Promise<Result<boolean, string>> => {
  const cv = await getCvById(cvId);

  if (cv === null) {
    return Err("Couldn't get the requested CV");
  }
  const userId = await getCurrentId();
  if (!userId.ok) {
    logErrorWithTrace(userId);
    return Err("Couldn't get the current user");
  }
  const authorData = JSON.parse(JSON.stringify(cv.user_id));
  return Ok(userId.val == authorData.id);
};
