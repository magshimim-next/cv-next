import { Suspense } from "react"
import { fetchCvsForFeed } from "@/app/actions/fetchCvs"
import Feed from "./components/feed"
import Definitions from "@/lib/definitions"

export default async function Page() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Feed />
      </Suspense>
    </main>
  )
}
