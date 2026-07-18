import { redirect } from "next/navigation";
import { getUser } from "@/app/actions/users/getUser";
import { LoginLayout } from "@/app/login/components/loginLayout";

/**
 * This page is the main page of the site.
 * @param {any} root0 The search params sent to the page.
 * @param {any} root0.searchParams The search params sent to the page
 * @param {string} root0.searchParams.error The error message from the url parameters.
 * @returns {JSX.Element} The CV page.
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
