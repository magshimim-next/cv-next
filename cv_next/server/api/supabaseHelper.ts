import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
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
    logger.debug("meow");
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieEncoding: "raw",
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              logger.error(error, "SupabaseHelper::getSupabaseInstance");
            }
          },
        },
      }
    );
  }
}
