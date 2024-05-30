"use client";

import useSWR from "swr";
import { fetchCvComments } from "@/app/actions/comments/fetchComments";
import Comment from "./comment";
import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/supabase";

export default function CommentsSection({ cv }: { cv: CvModel }) {
  const { data: comments } = useSWR(cv.id, fetchCvComments);

  const supabase = useSupabase();
  const [userId, setUserId] = useState<string>("");

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
            <Comment key={comment.id} comment={comment} userId={userId} />
          ))
        : null}
    </>
  );
}
