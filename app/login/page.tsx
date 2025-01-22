"use client";
import { Suspense } from "react";
import Login from "./components/login";

export default function Page() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    </main>
  );
}
