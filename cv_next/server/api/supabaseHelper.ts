import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import logger from "@/server/base/logger";

export default class SupabaseHelper {
  private static supabase: SupabaseClient;

  /**
   * Returns the Supabase client instance. If the instance is not already
   * created, it creates a new instance and returns it.
   *
   * @return {SupabaseClient} The Supabase client instance
   */
  public static getSupabaseInstance(): SupabaseClient<Database> {
    if (
      SupabaseHelper.supabase === null ||
      SupabaseHelper.supabase === undefined
    ) {
      SupabaseHelper.supabase = SupabaseHelper.createServerComponent();
    }
    return SupabaseHelper.supabase;
  }

  /**
   * Returns the Supabase server component instance.
   *
   * @return {SupabaseClient} The Supabase client instance
   */
  private static createServerComponent(): SupabaseClient {
    const cookieStore = cookies();

    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              logger.error(error, "SupabaseHelper::createServerComponent");
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: "", ...options });
            } catch (error) {
              logger.error(error, "SupabaseHelper::createServerComponent");
            }
          },
        },
      }
    );
  }
}
