"use server";

import { InputValues } from "@/app/upload/page";
import { uploadCV, getCvsByUserId } from "@/server/api/cvs";
import MyLogger from "@/server/base/logger";
import { validateGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";
import { redirect } from "next/navigation";

export const checkUploadCV = async ({
  cvData,
  userId,
}: {
  cvData: InputValues;
  userId: string;
}): Promise<string | void> => {
  // TODO: Switch to getting uid from server
  const cvsOfUser = await getCvsByUserId(userId);
  if (!cvsOfUser || cvsOfUser.length >= 5) {
    MyLogger.logInfo("The user has at least 5 CVs already");
    return "The user has at least 5 CVs already";
  }

  const transformedURL = validateGoogleViewOnlyUrl(cvData.link);

  if (transformedURL == "") {
    MyLogger.logInfo("Couldn't transform the link", cvData.link);
    return "Regex invalid!";
  }

  const cvToUpload: NewCvModel = {
    document_link: transformedURL,
    description: cvData.description,
    category_id: cvData.catagoryId,
    user_id: userId,
    cv_categories: [cvData.catagoryId],
  };

  MyLogger.logDebug("Can upload:", cvToUpload);

  const response = await uploadCV(cvToUpload);
  if (response) {
    MyLogger.logDebug("Uploaded");
    redirect(`/cv/${response.id}`);
  } else {
    return "Error uploading";
  }
};
