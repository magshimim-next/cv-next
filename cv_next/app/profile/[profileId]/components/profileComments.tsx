"use server";
import logger from "@/server/base/logger";
import { fetchUserComments } from "@/app/actions/comments/fetchComments";
import Comment from "./comment";

export default async function ProfileComments({ user }: { user: UserModel }) {
  const commentsResult = await fetchUserComments(user.id);
  if (commentsResult === null) {
    logger.error("Couldn't get CVs by user");
    return <div>Error Fetching user&apos;s CVs</div>;
  }

  return (
    <div className="grid grid-cols-1 justify-evenly gap-x-4 md:grid-cols-2 lg:grid-cols-3">
      {commentsResult ? (
        commentsResult.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))
      ) : (
        <></>
      )}
      {/* <TriggerPagination callbackTrigger={fetchCvsCallback} /> */}
    </div>
  );
}
