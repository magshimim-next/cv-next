"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Definitions from "@/lib/definitions";
import { useTheme } from "next-themes";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";

export default function Page() {
  const supabase = createClientComponent();
  const { theme } = useTheme();
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme={theme}
      providers={["google"]}
      redirectTo={
        process.env.NEXT_PUBLIC_BASE_URL + Definitions.AUTH_CALLBACK_REDIRECT
      }
      onlyThirdPartyProviders
    />
  );
}
