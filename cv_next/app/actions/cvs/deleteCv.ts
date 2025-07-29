"use server";

import { getCvById, markCVAsDeleted } from "@/server/api/cvs";
import { Err, Ok } from "@/lib/utils";
import logger, { logErrorWithTrace } from "@/server/base/logger";
import { getCurrentId, userIsAdmin } from "@/server/api/users";
export interface InputValues {
  link: string;
  description: string;
  cvCategories: number[] | null;
}

/**
 * Deletes a CV by its ID.
 *
 * @param {string} cvId - The ID of the CV to be deleted
 * @return {Promise<Result<void, string>>} A Promise that resolves to a Result object containing no value if successful, or an error message
 */
export const deleteCV = async (cvId: string): Promise<Result<void, string>> => {
  const cvResult = await getCvById(cvId);
  if (!cvResult) {
    return Err(
      "An error has occurred while deleting the CV. Please try again later."
    );
  }

  const validateError = await validateDelete(cvResult);
  if (!validateError.ok) {
    return validateError;
  }

  const result = await markCVAsDeleted(cvId);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err(
      "An error has occurred while deleting the CV. Please try again later."
    );
  }
};

/**
 * The function will see if the CV can be deleted
 * @param CvModel The CV model to be deleted
 * @returns A promise of error or null based on if the action can be performed
 */
async function validateDelete(cvData: CvModel): Promise<Result<void, string>> {
  const currentIdResult = await getCurrentId();
  if (!currentIdResult.ok) {
    logErrorWithTrace(currentIdResult);
    return Err(
      "An error has occurred while deleting the CV. Please try again later."
    );
  }

  const resultAdminCheck = await userIsAdmin();
  if (currentIdResult.val != cvData.user_id && !resultAdminCheck.ok) {
    logger.error(`${currentIdResult.val} tried deleting someone elses CV!`);
    return Err(
      "An error has occurred while deleting the CV. Please try again later."
    );
  }
  return Ok.EMPTY;
}
