"use server";

import { notFound } from "next/navigation";
import { getUser } from "@/app/actions/users/getUser";
import ProfileData from "./components/profileData";
import Feed from "../../feed/components/feed";
import ProfileComments from "./components/profileComments";

export default async function Page({
  params,
}: {
  params: { profileId: string };
}) {
  const { profileId } = params;

  const result = await getUser(profileId);

  if (result === null || !result.ok) {
    notFound();
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[40%_60%] md:gap-x-4">
        <section className="h-[78.75rem] flex-col rounded-lg">
          {/* TODO: add a filter that will be based on the user, remove filter bar*/}
          {/* <Feed /> */}
        </section>

        <section className="h-[78.75rem] flex-col self-start">
          <div
            className={`mb-3 rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800`}
          >
            <ProfileData user={result.val} />
          </div>
          <div className="mt-5 flex justify-center">
            <ProfileComments user={result.val} />
          </div>
        </section>
      </div>
    </div>
  );
}
