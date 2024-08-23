"use client";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const supabase = createClientComponent();

  useEffect(() => {
    // Perform sign out and redirect only on the client side
    const signOutAndRedirect = async () => {
      await supabase.auth.signOut();
      router.push("/");
    };

    signOutAndRedirect();
  }, [supabase, router]);
  return <></>;
}
