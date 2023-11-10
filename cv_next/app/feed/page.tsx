import { Suspense } from "react";
import Feed from "./components/feed";

export default function Page() {
  return (
    <main>
      <div className="container mx-auto space-y-8 p-6">
        <Suspense fallback={<div>Loading...</div>}>
          {/* @ts-expect-error Async Server Component - might need a simple npm rebuild to resolve */}
          <Feed/>
        </Suspense>
      </div>
    </main>
  )
}
