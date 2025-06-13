"use server";

import { redirect } from "next/navigation";
import { uploadCV, getCvsByUserId, updateCV } from "@/server/api/cvs";
import { encodeValue, Err, Ok } from "@/lib/utils";
import { transformGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";
import logger, { logErrorWithTrace } from "@/server/base/logger";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { getCurrentId, userIsAdmin } from "@/server/api/users";
export interface InputValues {
  link: string;
  description: string;
  cvCategories: number[] | null;
}

export const checkUploadCV = async ({
  cvData,
}: {
  cvData: InputValues;
}): Promise<string | null> => {
  // TODO: change to the getUser of #99 after merge
  const supabase = SupabaseHelper.getSupabaseInstance();
  const connectedUser = await supabase.auth.getUser();
  if (connectedUser.error || !connectedUser.data.user) {
    logger.error("Error getting user");
    return "Error getting user.";
  }
  const userId = connectedUser.data.user.id;
  if (
    !cvData.link?.trim() ||
    !cvData.description?.trim() ||
    cvData.cvCategories == undefined ||
    cvData.cvCategories.length <= 0
  ) {
    logger.error("Missing variables!");
    return "Missing variables!";
  }

  if (!(await canUserUploadACV(userId))) {
    logger.error("The user has at least 5 CVs already");
    return "The user has at least 5 CVs already";
  }

  const transformedURL = transformGoogleViewOnlyUrl(cvData.link);

  if (transformedURL == "") {
    logger.error("Couldn't transform the link %s", cvData.link);
    return "Regex invalid!";
  }

  const res = await fetch(cvData.link, {
    method: "HEAD",
  });

  if (res.status !== 200) {
    if (res.status === 302) {
      logger.error("Redirected when asked for usercontent, probably private");
      return "CV File is Private";
    }
    logger.error("Couldn't Find The CV %s", cvData.link);
    return "Invalid URL for CV";
  }

  const cvToUpload: NewCvModel = {
    document_link: transformedURL,
    description: cvData.description,
    user_id: userId,
    cv_categories: cvData.cvCategories,
  };

  logger.debug(cvToUpload, "Can upload:");

  const response = await uploadCV(cvToUpload);
  if (response) {
    logger.debug("Uploaded");
    redirect(`/cv/${encodeValue(response.id)}`);
  } else {
    return "Error uploading";
  }
};

export const canUserUploadACV = async (userId: string) => {
  const cvsOfUser = await getCvsByUserId(userId);
  return !cvsOfUser || cvsOfUser.length < 5;
};

/**
 * The function will update a CV if the user is allowed to do so.
 * @param {CvModel} cvData The CV data to be updated
 * @returns {Promise<string | null>} A promise that resolves to an error message if the update fails, or null if it succeeds
 */
export const checkUpdateCV = async ({
  cvData,
}: {
  cvData: CvModel;
}): Promise<string | null> => {
  const authorObject = cvData.user_id as any;
  cvData.user_id = authorObject["id"];

  const validateError = await validateUpdate(cvData);
  if (!validateError.ok) {
    logger.error(validateError, "Validation error");
    return (
      validateError.errors.err?.message ||
      "Failed to update CV. Please try again later."
    );
  }

  if (
    !cvData.document_link?.trim() ||
    !cvData.description?.trim() ||
    cvData.cv_categories == undefined ||
    cvData.cv_categories.length <= 0
  ) {
    logger.error("Missing variables!");
    return "Some variables are missing! Please fill them in.";
  }

  const transformedURL = transformGoogleViewOnlyUrl(cvData.document_link);

  if (transformedURL == "") {
    logger.error("Couldn't transform the link %s", cvData.document_link);
    return "Regex invalid!";
  }

  const res = await fetch(cvData.document_link, {
    method: "HEAD",
  });

  if (res.status !== 200) {
    if (res.status === 302) {
      logger.error("Redirected when asked for usercontent, probably private");
      return "CV File is Private";
    }
    logger.error("Couldn't Find The CV %s", cvData.document_link);
    return "Invalid URL for CV";
  }

  logger.debug(cvData, "Can updaate:");

  const response = await updateCV(cvData);
  if (response) {
    redirect(`/cv/${encodeValue(cvData.id)}`);
  } else {
    logger.error(response, "Error updating CV");
    return "Error updating CV";
  }
};

/**
 * The function will see if the CV can be deleted
 * @param CvModel The CV model to be deleted
 * @returns A promise of error or null based on if the action can be performed
 */
export async function validateUpdate(
  cvData: CvModel
): Promise<Result<void, string>> {
  const currentIdResult = await getCurrentId();
  if (!currentIdResult.ok) {
    logErrorWithTrace(currentIdResult);
    return Err(
      "An error has occurred while deleting the comment. Please try again later."
    );
  }

  const resultAdminCheck = await userIsAdmin();
  if (currentIdResult.val != cvData.user_id && !resultAdminCheck.ok) {
    logger.error(`${currentIdResult.val} tried updating someone elses CV!`);
    return Err(
      "An error has occurred while updating the CV. Please try again later."
    );
  }
  return Ok.EMPTY;
}
