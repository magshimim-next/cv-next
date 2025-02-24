import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Definitions, {
  API_DEFINITIONS,
  Visible_Error_Messages,
} from "./lib/definitions";
import { ProfileKeys, Tables } from "./lib/supabase-definitions";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (request.nextUrl.pathname.startsWith(API_DEFINITIONS.CVS_API_BASE)) {
    return NextResponse.next();
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options: _options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: activatedUser, error: errorGetUser } =
    await supabase.auth.getUser();
  if (errorGetUser || !activatedUser?.user) {
    const nextUrl = new URL(`/${Definitions.LOGIN_REDIRECT}`, request.url);
    nextUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(nextUrl);
  }

  if (request.nextUrl.pathname == "/admin") {
    const { data: admins, error: errorWhitelist } = await supabase
      .from(Tables.admins)
      .select("*")
      .eq(ProfileKeys.id, activatedUser.user.id)
      .single();
    if (admins?.id == null || errorWhitelist) {
      const nextUrl = new URL(`/not_found`, request.url);
      return NextResponse.redirect(nextUrl);
    }
    return supabaseResponse;
  }

  const { data: whitelisted, error: errorWhitelist } = await supabase
    .from(Tables.whitelisted)
    .select("*")
    .eq(ProfileKeys.id, activatedUser.user.id)
    .single();
  if (whitelisted?.id == null || errorWhitelist) {
    const nextUrl = new URL(
      `/?error=${Visible_Error_Messages.InactiveUser.keyword}`,
      request.url
    );
    return NextResponse.redirect(nextUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/feed",
    "/cv/:cvId*",
    "/profile/:profileUsername*",
    "/upload",
    "/hall",
    "/first_login/:profileUsername*",
    "/admin",
  ],
};
