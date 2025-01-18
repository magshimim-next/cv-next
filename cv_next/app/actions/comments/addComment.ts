"use server";

import { Err } from "@/lib/utils";
import { addCommentToCv } from "@/server/api/comments";
import { getCurrentId } from "@/server/api/users";
import logger, { logErrorWithTrace } from "@/server/base/logger";
/**
 * Adds a new comment to the cv.
 *
 * @param {NewCommentModel} comment - the comment to be added
 * @return {Promise<Result<CommentModel, string>>} a Promise that resolves to a Result object containing the added comment if successful, or an error message
 */
export const addComment = async (
  comment: NewCommentModel
): Promise<Result<CommentModel, string>> => {
  const currentIdResult = await getCurrentId();
  if (!currentIdResult.ok) {
    logErrorWithTrace(currentIdResult);
    return Err(
      "An error has occurred while commenting on the CV. Please try again later."
    );
  }
  if (currentIdResult.val != comment.user_id) {
    logger.error(
      `${currentIdResult.val} tried adding a comment with a different ID!`
    );
    return Err(
      "An error has occurred while commenting on the CV. Please try again later."
    );
  }
  const result = await addCommentToCv(comment);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err(
      "An error has occurred while commenting on the CV. Please try again later."
    );
  }
};
