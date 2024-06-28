"use client";
import Definitions from "@/lib/definitions";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function Page() {
  const supabase = createClientComponent();

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_BASE_URL + Definitions.AUTH_CALLBACK_REDIRECT,
      },
    });
  };

  return (
    <main>
      <div className="place-items-center px-4 text-sm font-medium">
        <div className="p-4 md:p-5 lg:p-6">
          <div className="grid gap-y-3">
            <Button className="c-bOcPnF" onClick={signIn}>
              <FcGoogle />
              <span style={{ marginLeft: "5px" }}>Sign in with Google</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
