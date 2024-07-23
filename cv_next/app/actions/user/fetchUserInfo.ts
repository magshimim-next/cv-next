"use server";

import SupabaseHelper from "@/server/api/supabaseHelper";
import { ProfileKeys, Tables } from "@/lib/supabase-definitions";
import logger from "@/server/base/logger";
import { redirect } from "next/navigation";
import Definitions from "@/lib/definitions";

/**
 * Get the user based on a given ID
 * @param userId A string representing the user's ID
 * @returns UserModel of the user or null on error
 */
export const getUserFromId = async (
  userId: string
): Promise<UserModel | null> => {
  const supabase = SupabaseHelper.getSupabaseInstance();
  const { data: user, error } = await supabase
    .from(Tables.profiles)
    .select("*")
    .eq(ProfileKeys.id, userId)
    .single();

  if (!error) {
    return user;
  }
  logger.error(error, "Error fetching user");
  return null;
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
