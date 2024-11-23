import { Suspense } from "react";
import { AboutLayout } from "./components/aboutLayout";

export default function Page() {
  return (
    <main>
      <Suspense>
        <AboutLayout />
      </Suspense>
    </main>
  );
}
