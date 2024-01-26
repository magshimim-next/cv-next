import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies} from "next/headers"
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function Page() {

  //const supabase = createServerComponentClient({cookies})
  
  redirect("/");

  return (
    <main>
      <Button>
        Signout
      </Button>
    </main>
  )
}
