"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";

/**
 * This page is used to perform the signout action.
 * @returns {Element} The signout page.
 */
export default function Page() {
  const router = useRouter();
  const supabase = createClientComponent();
  const { mutateUser, mutateUserIsAdmin } = useUser();

  useEffect(() => {
    // Perform sign out and redirect only on the client side
    const signOutAndRedirect = async () => {
      await supabase.auth.signOut();
      await mutateUser();
      await mutateUserIsAdmin();
      router.push("/");
    };
    signOutAndRedirect();
  }, [mutateUser, mutateUserIsAdmin, router, supabase.auth]);
  return (
    <>
      <title>Signout</title>
    </>
  );
}
