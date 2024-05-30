"use server";
import logger from "@/server/base/logger";
import { fetchUserComments } from "@/app/actions/comments/fetchComments";

export default async function ProfileComments({ user }: { user: UserModel }) {
  const commentsResult = await fetchUserComments(user.id);
  if (commentsResult === null) {
    logger.error("Couldn't get CVs by user");
    return <div>Error Fetching user&apos;s CVs</div>;
  }

  return <div></div>;
}
