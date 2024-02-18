"use server"

import { getAllCommentsByCVId } from "@/server/api/comments"

export const fetchComments = async (
  cvId: string
): Promise<CommentModel[] | null> => {
  return await getAllCommentsByCVId(cvId)
}
