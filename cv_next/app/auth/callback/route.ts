"use server";
import { NextResponse } from "next/server";
import Definitions from "@/lib/definitions";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { checkRedirect } from "@/lib/utils";
import logger from "@/server/base/logger";

export async function GET(request: Request) {
  const { searchParams, origin: _origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "";

  if (code) {
    const supabase = SupabaseHelper.getSupabaseInstance();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (checkRedirect(next)) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}${Definitions.AUTH_DEFAULT_REDIRECT}${next}`
        );
      } else {
        const notFoundUrl = new URL(
          "/not-found",
          process.env.NEXT_PUBLIC_BASE_URL
        );
        return NextResponse.redirect(notFoundUrl);
      }
    } else {
      logger.error(error, "Error at auth callback");
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`); //TODO: move to regular error page
}
