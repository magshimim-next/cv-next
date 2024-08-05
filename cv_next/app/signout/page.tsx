"use client";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const supabase = createClientComponent();
  useEffect(() => {
    const signOutAndRedirect = async () => {
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    };

    signOutAndRedirect();
  }, [router, supabase]);

  return <></>;
}
