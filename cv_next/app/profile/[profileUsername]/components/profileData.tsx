"use server";

import { revalidateTag } from "next/cache";
import { getCvsByUserId } from "@/server/api/cvs";
import logger from "@/server/base/logger";
import { fetchUserComments } from "@/app/actions/comments/fetchComments";
import { getCvsFromComments } from "@/app/actions/cvs/fetchCvs";
import DropdownCover from "@/components/ui/dropdownCover";
import { userIsAdmin } from "@/server/api/users";
import CategoryCounter from "./categoryCounter";
import { ProfilePersonalData } from "./profilePersonalData";

/**
 * ProfileData component displays the profile information and statistics for a user.
 * @param {UserModel} user - The user object containing profile information.
 * @returns {JSX.Element} The ProfileData component.
 */
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
  const cvsFromComments = await getCvsFromComments(commentsResult);
  const revalidate = () => {
    "use server";

    revalidateTag("user-" + user.username);
  };

  const resultAdminCheck = await userIsAdmin();

  return (
    <div className="flex flex-col">
      <ProfilePersonalData
        user={user}
        revalidationFn={revalidate}
        isCurrentAdmin={resultAdminCheck.ok}
      />

      <DropdownCover title="Statistics">
        <div className="col-md-12 mt-2 flex justify-center">
          <CategoryCounter
            cvs={cvs}
            title="Most CVs are categorized under"
            error={`No CVs found, ${user.display_name || user.username} needs to upload a CV!`}
          />
        </div>
        <div className="flex justify-center">
          <CategoryCounter
            cvs={cvsFromComments}
            title="Most comments are from CVs that are categorized under"
            error={`No CVs found, ${user.display_name || user.username} needs to comment a bit more!`}
          />
        </div>
      </DropdownCover>
    </div>
  );
}
