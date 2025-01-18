"use server";
import { NextResponse } from "next/server";
import Definitions, { Visible_Error_Messages } from "@/lib/definitions";
import SupabaseHelper from "@/server/api/supabaseHelper";
import { checkRedirect } from "@/lib/utils";
import logger from "@/server/base/logger";
import { validateUsername, isCurrentFirstLogin } from "@/server/api/users";
export async function GET(request: Request) {
  const { searchParams, origin: _origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") || "";
  if (code) {
    const supabase = SupabaseHelper.getSupabaseInstance();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (checkRedirect(next)) {
        const isValid = await validateUsername();
        if (isValid.ok) {
          logger.info(
            validateUsername.name,
            "Username was generated successfully: " + isValid.val
          );

          const isFirstLogin = await isCurrentFirstLogin();
          if (isFirstLogin.ok) {
            next = `${Definitions.FIRST_LOGIN_REDIRECT}/${isValid.val}`;
          }

          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}${Definitions.AUTH_DEFAULT_REDIRECT}${next}`
          );
        } else {
          logger.error(isValid.errors, "Error in validating Username");
          const nextUrl = new URL(
            `/?error=${Visible_Error_Messages.InactiveUser.keyword}`,
            process.env.NEXT_PUBLIC_BASE_URL
          );
          return NextResponse.redirect(nextUrl);
        }
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
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
}
