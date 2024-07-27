"use client";

import useSWR from "swr";
import { fetchCvComments } from "@/app/actions/comments/fetchComments";
import Comment from "./comment";
import { useEffect, useState } from "react";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { useRouter } from "next/navigation";

export default function CommentsSection({ cv }: { cv: CvModel }) {
  const router = useRouter();
  const { data: comments } = useSWR(cv.id, fetchCvComments);

  const supabase = createClientComponent();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    async function getUser() {
      const userId = await supabase.auth.getUser();
      if (userId.error) {
        router.push("/inactive");
      } else setUserId(userId.data.user.id);
    }
    getUser();
  }, [router, supabase.auth]);

  return (
    <>
      {comments
        ? comments.map((comment: CommentModel) => (
            <Comment key={comment.id} comment={comment} userId={userId} />
          ))
        : null}
    </>
  );
}
