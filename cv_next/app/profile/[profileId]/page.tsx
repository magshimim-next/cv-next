"use server";

import { notFound } from "next/navigation";
import { getUser } from "@/app/actions/users/getUser";
import ProfileData from "./components/profileData";
import ProfileComments from "./components/comments/profileComments";
import ProfileCvs from "./components/profileCvs/profileCvs";
import { getCvsByUserId } from "@/server/api/cvs";

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

  const cvs = await getCvsByUserId(result.val.id);
  if (cvs === null) {
    //handle better
    notFound();
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[40%_60%] md:gap-x-4">
        <section className="h-[78.75rem] flex-col rounded-lg">
          <ProfileCvs cvs={cvs} />
        </section>

        <section className="h-[78.75rem] flex-col self-start">
          <div>
            <ProfileData user={result.val} />
          </div>
          <div className="mt-5 justify-center">
            <ProfileComments user={result.val} />
          </div>
        </section>
      </div>
    </div>
  );
}
