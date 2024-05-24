"use server";

import { notFound } from "next/navigation";
import { getUser } from "@/app/actions/users/getUser";
//import Feed from "../../feed/components/feed";
import Image from "next/image";
import profileIcon from "@/public/images/profile.png";

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

  const result = await getUser(profileId);

  if (result === null || !result.ok) {
    notFound();
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[40%_60%] md:gap-x-4">
        <section className="h-[78.75rem] flex-col rounded-lg">
          {/* TODO: add a filter that will be based on the user, remove filter bar*/}
          {/*<Feed />*/}
        </section>

        <section className="h-[78.75rem] flex-col self-start">
          <div
            className={`mb-3 rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800`}
            style={{ height: "150px" }}
          >
            <div className="flex flex-col items-center">
              <div className="flex justify-center">
                <Image
                  alt="profile"
                  src={result.val.avatar_url || profileIcon}
                  width={90}
                  height={60 * 1.4142}
                  className="rounded-lg p-2"
                ></Image>
              </div>
              <div className="flex justify-center">
                <p className="inline-flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                  {result.val.full_name || result.val.username}
                </p>
              </div>
            </div>
            {/*<p className="text-gray-500 dark:text-gray-400">{comment.data}</p>*/}
          </div>
        </section>
      </div>
    </div>
  );
}
