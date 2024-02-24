import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function Page() {
  redirect("/")

  return (
    <main>
      <Button>Signout</Button>
    </main>
  )
}
