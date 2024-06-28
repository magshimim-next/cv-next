import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import logger from "@/server/base/logger";

export default class SupabaseHelper {
  /**
   * Returns the Supabase server component instance.
   * This shouldn't be a singleton because the cookies go with each request and must be renewd
   * From the docs:
   * On the server, it basically configures a fetch call.
   * You need to reconfigure the fetch call anew for every request to your server,
   * because you need the cookies from the request.
   * @return {SupabaseClient} The Supabase server instance
   */
  public static getSupabaseInstance(): SupabaseClient<Database> {
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
              logger.error(error, "SupabaseHelper::getSupabaseInstance");
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: "", ...options });
            } catch (error) {
              logger.error(error, "SupabaseHelper::getSupabaseInstance");
            }
          },
        },
      }
    );
  }
}
