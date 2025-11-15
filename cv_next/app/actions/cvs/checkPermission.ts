"use server";

import { Err, Ok } from "@/lib/utils";
import { getCurrentId, userIsAdmin } from "@/server/api/users";
import logger, { logErrorWithTrace } from "@/server/base/logger";

/**
 * The function will see if the user can modify the CV
 * @param {CvModel} cvData The CV model to be modified
 * @returns {Promise<Result<void, string>>} A promise of error or null based on if the action can be performed
 */
export async function checkCVModifyPermission(
  cvData: CvModel
): Promise<Result<void, string>> {
  const currentIdResult = await getCurrentId();
  if (!currentIdResult.ok) {
    logErrorWithTrace(currentIdResult);
    return Err(
      "An error has occurred while modifying the CV. Please try again later."
    );
  }

  // Note that in a different PR, there's a function that extracts it more easily
  const authorId =
    typeof cvData.user_id === "object" && cvData.user_id !== null
      ? (cvData.user_id as { id?: string }).id
      : String(cvData.user_id);

  const resultAdminCheck = await userIsAdmin();
  if (currentIdResult.val != authorId && !resultAdminCheck.ok) {
    logger.info(`${currentIdResult.val} ${authorId} ${resultAdminCheck.ok}`);
    logger.error(`${currentIdResult.val} tried modifying someone elses CV!`);
    return Err(
      "An error has occurred while modifying the CV. Please try again later."
    );
  }
  return Ok.EMPTY;
}
