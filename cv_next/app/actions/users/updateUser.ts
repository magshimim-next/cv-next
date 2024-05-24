"use server";

import { setUserName } from "@/server/api/users";
import { Err } from "@/lib/utils";
import { logErrorWithTrace } from "@/server/base/logger";

/**
 * Updates a user's username.
 *
 * @param {string} userId - The ID of the user to update
 * @param {string} newUserName - The new username
 * @return {Promise<Result<void, string>>} A Promise with the result of the operation.
 */
export const setNewUsername = async (
  userId: string,
  newUserName: string
): Promise<Result<void, string>> => {
  const result = await setUserName(userId, newUserName);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err("Couldn't update the name", result.postgrestError);
  }
};
