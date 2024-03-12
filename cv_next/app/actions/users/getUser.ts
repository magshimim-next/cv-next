"use server"

import { getUserById } from "@/server/api/users"
import MyLogger from "@/server/base/logger"
import { Err } from "@/lib/utils"

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
    let message = result.val
    if (result.postgrestError) {
      message += "\n" + JSON.stringify(result.postgrestError, null, 2)
    }
    MyLogger.logInfo(message)

    return Err(
      "An error has occurred while fetching the user data. Please try again later."
    )
  }
}
