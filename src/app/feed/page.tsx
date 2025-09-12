import { Suspense } from "react";
import Feed from "./components/feed";

export default async function Page() {
  return (
    <main>
      <title>Feed</title>
      <Suspense fallback={<div>Loading...</div>}>
        <Feed />
      </Suspense>
    </main>
  );
}
