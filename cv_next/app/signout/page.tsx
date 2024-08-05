"use client";
import { useSupabase } from "@/hooks/supabase";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const supabase = useSupabase();
  supabase.auth.signOut();
  router.push("/");
  return <></>;
}
