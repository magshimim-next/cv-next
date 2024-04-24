import "server-only"

import { createClient, SupabaseClient } from "@supabase/supabase-js"
import {
  createBrowserClient,
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr"
import { cookies } from "next/headers"
import MyLogger from "@/server/base/logger"

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
              MyLogger.logInfo(
                "Error @ SupabaseHelper::createServerComponent",
                error
              )
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: "", ...options })
            } catch (error) {
              MyLogger.logInfo(
                "Error @ SupabaseHelper::createServerComponent",
                error
              )
            }
          },
        },
      }
    )
  }
}
