"use client";
import { Suspense } from "react";
import { LoginLayout } from "./components/loginLayout";

export default function Page() {
  return (
    <main>
      <title>Login</title>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginLayout />
      </Suspense>
    </main>
  );
}
