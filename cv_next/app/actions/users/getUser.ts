"use server";

import { getUserById } from "@/server/api/users";
import { Err } from "@/lib/utils";
import { logErrorWithTrace } from "@/server/base/logger";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { notFound } from "next/navigation";
import { ProfileKeys } from "@/lib/supabase-definitions";
import { User } from "@supabase/supabase-js";

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

//expose auth.getUser to client
type UserSessionResponse =
  | {
      data: {
        user: User
      }
      error: null
    }
  | {
      data: {
        user: undefined
      }
      error: {
        message: string,
        status: number | undefined
      }
    };
export const getUserSession = async ():Promise<UserSessionResponse> => {
  const supabase = SupabaseHelper.getSupabaseInstance();
  const userSession = await supabase.auth.getUser();
  if (!userSession.error) {
    return userSession;
  } else {
    return {
      data: {
        user: undefined
      },
      error: {
        message: userSession.error.message,
        status: userSession.error.status
      }
    };
  }
};

export const handleCurrentUser = async (
  finalRedirect: string
): Promise<string> => {
  const supabase = SupabaseHelper.getSupabaseInstance();
  const { data: activatedUser, error } = await supabase.auth.getUser();
  if (error || !activatedUser?.user) {
    return "/login";
  } else {
    const result = await getUserModel(activatedUser.user.id);
    if (result === null || !result.ok) {
      notFound();
    } else {
      if (result.val.user_type == ProfileKeys.user_types.inactive || error) {
        return "/inactive";
      }
    }
  }
  return finalRedirect;
};
