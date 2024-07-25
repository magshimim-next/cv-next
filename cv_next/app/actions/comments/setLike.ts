"use server"

import { Err } from "@/lib/utils"
import { setLiked as setCommentLike } from "@/server/api/comments"
import { logErrorWithTrace } from "@/server/base/logger"

export const upvoteComment = async (
  commentId: string,
  liked: boolean,
  userId: string
): Promise<Result<void, string>> => {
  const result = await setCommentLike(commentId, liked, userId)
  if (result.ok) {
    return result
  } else {
    logErrorWithTrace(result)
    return Err(
      `An error has occurred while ${liked ? "liking" : "unliking"} the comment. Please try again later.`
    )
  }
}
