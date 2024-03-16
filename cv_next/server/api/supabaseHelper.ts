import "server-only"

import { createClient, SupabaseClient } from "@supabase/supabase-js"
import {
  createBrowserClient,
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr"
import { cookies } from "next/headers"

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
      SupabaseHelper.supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    }
    return SupabaseHelper.supabase
  }

  /**
   * Returns the Supabase server component instance.
   *
   * @return {SupabaseClient} The Supabase client instance
   */
  public static createServerComponent(): SupabaseClient {
    const cookieStore = cookies()

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: "", ...options })
            } catch (error) {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  }
}
