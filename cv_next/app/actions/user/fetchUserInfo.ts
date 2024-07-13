"use server";

import SupabaseHelper from "@/server/api/supabaseHelper";
import { ProfileKeys, Tables } from "@/lib/supabase-definitions";
import logger from "@/server/base/logger";
import { redirect } from "next/navigation";
import Definitions from "@/lib/definitions";

/**
 * Handle which user can enter a given route(used instead of the middleware to reduce server requests)
 * If there's no user connect, return login and redirect there
 * If the user is inactive, return inactive and redirect there
 * If the user is active, return the given finalRedirect and redirect there
 * @param {string} finalRedirect - The path the user wants to access
 * @return {Promise<string>} a promised string with where to redirect the user to
 */
export const handleCurrentUser = async (
  finalRedirect: string
): Promise<string> => {
  const supabase = SupabaseHelper.getSupabaseInstance();
  const { data: activatedUser, error } = await supabase.auth.getUser();
  if (error || !activatedUser?.user) {
    if (error) logger.error(error, "Error getting current user");
    return "/login";
  } else {
    const { data: whitelisted, error } = await supabase
      .from(Tables.whitelisted)
      .select("*")
      .eq(ProfileKeys.id, activatedUser.user.id)
      .single();

    if (whitelisted?.id == null || error) {
      if (error) logger.error(error, "Error getting current user from DB");
      return "/inactive";
    }
  }
  return finalRedirect;
};

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
