"use server";

import { InputValues } from "@/app/upload/page";
import { uploadCV, getCvsByUserId } from "@/server/api/cvs";
import SupabaseHelper from "@/server/api/supabaseHelper";

export const checkUploadCV = async ({
  cvData,
}: {
  cvData: InputValues;
}): Promise<Error | PostgrestError | null> => {
  const userId = (await SupabaseHelper.getSupabaseInstance().auth.getUser())
    .data.user?.id;
  if (!userId) {
    return Error("Couldn't get current user's ID");
  }
  const cvsOfUser = await getCvsByUserId(userId);
  if (!cvsOfUser || cvsOfUser.length >= 5) {
    return Error("The user has at least 5 CVs already");
  }

  const cvToUpload: CvModel = {
    document_link: cvData.link,
    description: cvData.description,
    category_id: cvData.catagoryId,
    user_id: userId,
  };

  const response = uploadCV();
};
