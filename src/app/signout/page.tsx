"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";

export default function Page() {
  const router = useRouter();
  const supabase = createClientComponent();
  const { mutateUser } = useUser();

  useEffect(() => {
    // Perform sign out and redirect only on the client side
    const signOutAndRedirect = async () => {
      await supabase.auth.signOut();
      await mutateUser();
      router.push("/");
    };
    signOutAndRedirect();
  }, [mutateUser, router, supabase.auth]);
  return (
    <>
      <title>Signout</title>
    </>
  );
}
