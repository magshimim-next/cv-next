"use server";
import { NextResponse } from "next/server";
import Definitions from "@/lib/definitions";
import SupabaseHelper from "@/server/api/supabaseHelper";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  console.log("check");
  if (code) {
    const supabase = SupabaseHelper.getSupabaseInstance();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(
        `${origin}` + Definitions.AUTH_DEFAULT_REDIRECT + next
      );
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/`); //TODO: move to regular error page
}
