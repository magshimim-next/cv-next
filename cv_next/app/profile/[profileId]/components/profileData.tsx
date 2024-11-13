"use server";

import { revalidateTag } from "next/cache";
import { getCvsByUserId } from "@/server/api/cvs";
import logger from "@/server/base/logger";
import { fetchUserComments } from "@/app/actions/comments/fetchComments";
import { getCvsFromComments } from "@/app/actions/cvs/fetchCvs";
import DropdownCover from "@/components/ui/dropdownCover";
import CategoryCounter from "./categoryCounter";
import { ProfilePersonalData } from "./profilePersonalData";

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
  const revalidate = () => {
    "use server";

    revalidateTag("user-" + user.id);
  };

  return (
    <div className="flex flex-col items-center">
      <ProfilePersonalData user={user} revalidationFn={revalidate} />
      <DropdownCover title="Statistics">
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
      </DropdownCover>
    </div>
  );
}
