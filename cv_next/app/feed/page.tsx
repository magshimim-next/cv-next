import { Suspense } from "react";
import { getServerSession } from "next-auth/next"
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation"
import { useSession } from 'next-auth/react'
import { fetchCvs } from "@/app/actions/fetchCvs";
import Feed from "./components/feed";

export default async function Page() {
  const session = await getServerSession(options);
  if (session?.user.role == "0")
  {
    redirect("/deactivated");
  }
  const fetchedCvs = await fetchCvs({lastId: undefined});

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Feed initialBatch={fetchedCvs} />
      </Suspense>
    </main>
  )
}
