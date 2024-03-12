"use client"

import useSWR from "swr"
import { fetchComments } from "@/app/actions/comments/fetchComments"
import Comment from "./comment"

export default function CommentsSection({ cv }: { cv: CvModel }) {
  const { data: comments } = useSWR(cv.id, fetchComments)

  return (
    <>
      {comments
        ? comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        : null}
    </>
  )
}
