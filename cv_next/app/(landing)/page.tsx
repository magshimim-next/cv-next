"use client";
import { Suspense, useEffect } from "react";
import Feed from "@/app/feed/components/feed";
import { useUser } from "@/hooks/useUser";
import { AboutLayout } from "@/app/about/components/aboutLayout";

export default function Page() {
  const { loading, loginState, mutateUser } = useUser();

  useEffect(() => {
    mutateUser();
  }, [mutateUser]);

  if (loading || !loginState) return <AboutLayout />;

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Feed />
      </Suspense>
    </main>
  );
}
