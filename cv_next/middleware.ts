import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  const { data: activatedUser, error } = await supabase.auth.getUser()
  if(error || !activatedUser?.user) {
    return NextResponse.rewrite(new URL("/login", request.url))
  }
  else {
    const { data: user, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", activatedUser.user.id)
    .single()
    if (user?.user_type == "inactive" || error)
    {
      return NextResponse.rewrite(new URL("/inactive", request.url))
    }
  }
  return response
}

export const config = { matcher: ["/feed"] }
