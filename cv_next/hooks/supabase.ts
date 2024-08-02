import { useContext } from "react"
import { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Context } from "@/providers/supabase-provider"

export const useSupabase = <
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
>() => {
  let context = useContext(Context)

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }

  return context.supabase as SupabaseClient<Database, SchemaName>
}

export const useSession = () => {
  let context = useContext(Context)

  if (context === undefined) {
    throw new Error("useSession must be used inside SupabaseProvider")
  }

  return context.session
}
