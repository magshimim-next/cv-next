"use server";

import { getCvById, markCVAsDeleted } from "@/server/api/cvs";
import { Err } from "@/lib/utils";
import { logErrorWithTrace } from "@/server/base/logger";
import { checkCVModifyPermission } from "./checkPermission";
export interface InputValues {
  link: string;
  description: string;
  cvCategories: number[] | null;
}

/**
 * Deletes a CV by its ID.
 * @param {string} cvId - The ID of the CV to be deleted
 * @returns {Promise<Result<void, string>>} A Promise that resolves to a Result object containing no value if successful, or an error message
 */
export async function deleteCV(cvId: string): Promise<Result<void, string>> {
  const cvResult = await getCvById(cvId);
  if (!cvResult) {
    return Err(
      "An error has occurred while deleting the CV. Please try again later."
    );
  }

  const validateError = await checkCVModifyPermission(cvResult);
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
}
