"use server";

import { Err } from "@/lib/utils";
import {
  getCommentById,
  setResolved as setCommentResolved,
} from "@/server/api/comments";
import { getCurrentId } from "@/server/api/users";
import logger, { logErrorWithTrace } from "@/server/base/logger";

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
  const currentIdResult = await getCurrentId();
  if (!currentIdResult.ok) {
    logErrorWithTrace(currentIdResult);
    return Err(
      "An error has occurred while resolving the comment. Please try again later."
    );
  }
  const commentResult = await getCommentById(commentId);
  if (!commentResult.ok) {
    logErrorWithTrace(commentResult);
    return Err(
      "An error has occurred while resolving the comment. Please try again later."
    );
  }

  if (currentIdResult.val != commentResult.val.user_id) {
    logger.error(
      `${currentIdResult.val} tried resolving someone elses comment!`
    );
    return Err(
      "An error has occurred while resolving the comment. Please try again later."
    );
  }
  const result = await setCommentResolved(commentId, resolved);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err(
      "An error has occurred while resolving the comment. Please try again later."
    );
  }
};
