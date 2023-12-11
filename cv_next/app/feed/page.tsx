import { Suspense } from "react";
import { fetchCvs } from "@/app/actions/cvs";
import Feed from "./components/feed";

export default async function Page() {

  const fetchedCvs = await fetchCvs({lastId: undefined});

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Feed initialBatch={fetchedCvs} />
      </Suspense>
    </main>
  )
}
