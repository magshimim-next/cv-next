import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import Definitions from "@/lib/definitions"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: activeSession } = await supabase.auth.getSession()

  if (req.nextUrl.pathname.startsWith("/logout")) {
    supabase.auth.signOut()
    res.cookies.delete(process.env.NEXT_COOKIE_AUTH_NAME!)
    return res
  }
  if (!activeSession.session) {
    return NextResponse.rewrite(new URL("/login", req.url))
  }
  if (req.nextUrl.pathname.startsWith("/logout")) {
    supabase.auth.signOut()
    res.cookies.delete(Definitions.NEXT_COOKIE_AUTH_NAME!)
    return res
  }
  if (!activeSession.session) {
    return NextResponse.rewrite(new URL("/login", req.url))
  }

  const { data: user, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", activeSession.session.user.id)
    .single()
  if (user?.user_type == "inactive") {
    return NextResponse.rewrite(new URL("/inactive", req.url))
  }
}

export const config = { matcher: ["/feed", "/logout"] }
