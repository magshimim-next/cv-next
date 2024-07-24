import { Suspense } from "react";
import Feed from "./components/feed";
import { handleCurrentUser } from "../actions/users/handleUserState";
import { redirect } from "next/navigation";

export default async function Page() {
  const redirectOutput = await handleCurrentUser("/feed");
  if (redirectOutput != "/feed") {
    redirect(redirectOutput);
  }
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Feed />
      </Suspense>
    </main>
  );
}
