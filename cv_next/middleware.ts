import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Definitions, {
  API_DEFINITIONS,
  Visible_Error_Messages,
} from "./lib/definitions";
import { PermsKeys, Tables } from "./lib/supabase-definitions";

/**
 * Next.js middleware that guards all protected routes.
 * Runs on every request matched by the config below and enforces three checks in order:
 * 1. Bypasses auth for internal CV API routes.
 * 2. Redirects unauthenticated users to the login page, preserving the intended URL in `?next`.
 * 3. Redirects users without an active member role (member/moderator/admin) to the home page with an error.
 *    Admin-only routes additionally redirect non-admins to `/not_found`.
 * Cookie forwarding follows the Supabase SSR pattern — cookies set during the auth check
 * are propagated to both the request and the response to keep the session fresh.
 * @param {NextRequest} request - The incoming Next.js request object.
 * @returns {Promise<NextResponse>} A redirect response if auth fails, or the original response with refreshed cookies.
 */
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
      cookieOptions: { domain: process.env.NEXT_PUBLIC_TOP_DOMAIN! },
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

  const { data: perm, error: permError } = await supabase
    .from(Tables.profile_perms)
    .select(PermsKeys.role)
    .eq(PermsKeys.unique_profile_id, activatedUser.user.id)
    .single();

  if (request.nextUrl.pathname == "/admin") {
    if (
      !perm ||
      (perm.role !== PermsKeys.roles_enum.admin &&
        perm.role !== PermsKeys.roles_enum.moderator) ||
      permError
    ) {
      const nextUrl = new URL(`/not_found`, request.url);
      return NextResponse.redirect(nextUrl);
    }
    return supabaseResponse;
  }

  const memberRoles = [
    PermsKeys.roles_enum.member,
    PermsKeys.roles_enum.moderator,
    PermsKeys.roles_enum.admin,
  ];
  if (!perm || permError || !memberRoles.includes(perm.role)) {
    const nextUrl = new URL(
      `/?error=${Visible_Error_Messages.PendingUser.keyword}`,
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
    "/first_login/:profileUsername*",
    "/admin",
    "/redirect",
  ],
};
