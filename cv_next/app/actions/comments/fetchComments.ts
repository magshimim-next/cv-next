"use server";

import {
  getAllCommentsByCVId,
  getAllCommentsByUserId,
} from "@/server/api/comments";
import { logErrorWithTrace } from "@/server/base/logger";

/**
 * Fetches comments for the given cvId and returns the comment model array, or null if there is an error.
 *
 * @param {string} cvId - The ID of the CV for which comments are being fetched
 * @return {Promise<CommentModel[] | null>} The comment model array, or null if there is an error
 */
export const fetchCvComments = async (
  cvId: string
): Promise<CommentModel[] | null> => {
  const result = await getAllCommentsByCVId(cvId);
  if (result.ok) {
    return result.val;
  } else {
    logErrorWithTrace(result);
    return null;
  }
};

/**
 * Fetches comments for the given userId and returns the comment model array, or null if there is an error.
 *
 * @param {string} userId - The ID of the user for which comments are being fetched
 * @return {Promise<CommentModel[] | null>} The comment model array, or null if there is an error
 */
export const fetchUserComments = async (
  userId: string
): Promise<CommentModel[] | null> => {
  const result = await getAllCommentsByUserId(userId);
  if (result.ok) {
    return result.val;
  } else {
    logErrorWithTrace(result);
    return null;
  }
};
