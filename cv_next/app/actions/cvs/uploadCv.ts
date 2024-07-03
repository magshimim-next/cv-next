"use server";

import { InputValues } from "@/app/upload/page";
import { uploadCV, getCvsByUserId } from "@/server/api/cvs";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { PostgrestError } from "@supabase/supabase-js";
import MyLogger from "@/server/base/logger";
import { validateGoogleViewOnlyUrl } from "@/helpers/cvLinkRegexHelper";

export const checkUploadCV = async ({
  cvData,
  userId,
}: {
  cvData: InputValues;
  userId: string;
}): Promise<Error | void> => {
  // const userId = (await SupabaseHelper.getSupabaseInstance().auth.getUser())
  //   .data?.user?.id;
  // if (!userId) {
  //   MyLogger.logInfo("Couldn't get current user's ID");
  //   return Error("Couldn't get current user's ID");
  // }
  const cvsOfUser = await getCvsByUserId(userId);
  if (!cvsOfUser || cvsOfUser.length >= 5) {
    MyLogger.logInfo("The user has at least 5 CVs already");
    return Error("The user has at least 5 CVs already");
  }

  if (!validateGoogleViewOnlyUrl(cvData.link)) {
    MyLogger.logInfo("Regex invalid!", cvData.link);
    return Error("Regex invalid!");
  }

  const cvToUpload: NewCvModel = {
    document_link: cvData.link,
    description: cvData.description,
    category_id: cvData.catagoryId,
    user_id: userId,
    cv_categories: [cvData.catagoryId],
  };

  MyLogger.logInfo("Can upload:", cvToUpload);

  const response = await uploadCV(cvToUpload);
  if (response) {
    MyLogger.logInfo(response.message);
  }
};
