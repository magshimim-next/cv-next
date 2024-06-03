"use server"

import { getAllCommentsByCVId } from "@/server/api/comments"
import { logErrorWithTrace } from "@/server/base/logger"

/**
 * Fetches comments for the given cvId and returns the comment model array, or null if there is an error.
 *
 * @param {string} cvId - The ID of the CV for which comments are being fetched
 * @return {Promise<CommentModel[] | null>} The comment model array, or null if there is an error
 */
export const fetchComments = async (
  cvId: string
): Promise<CommentModel[] | null> => {
  const result = await getAllCommentsByCVId(cvId)
  if (result.ok) {
    return result.val
  } else {
    logErrorWithTrace(result)
    return null
  }
}
