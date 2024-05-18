"use server";

import { notFound } from "next/navigation";
import { getUserById } from "@/server/api/users";
import { decodeValue } from "@/lib/utils";
/*import { CvPreview } from "./components/cvPreview";
import CommentsSection from "./components/commentSection/commentsSection";
import CommentForm from "./components/commentSection/commentForm";
import CvData from "./components/cvData";*/

export default async function Page({
  params,
}: {
  params: { profileId: string };
}) {
  const { profileId } = params;

  const decodedProfileId = decodeValue(decodeURIComponent(profileId));
  if (!decodedProfileId) {
    notFound();
  }
  const profile = await getUserById(decodedProfileId);

  if (profile === null) {
    notFound();
  }
  return (
    <div>hey</div>
    /*<div>
      <CvData cv={cv} />
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[65%_35%] md:gap-x-4">
        <section className="h-[78.75rem] flex-col rounded-lg">
          {cv ? <CvPreview cv={cv} /> : null}
        </section>

        <section className="h-[78.75rem] flex-col self-start">
          <CommentForm cv={cv} />
          <CommentsSection cv={cv} />
        </section>
      </div>
    </div>*/
  );
}
