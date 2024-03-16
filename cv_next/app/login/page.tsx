"use client"
import { Auth } from "@supabase/auth-ui-react"
import { useSupabase } from "@/hooks/supabaseHooks"
import { ThemeSupa } from "@supabase/auth-ui-shared"

export default function Page() {
  const supabase = useSupabase()

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      providers={["google"]}
      redirectTo="http://localhost:3000/auth/callback"
      onlyThirdPartyProviders
    />
  )
}
