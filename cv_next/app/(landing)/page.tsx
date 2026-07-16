import { redirect } from "next/navigation";
import { getUser } from "@/app/actions/users/getUser";
import { LoginLayout } from "@/app/login/components/loginLayout";

/**
 *
 * @param root0
 * @param root0.searchParams
 * @param root0.searchParams.error
 */
export default async function Page({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const userDataResponse = await getUser();

  if (userDataResponse.ok && !searchParams.error) {
    redirect(`/feed`);
  }

  return (
    <main>
      <title>CV-Next</title>
      <LoginLayout />
    </main>
  );
}
