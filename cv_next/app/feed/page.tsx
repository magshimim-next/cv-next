import { Suspense } from "react"
import { fetchCvsForFeed } from "@/app/actions/fetchCvs"
import Feed from "./components/feed"

export default async function Page() {
  const fetchedCvs = await fetchCvsForFeed({ page: undefined })

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Feed initialBatch={fetchedCvs} />
      </Suspense>
    </main>
  )
}
