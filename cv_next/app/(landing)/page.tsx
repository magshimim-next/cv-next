import { redirect } from "next/navigation";
import { getUser } from "@/app/actions/users/getUser";
import { LoginLayout } from "@/app/login/components/loginLayout";

export default async function Page() {
  const userDataResponse = await getUser();
  if (userDataResponse.ok) {
    redirect(`/feed`);
  }

  return (
    <main>
      <title>CV-Next</title>
      <LoginLayout />
    </main>
  );
}
