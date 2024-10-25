import { redirect } from "next/navigation";
import { AboutLayout } from "@/app/about/components/aboutLayout";
import { getUser } from "@/app/actions/users/getUser";

export default async function Page() {
  const userDataResponse = await getUser();
  if (userDataResponse.ok) {
    redirect(`/feed`);
  }

  return (
    <main>
      <AboutLayout />
    </main>
  );
}
