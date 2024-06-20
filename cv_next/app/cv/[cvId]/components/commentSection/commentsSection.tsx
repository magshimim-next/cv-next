"use client"

import useSWR from "swr"
import { fetchComments } from "@/app/actions/comments/fetchComments"
import Comment from "./comment"
import { useEffect, useState } from "react"
import { useSupabase } from "@/hooks/supabaseHooks"

export default function CommentsSection({ cv }: { cv: CvModel }) {
  const { data: comments } = useSWR(cv.id, fetchComments)
  const supabase = useSupabase()
  const [userId, setUserId] = useState<string>("")
  const [commentsOfComments, setCommentsOfComments] = useState<
    Map<string, any[]>
  >(new Map<string, any[]>())

  useEffect(() => {
    const copyOfCommentOfComments: Map<string, any[]> = new Map<string, any[]>()
    comments?.map((comment) => {
      if (!comment.parent_comment_Id)
        copyOfCommentOfComments.set(comment.id, [])
    })
    comments?.map((comment) => {
      if (comment.parent_comment_Id)
        copyOfCommentOfComments.set(
          comment.parent_comment_Id,
          copyOfCommentOfComments
            .get(comment.parent_comment_Id)
            ?.concat([comment]) as Array<any>
        )
    })
    setCommentsOfComments(copyOfCommentOfComments)
  }, [comments])

  useEffect(() => {
    async function getUser() {
      const userId = (await supabase.auth.getUser()).data.user?.id
      if (!userId) throw new Error("User not found") // TODO: handle this
      setUserId(userId)
    }
    getUser()
  }, [supabase.auth])

  return (
    <>
      {comments
        ? comments.map((comment) =>
            !comment.parent_comment_Id ? (
              <Comment
                key={comment.id}
                comment={comment}
                userId={userId}
                cv={cv}
                commentsOfComment={
                  commentsOfComments.get(comment.id) as Array<any>
                }
                setCommentsOfComments={setCommentsOfComments}
              />
            ) : null
          )
        : null}
    </>
  )
}
