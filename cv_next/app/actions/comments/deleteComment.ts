"use server"

import { Err } from "@/lib/utils"
import { markCommentAsDeleted } from "@/server/api/comments"
import MyLogger from "@/server/base/logger"


/**
 * Deletes a comment by its ID.
 *
 * @param {string} commentId - The ID of the comment to be deleted
 * @return {Promise<Result<void, string>>} A Promise that resolves to a Result object containing no value if successful, or an error message
 */
export const deleteComment = async (
  commentId: string
): Promise<Result<void, string>> => {
  const result = await markCommentAsDeleted(commentId)
  if (result.ok) {
    return result
  } else {
    MyLogger.logInfo(result.val)
    return Err(
      "An error has occurred while deleting the comment. Please try again later."
    )
  }
}
