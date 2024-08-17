import { Suspense } from "react";
import Feed from "./components/feed";
import { handleCurrentUser } from "../actions/user/fetchUserInfo";
import { redirect } from "next/navigation";

export default async function Page() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Feed />
      </Suspense>
    </main>
  );
}
