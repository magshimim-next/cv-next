"use server";

import { redirect } from "next/navigation";
import { uploadCV, getCvsByUserId } from "@/server/api/cvs";
import { transformToPreviewLink, encodeValue } from "@/lib/utils";
import { transformGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";
import logger from "@/server/base/logger";
import SupabaseHelper from "@/server/api/supabaseHelper";
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

  const res = await fetch(transformToPreviewLink(transformedURL), {
    method: "HEAD",
  });

  if (res.status !== 200) {
    logger.error("Couldn't Find The CV %s", cvData.link);
    return "Invalid URL for CV";
  }

  const cookieHeader = res.headers.get("set-cookie");
  if (!cookieHeader || !cookieHeader.includes("COMPASS")) {
    logger.error("COMPASS cookie not found %s", cvData.link);
    return "CV File is Private";
  }

  const cvToUpload: NewCvModel = {
    document_link: transformedURL,
    description: cvData.description,
    user_id: userId,
    cv_categories: cvData.cvCategories,
  };

  logger.debug("Can upload:", cvToUpload);

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
