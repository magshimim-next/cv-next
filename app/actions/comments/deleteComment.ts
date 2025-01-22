"use server";

import { Err } from "@/lib/utils";
import { getCommentById, markCommentAsDeleted } from "@/server/api/comments";
import { getCurrentId, userIsAdmin } from "@/server/api/users";
import logger, { logErrorWithTrace } from "@/server/base/logger";

/**
 * The function will see if the comment can be deleted
 * @param commentResult The comment model to be deleted
 * @returns A promise of error or null based on if the action can be performed
 */
async function validateDelete(
  commentResult: Result<CommentModel, string>
): Promise<Result<never, string> | null> {
  const currentIdResult = await getCurrentId();
  if (!currentIdResult.ok) {
    logErrorWithTrace(currentIdResult);
    return Err(
      "An error has occurred while deleting the comment. Please try again later."
    );
  }

  if (!commentResult.ok) {
    logErrorWithTrace(commentResult);
    return Err(
      "An error has occurred while deleting the comment. Please try again later."
    );
  }
  const resultAdminCheck = await userIsAdmin();
  if (
    currentIdResult.val != commentResult.val.user_id &&
    !resultAdminCheck.ok
  ) {
    logger.error(
      `${currentIdResult.val} tried deleting someone elses comment!`
    );
    return Err(
      "An error has occurred while deleting the comment. Please try again later."
    );
  }
  return null;
}

/**
 * Deletes a comment by its ID.
 *
 * @param {string} commentId - The ID of the comment to be deleted
 * @return {Promise<Result<void, string>>} A Promise that resolves to a Result object containing no value if successful, or an error message
 */
export const deleteComment = async (
  commentId: string
): Promise<Result<void, string>> => {
  const commentResult = await getCommentById(commentId);
  if (!commentResult.ok) {
    logErrorWithTrace(commentResult);
    return Err(
      "An error has occurred while deleting the comment. Please try again later."
    );
  }

  const validateError = await validateDelete(commentResult);
  if (validateError) {
    return validateError;
  }

  const result = await markCommentAsDeleted(commentId);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err(
      "An error has occurred while deleting the comment. Please try again later."
    );
  }
};
