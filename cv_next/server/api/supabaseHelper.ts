import "server-only"

import { createClient, SupabaseClient } from "@supabase/supabase-js"

export default class SupabaseHelper<T> {
  private static supabase: SupabaseClient

  /**
   * Returns the Supabase client instance. If the instance is not already
   * created, it creates a new instance and returns it.
   *
   * @return {SupabaseClient<Database>} The Supabase client instance
   */
  public static getSupabaseInstance(): SupabaseClient<Database> {
    if (
      SupabaseHelper.supabase === null ||
      SupabaseHelper.supabase === undefined
    ) {
      SupabaseHelper.supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    }
    return SupabaseHelper.supabase
  }
}
