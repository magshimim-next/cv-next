"use server";

import { Err } from "@/lib/utils";
import {
  getCommentById,
  setResolved as setCommentResolved,
} from "@/server/api/comments";
import { getCurrentId, userIsAdmin } from "@/server/api/users";
import logger, { logErrorWithTrace } from "@/server/base/logger";
import { isUserAuthor } from "@/app/actions/users/getUser";

/**
 * The function will see if the comment can be resolved
 * @param commentResult The comment model to be resolved
 * @returns A promise of error or null based on if the action can be performed
 */
async function validateResolve(
  commentResult: Result<CommentModel, string>
): Promise<Result<never, string> | null> {
  const currentIdResult = await getCurrentId();
  if (!currentIdResult.ok) {
    logErrorWithTrace(currentIdResult);
    return Err(
      "An error has occurred while resolving the comment. Please try again later."
    );
  }

  if (!commentResult.ok) {
    logErrorWithTrace(commentResult);
    return Err(
      "An error has occurred while resolving the comment. Please try again later."
    );
  }
  const resultAdminCheck = await userIsAdmin();
  const resultAuthorCheck = await isUserAuthor(commentResult.val.document_id);
  if (
    currentIdResult.val != commentResult.val.user_id &&
    !resultAdminCheck.ok &&
    !resultAuthorCheck.ok
  ) {
    logger.error(
      `${currentIdResult.val} tried resolving someone elses comment!`
    );
    return Err(
      "An error has occurred while resolving the comment. Please try again later."
    );
  }
  return null;
}

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

  const validateError = await validateResolve(commentResult);
  if (validateError) {
    return validateError;
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
