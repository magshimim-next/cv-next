"use client";

import useSWR from "swr";
import { fetchComments } from "@/app/actions/comments/fetchComments";
import Comment from "./comment";
import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/supabase";
import { useRouter } from "next/navigation";

export default function CommentsSection({ cv }: { cv: CvModel }) {
  const router = useRouter();
  const { data: comments } = useSWR(cv.id, fetchComments);

  const supabase = useSupabase();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    async function getUser() {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) router.push("/inactive");
      else setUserId(userId);
    }
    getUser();
  }, [router, supabase.auth]);

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
