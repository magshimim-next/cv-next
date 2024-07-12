"use server";

import SupabaseHelper from "@/server/api/supabaseHelper";
import { ProfileKeys } from "@/lib/supabase-definitions";
import { getUserModel } from "./getUser";

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
    return "/login";
  } else {
    const user = await getUserModel(activatedUser.user.id);
    if (!user.ok || user.val.user_type == ProfileKeys.user_types.inactive) {
      return "/inactive";
    }
  }
  return finalRedirect;
};
