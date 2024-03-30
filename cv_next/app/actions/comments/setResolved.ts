"use server"

import { Err } from "@/lib/utils"
import { markCommentAsResolved as setCommentResolved } from "@/server/api/comments"
import { logErrorWithTrace } from "@/server/base/logger"

/**
 * Sets a comment as resolved or unresolved.
 *
 * @param {string} commentId - The ID of the comment to be resolved.
 * @param {boolean} resolved - Boolean indicating if the comment is resolved.
 * @return {Promise<Result<void, string>>} A Promise with the result of the operation.
 */
export const setResolved = async (
  commentId: string,
  resolved: boolean
): Promise<Result<void, string>> => {
  const result = await setCommentResolved(commentId, resolved)
  if (result.ok) {
    return result
  } else {
    logErrorWithTrace(result)
    return Err(
      "An error has occurred while resolving the comment. Please try again later."
    )
  }
}
