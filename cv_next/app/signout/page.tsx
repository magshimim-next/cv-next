"use client";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { useApiFetch } from "@/hooks/useAPIFetch";
import { API_DEFINITIONS } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const supabase = createClientComponent();
  const fetchFromApi = useApiFetch();

  useEffect(() => {
    const signOutAndRedirect = async () => {
      await supabase.auth.signOut();
      await fetchFromApi(API_DEFINITIONS.REVALIDATE_ENDPOINT, "", {});
      router.push("/");
    };

    signOutAndRedirect();
  }, [fetchFromApi, router, supabase]);

  return <></>;
}
