"use server";

import { notFound } from "next/navigation";
import { unstable_cache, revalidateTag } from "next/cache";
import { Metadata } from "next";
import { getUserModel } from "@/app/actions/users/getUser";
import { getCvsByUserId } from "@/server/api/cvs";
import { ScrollToTop } from "@/components/ui/scrollToTop";
import ProfileData from "./components/profileData";
import ProfileCvs from "./components/profileCvs";

export async function generateMetadata({
  params,
}: {
  params: { profileUsername: string };
}): Promise<Metadata> {
  const { profileUsername } = params;
  const cleanUsername = decodeURIComponent(profileUsername);
  const userFetcher = await getUserModel(cleanUsername);

  revalidateTag("user-" + cleanUsername);

  const getCachedUser = unstable_cache(
    async () => await userFetcher,
    [cleanUsername],
    { tags: ["user-" + cleanUsername] }
  );

  const result = await getCachedUser();

  if (result === null || !result.ok) {
    notFound();
  }
  return {
    title: result.val.display_name,
  };
}

export default async function Page({
  params,
}: {
  params: { profileUsername: string };
}) {
  const { profileUsername } = params;
  const cleanUsername = decodeURIComponent(profileUsername);
  const userFetcher = await getUserModel(cleanUsername);

  revalidateTag("user-" + cleanUsername);

  const getCachedUser = unstable_cache(
    async () => await userFetcher,
    [cleanUsername],
    { tags: ["user-" + cleanUsername] }
  );

  const result = await getCachedUser();

  if (result === null || !result.ok) {
    notFound();
  }

  const cvs = await getCvsByUserId(result.val.id);

  return (
    <div>
      <div className="md:hidden">
        <ScrollToTop />
      </div>
      {cvs?.length ? (
        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[35%_65%] md:gap-x-6">
          <section className=" flex-col self-start">
            <div>
              <ProfileData user={result.val} />
            </div>
          </section>
          <section className="flex-col rounded-lg">
            <ProfileCvs cvs={cvs} />
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-4 md:gap-x-4">
          <section className=" flex-col self-start">
            <div style={{ width: "60%", margin: "auto" }}>
              <ProfileData user={result.val} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
