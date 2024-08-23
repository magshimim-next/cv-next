"use server";
import { NextResponse } from "next/server";
import Definitions from "@/lib/definitions";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { checkRedirect } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "";

  if (code) {
    const supabase = SupabaseHelper.getSupabaseInstance();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (checkRedirect(next)) {
        return NextResponse.redirect(
          `${origin}${Definitions.AUTH_DEFAULT_REDIRECT}${next}`
        );
      } else {
        return NextResponse.json(
          { error: "Failed to redirect to requested page." },
          { status: 500 }
        );
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/`); //TODO: move to regular error page
}
