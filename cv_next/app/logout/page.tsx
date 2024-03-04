'use client'
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/hooks/supabaseHooks";
export default function Page() {

  const supabase = useSupabase()
  supabase.auth.signOut()

  redirect("/")

  return (
    <main>
      <Button>Signout</Button>
    </main>
  )
}
