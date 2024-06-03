"use server"

import { getUserById } from "@/server/api/users"
import { Err } from "@/lib/utils"
import { logErrorWithTrace } from "@/server/base/logger"

/**
 * Retrieves user data by user ID.
 *
 * @param {string} userId - The ID of the user to retrieve
 * @return {Promise<Result<UserModel, string>>} A promise that resolves to a Result containing the user data or an error message
 */
export const getUser = async (
  userId: string
): Promise<Result<UserModel, string>> => {
  const result = await getUserById(userId)
  if (result.ok) {
    return result
  } else {
    logErrorWithTrace(result)
    return Err(
      "An error has occurred while fetching the user data. Please try again later."
    )
  }
}
