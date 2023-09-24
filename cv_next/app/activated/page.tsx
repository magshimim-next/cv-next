"use client";
import Hero from "@/components/pages/activated"
import RouteGuard from "@/components/route-guards/inactive-guard";

function ProtectedRoute() {
  return (
    <Hero />
  );
}

export default function Active() {
  
  return (
    <main>
      <RouteGuard>
        <ProtectedRoute/>
      </RouteGuard>
    </main>
  )
}

