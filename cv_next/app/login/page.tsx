"use client";
import { Auth } from "@supabase/auth-ui-react";
import { useSupabase } from "@/hooks/supabase";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Definitions from "@/lib/definitions";
export default function Page() {
  const supabase = useSupabase();
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      providers={["google"]}
      redirectTo={
        process.env.NEXT_PUBLIC_BASE_URL + Definitions.AUTH_CALLBACK_REDIRECT
      }
      onlyThirdPartyProviders
    />
  );
}
