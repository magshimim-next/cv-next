"use client";

import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchCvComments } from "@/app/actions/comments/fetchComments";
import Definitions from "@/lib/definitions";
import { useUser } from "@/hooks/useUser";
import Comment from "./comment";

/**
 * This component renders the comments section of a CV.
 * @param {object} param0 - The component props.
 * @param {CvModel} param0.cv - The viewed CV object.
 * @param {boolean} param0.userIsAdmin - Whether the current user is an admin.
 * @param {boolean} param0.userIsAuthor - Whether the current user is the author of the CV.
 * @returns {JSX.Element} The comments section component.
 */
export default function CommentsSection({
  cv,
  userIsAdmin,
  userIsAuthor,
}: {
  cv: CvModel;
  userIsAdmin: boolean;
  userIsAuthor: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: comments } = useSWR(cv.unique_cv_id, fetchCvComments);
  const { userData, loading } = useUser();
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
      if (!comment.parent_comment_id)
        copyOfCommentOfComments.set(comment.unique_cv_comment_id, []);
    });

    comments?.forEach((comment) => {
      if (comment.parent_comment_id)
        copyOfCommentOfComments.set(
          comment.parent_comment_id,
          copyOfCommentOfComments
            .get(comment.parent_comment_id)
            ?.concat([comment]) as Array<any>
        );
    });

    return copyOfCommentOfComments;
  }, [comments]);

  useEffect(() => {
    setCommentsOfComments(memoizedCommentsOfComments);
  }, [memoizedCommentsOfComments, setCommentsOfComments]);

  useEffect(() => {
    if (!loading && !userData) {
      router.push(`/${Definitions.LOGIN_REDIRECT}?next=${pathname}`);
    } else {
      setUserId(userData?.unique_profile_id || "");
    }
  }, [loading, userData, pathname, router]);

  return (
    <div className="h-[72vh] overflow-y-auto overflow-x-hidden">
      {comments
        ? comments.map((comment: CommentModel) =>
            !comment.parent_comment_id ? (
              <Comment
                key={comment.unique_cv_comment_id}
                comment={comment}
                userId={userId}
                commentsOfComment={
                  commentsOfComments.get(
                    comment.unique_cv_comment_id
                  ) as Array<any>
                }
                setCommentsOfComments={setCommentsOfComments}
                userIsAdmin={userIsAdmin}
                userIsAuthor={userIsAuthor}
              />
            ) : null
          )
        : null}
    </div>
  );
}
