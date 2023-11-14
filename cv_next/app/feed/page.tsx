import { Suspense } from "react";
import fetchCvs from "./actions/fetchCvs";
import Feed from "./components/feed";

export default async function Page() {

  const fetchedCvs = await fetchCvs({lastId: undefined});

  return (
    <main>
      <div className="container mx-auto space-y-8 p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <Feed initialBatch={fetchedCvs} />
        </Suspense>
      </div>
    </main>
  )
}
