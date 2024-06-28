"use server";
import { getCvsByUserId } from "@/server/api/cvs";
import logger from "@/server/base/logger";
import Image from "next/image";
import CategoryCounter from "./categoryCounter";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import EditableUsername from "./editables/editableUsername";
import EditableWorkStatus from "./editables/editableWorkStatus";
import { fetchUserComments } from "@/app/actions/comments/fetchComments";
import { getCvsFromComments } from "@/app/actions/cvs/fetchCvs";

export default async function ProfileData({ user }: { user: UserModel }) {
  const cvs = await getCvsByUserId(user.id);

  if (cvs === null) {
    logger.error("Couldn't get CVs by user");
    return <div>Error Fetching user&apos;s CVs</div>;
  }
  const commentsResult = await fetchUserComments(user.id);
  if (commentsResult === null) {
    logger.error("Couldn't get CVs by user");
    return <div>Error Fetching user&apos;s CVs</div>;
  }
  const CVsFromComments = await getCvsFromComments(commentsResult);

  return (
    <div className="flex flex-col items-center">
      <div
        style={{ width: "100%" }}
        className={`fill-available mb-3 rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800`}
      >
        <div style={{ marginBottom: "10px" }} className="flex justify-center">
          <DynamicProfileImage isPlaceholder={user.avatar_url ? false : true}>
            <Image
              alt="profile"
              src={user.avatar_url || ""}
              width={90}
              height={60 * 1.4142}
              className="rounded-lg p-2"
              priority={true}
            ></Image>
          </DynamicProfileImage>
        </div>
        <div className="flex justify-center">
          <EditableUsername user={user} />
        </div>
        <div className="flex justify-center">
          <EditableWorkStatus user={user} />
        </div>
      </div>
      <div
        className={`mb-3 rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800`}
        style={{ width: "100%" }}
      >
        <div className="flex justify-center">
          <p className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white">
            Statistics
          </p>
        </div>
        <div className="col-md-12 mt-2 flex justify-center">
          <CategoryCounter
            cvs={cvs}
            title="Most CVs are categorized under"
            error="No CVs found"
          />
        </div>
        <div className="flex justify-center">
          <CategoryCounter
            cvs={CVsFromComments}
            title="Most comments are from CVs that are categorized under"
            error="No CVs found"
          />
        </div>
      </div>
    </div>
  );
}
