"use client";

import useSWR from "swr";
import { fetchComments } from "@/app/actions/comments/fetchComments";
import Comment from "./comment";
import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/supabaseHooks";

export default function CommentsSection({ cv }: { cv: CvModel }) {
  const { data: comments } = useSWR(cv.id, fetchComments);

  const supabase = useSupabase();
  const [userId, setUserId] = useState<string>("");
  const [CommentsOnCommentsEdit, setCommentsOfCommentsEdit] =
    useState<Map<string, boolean>>();

  const [commentStatusUpdated, setCommentStatus] = useState<boolean>(false);

  useEffect(() => {
    let mapOfComments = new Map<string, boolean>();
    comments?.map((comment) => mapOfComments.set(comment.id, false));
    console.log(mapOfComments);
    setCommentsOfCommentsEdit(mapOfComments);
  }, [comments]);

  useEffect(() => {
    console.log("CommentsOnCommentsEdit");
  }, [commentStatusUpdated]);

  useEffect(() => {
    async function getUser() {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("User not found"); // TODO: handle this
      setUserId(userId);
    }
    getUser();
  }, [supabase.auth]);

  return (
    <>
      {comments
        ? comments.map((comment) => (
            <Comment
              CommentsOnCommentsEdit={CommentsOnCommentsEdit}
              setCommentsOfCommentsEdit={setCommentsOfCommentsEdit}
              setCommentStatus={setCommentStatus}
              commentStatus={commentStatusUpdated}
              key={comment.id}
              comment={comment}
              userId={userId}
            />
          ))
        : null}
    </>
  );
}
