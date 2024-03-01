'use client'
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr";

export default function Page() {

  // This should probably move to a different location, wasnt sure where to put it tho...
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  supabase.auth.signOut()

  redirect("/")

  return (
    <main>
      <Button>Signout</Button>
    </main>
  )
}
