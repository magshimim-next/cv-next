"use server";

import SupabaseHelper from "@/server/api/supabaseHelper";
import { ProfileKeys, Tables } from "@/lib/supabase-definitions";

export const handleCurrentUser = async (
  finalRedirect: string
): Promise<string> => {
  const supabase = await SupabaseHelper.getSupabaseInstance();
  const { data: activatedUser, error } = await supabase.auth.getUser();
  if (error || !activatedUser?.user) {
    return "/login";
  } else {
    const { data: user, error } = await supabase
      .from(Tables.profiles)
      .select("*")
      .eq(ProfileKeys.id, activatedUser.user.id)
      .single();

    if (user?.user_type == ProfileKeys.user_types.inactive || error) {
      return "/inactive";
    }
  }
  return finalRedirect;
};
