"use client";
import Hero from "@/components/pages/activated"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { useSession } from 'next-auth/react'

export default function ServerPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
        redirect('/api/auth/signin?callbackUrl=/activated')
    }
})

    if (!session?.user) return
    
    return (
      <main>
      <Hero />
    </main>
    )

}