"use client";

import useSWR from "swr";
import { fetchCvComments } from "@/app/actions/comments/fetchComments";
import Comment from "./comment";
import { useEffect, useMemo, useState } from "react";
import { useSupabase } from "@/hooks/supabase";
import { useRouter } from "next/navigation";

export default function CommentsSection({ cv }: { cv: CvModel }) {
  const router = useRouter();
  const { data: comments } = useSWR(cv.id, fetchCvComments);
  const supabase = useSupabase();
  const [userId, setUserId] = useState<string>("");
  const [commentsOfComments, setCommentsOfComments] = useState<
    Map<string, any[]>
  >(new Map<string, any[]>());

  const memoizedCommentsOfComments = useMemo(() => {
    const copyOfCommentOfComments: Map<string, any[]> = new Map<
      string,
      any[]
    >();

    comments?.forEach((comment) => {
      if (!comment.parent_comment_Id)
        copyOfCommentOfComments.set(comment.id, []);
    });

    comments?.forEach((comment) => {
      if (comment.parent_comment_Id)
        copyOfCommentOfComments.set(
          comment.parent_comment_Id,
          copyOfCommentOfComments
            .get(comment.parent_comment_Id)
            ?.concat([comment]) as Array<any>
        );
    });

    return copyOfCommentOfComments;
  }, [comments]);

  useEffect(() => {
    setCommentsOfComments(memoizedCommentsOfComments);
  }, [memoizedCommentsOfComments, setCommentsOfComments]);

  useEffect(() => {
    async function getUser() {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId)
        router.push("/inactive"); //TODO: redirect to login with next param
      else setUserId(userId);
    }
    getUser();
  }, [router, supabase.auth]);

  return (
    <>
      {comments
        ? comments.map((comment: CommentModel) =>
            !comment.parent_comment_Id ? (
              <Comment
                key={comment.id}
                comment={comment}
                userId={userId}
                commentsOfComment={
                  commentsOfComments.get(comment.id) as Array<any>
                }
                setCommentsOfComments={setCommentsOfComments}
              />
            ) : null
          )
        : null}
    </>
  );
}
