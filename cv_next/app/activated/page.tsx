"use client";
import Hero from "@/components/pages/activated"
import FirebaseAuthHelper from "../../server/api/firebaseAuthHelper";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if(!FirebaseAuthHelper.checkLoggedUserActivation())
    {
      router.push("/login");
    }
  })
  
  return (
    <main>
      <Hero />
    </main>
  )
}
