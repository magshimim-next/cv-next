import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_DEFINITIONS } from "./lib/definitions";
import { ProfileKeys, Tables } from "./lib/supabase-definitions";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  if (
    request.nextUrl.pathname.startsWith(API_DEFINITIONS.CVS_API_BASE) ||
    request.nextUrl.pathname.startsWith(API_DEFINITIONS.USERS_API_BASE)
  ) {
    return NextResponse.next();
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: activatedUser, errorGetUser } = await supabase.auth.getUser();
  if (errorGetUser || !activatedUser?.user) {
    const nextUrl = new URL("/login", request.url);
    nextUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(nextUrl);
  }

  const { data: whitelisted, errorWhitelist } = await supabase
    .from(Tables.whitelisted)
    .select("*")
    .eq(ProfileKeys.id, activatedUser.user.id)
    .single();

  if (whitelisted?.id == null || errorWhitelist) {
    const nextUrl = new URL("/inactive", request.url);
    return NextResponse.redirect(nextUrl);
  }

  return response;
}

export const config = { matcher: ["/feed"] };
