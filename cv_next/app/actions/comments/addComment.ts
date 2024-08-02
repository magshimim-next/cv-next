"use server";

import { Err } from "@/lib/utils";
import { addCommentToCv } from "@/server/api/comments";
import { logErrorWithTrace } from "@/server/base/logger";
/**
 * Adds a new comment to the cv.
 *
 * @param {NewCommentModel} comment - the comment to be added
 * @return {Promise<Result<void, string>>} a Promise that resolves to a Result object containing no value if successful, or an error message
 */
export const addComment = async (
  comment: NewCommentModel
): Promise<Result<void, string>> => {
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
