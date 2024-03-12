"use server"

import { Err } from "@/lib/utils"
import { addNewCommentToCv } from "@/server/api/comments"
import MyLogger from "@/server/base/logger"

/**
 * Adds a new comment to the cv.
 *
 * @param {NewCommentModel} comment - the comment to be added
 * @return {Promise<Result<void, string>>} a Promise that resolves to a Result object containing no value if successful, or an error message
 */
export const addNewComment = async (
  comment: NewCommentModel
): Promise<Result<void, string>> => {
  const result = await addNewCommentToCv(comment)
  if (result.ok) {
    return result
  } else {
    MyLogger.logInfo(result.val)
    return Err(
      "An error has occurred while commenting on the CV. Please try again later."
    )
  }
}
