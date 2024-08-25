"use client";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const supabase = createClientComponent();
  supabase.auth.signOut();
  router.push("/");
  return <></>;
}
