"use server";

import { getUserById } from "@/server/api/users";
import { Err } from "@/lib/utils";
import logger, { logErrorWithTrace } from "@/server/base/logger";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { redirect } from "next/navigation";
import Definitions from "@/lib/definitions";

/**
 * Retrieves user data by user ID.
 *
 * @param {string} userId - The ID of the user to retrieve
 * @return {Promise<Result<UserModel, string>>} A promise that resolves to a Result containing the user data or an error message
 */
export const getUserModel = async (
  userId: string
): Promise<Result<UserModel, string>> => {
  const result = await getUserById(userId);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err(
      "An error has occurred while fetching the user data. Please try again later."
    );
  }
};

export async function signInWithSocialProvider(provider: any, nextURL: string) {
  const { data, error } =
    await SupabaseHelper.getSupabaseInstance().auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_BASE_URL +
          Definitions.AUTH_CALLBACK_REDIRECT +
          "?next=" +
          nextURL,
      },
    });
  if (error) logger.error(error, "Error signin");
  if (data.url) {
    redirect(data.url);
  }
}
