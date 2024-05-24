"use server";

import { getUserById, getCurrentUserModel } from "@/server/api/users";
import { Err } from "@/lib/utils";
import logger, { logErrorWithTrace } from "@/server/base/logger";

/**
 * Retrieves user data by user ID.
 *
 * @param {string} userId - The ID of the user to retrieve
 * @return {Promise<Result<UserModel, string>>} A promise that resolves to a Result containing the user data or an error message
 */
export const getUser = async (
  userId: string
): Promise<Result<UserModel, string>> => {
  const result = await getUserById(userId);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err(
      "An error has occurred while fetching the user data. Please try again later."
    );
  }
};

/**
 * Retrieves the UserModel of the currently signed in user
 *
 * @return {Promise<Result<UserModel, string>>} A promise that resolves to a Result containing the user data or an error message
 */
export const getCurrentUser = async (): Promise<UserModel | null> => {
  const result = await getCurrentUserModel();
  if (result) {
    return result;
  } else {
    logger.error(
      "An error has occurred while fetching the user data. Please try again later."
    );
    return null;
  }
};
