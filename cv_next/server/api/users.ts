import "server-only";

import SupabaseHelper from "./supabaseHelper";
import { Ok, Err } from "@/lib/utils";
import { Tables, ProfileKeys } from "@/lib/supabase-definitions";

export async function getUserIdByName(
  fullName: string
): Promise<Result<string[], string>> {
  try {
    console.log(fullName);
    let supabase = await SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.profiles)
      .select(ProfileKeys.id)
      .or("full_name.ilike."+fullName+", username.ilike."+fullName);
      const { data: userIds, error } = await query;
    if (error) {
      console.log(error);
      return Err("Error @ " + getUserIdByName.name + "\n", error);
    }
    let Ids = userIds.map((idStruct) => idStruct.id);
    console.log(Ids);
    return Ok(Ids);
  } catch (error) {
    console.log(error);
    return Err("Error @ " + getUserIdByName.name + "\n" + error);
  }
}


