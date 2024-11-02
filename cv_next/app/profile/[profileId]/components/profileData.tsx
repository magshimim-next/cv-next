"use server";
import Image from "next/image";
import { getCvsByUserId } from "@/server/api/cvs";
import logger from "@/server/base/logger";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { fetchUserComments } from "@/app/actions/comments/fetchComments";
import { getCvsFromComments } from "@/app/actions/cvs/fetchCvs";
import CategoryCounter from "./categoryCounter";
import EditableUsername from "./editables/editableUsername";
import EditableWorkStatus from "./editables/editableWorkStatus";

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
        className={`fill-available mb-3 rounded-lg border-b border-card-border p-6 text-base bg-card-background`}
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
        className={`mb-3 rounded-lg border-b border-card-border bg-card-background p-6 text-base`}
        style={{ width: "100%" }}
      >
        <div className="flex justify-center">
          <p className="inline-flex items-center text-xl font-semibold text-text-color">
            Statistics
          </p>
        </div>
        <div className="col-md-12 mt-2 flex justify-center">
          <CategoryCounter
            cvs={cvs}
            title="Most CVs are categorized under"
            error={`No CVs found, ${user.username || user.full_name} needs to upload a CV!`}
          />
        </div>
        <div className="flex justify-center">
          <CategoryCounter
            cvs={CVsFromComments}
            title="Most comments are from CVs that are categorized under"
            error={`No CVs found, ${user.username || user.full_name} needs to comment a bit more!`}
          />
        </div>
      </div>
    </div>
  );
}
