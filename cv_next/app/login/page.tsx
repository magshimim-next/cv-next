"use client";
import { Auth } from "@supabase/auth-ui-react";
import { useSupabase } from "@/hooks/supabase";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Link_Definitions } from "@/lib/definitions";
import { useTheme } from "next-themes";

export default function Page() {
  const supabase = useSupabase();
  const { theme } = useTheme();
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme={theme}
      providers={["google"]}
      redirectTo={
        process.env.NEXT_PUBLIC_BASE_URL +
        Link_Definitions.AUTH_CALLBACK_REDIRECT
      }
      onlyThirdPartyProviders
    />
  );
}
