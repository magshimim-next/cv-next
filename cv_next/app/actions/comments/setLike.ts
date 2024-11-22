"use server";

import { Err } from "@/lib/utils";
import { setLiked as setCommentLike } from "@/server/api/comments";
import { getCurrentId } from "@/server/api/users";
import logger, { logErrorWithTrace } from "@/server/base/logger";

export const upvoteComment = async (
  commentId: string,
  liked: boolean,
  userId: string
): Promise<Result<void, string>> => {
  const currentIdResult = await getCurrentId();
  if (!currentIdResult.ok) {
    logErrorWithTrace(currentIdResult);
    return Err(
      `An error has occurred while ${liked ? "liking" : "unliking"} the comment. Please try again later.`
    );
  }
  if (currentIdResult.val != userId) {
    logger.error(`${currentIdResult.val} tried liking with a different ID!`);
    return Err(
      `An error has occurred while ${liked ? "liking" : "unliking"} the comment. Please try again later.`
    );
  }
  const setLikeResult = await setCommentLike(commentId, liked, userId);
  if (setLikeResult.ok) {
    return setLikeResult;
  } else {
    logErrorWithTrace(setLikeResult);
    return Err(
      `An error has occurred while ${liked ? "liking" : "unliking"} the comment. Please try again later.`
    );
  }
};
