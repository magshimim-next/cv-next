import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

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

  if (!process.env.JWT_SECRET) {
    // eslint-disable-next-line no-console
    console.error(
      "Error getting JWT, please configure your env file! \n \
      Falling back to use getUser."
    );
    const { data: activatedUser, error } = await supabase.auth.getUser();
    if (error || !activatedUser?.user) {
      return NextResponse.rewrite(new URL("/login", request.url));
    }
  } else {
    const { data: activatedUser, error } = await supabase.auth.getSession();
    if (error || !activatedUser.session?.user) {
      return NextResponse.rewrite(new URL("/login", request.url));
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    try {
      const { payload } = await jwtVerify(
        activatedUser.session.access_token,
        secretKey
      );
      if (payload.sub != activatedUser.session.user.id) {
        // TODO: Someone deliberatly changed the token, maybe we should make note of that somehow
        return NextResponse.rewrite(new URL("/login", request.url));
      }
    } catch (error) {
      // TODO: Someone deliberatly changed the token, maybe we should make note of that somehow
      return NextResponse.rewrite(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = { matcher: ["/feed"] };
