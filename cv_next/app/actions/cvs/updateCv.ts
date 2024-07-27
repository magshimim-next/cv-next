"use server";

import { setCvLink } from "@/server/api/cvs";
import { Err } from "@/lib/utils";
import { logErrorWithTrace } from "@/server/base/logger";

/**
 * Updates a user's username.
 *
 * @param {string} cvId - The ID of the cv to update
 * @param {string} newLink - The new link
 * @return {Promise<Result<void, string>>} A Promise with the result of the operation.
 */
export const setNewCvLink = async (
  cvId: string,
  newLink: string
): Promise<Result<void, string>> => {
  const result = await setCvLink(cvId, newLink);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err("Couldn't update the link", result.postgrestError);
  }
};
