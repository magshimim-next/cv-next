"use client";
import { deleteComment } from "@/app/actions/comments/deleteComment";
import { setResolved } from "@/app/actions/comments/setResolved";
import { upvoteComment } from "@/app/actions/comments/setLike";
import { mutate } from "swr";
import Link from "next/link";

export default function Comment({
  comment,
  userId,
  childDepth = 0,
}: {
  comment: CommentModel;
  userId: string;
  childDepth?: number;
}) {
  const date = new Date(comment.last_update);
  const childOrParentStyling = childDepth
    ? `p-3 ml-${6 / childDepth} lg:ml-${12 / childDepth} border-t border-gray-400 dark:border-gray-600`
    : "p-6 mb-3 border-b border-gray-200 rounded-lg";

  const deleteCommentAction = async () => {
    await deleteComment(comment.id).finally(() => {
      mutate(comment.document_id);
    });
  };

  const setResolvedCommentAction = async (resolved: boolean) => {
    await setResolved(comment.id, resolved).finally(() => {
      mutate(comment.document_id);
    });
  };

  const setLikedCommentAction = async (liked: boolean) => {
    await upvoteComment(comment.id, liked, userId).finally(() => {
      mutate(comment.document_id);
    });
  };

  const commenter = JSON.parse(JSON.stringify(comment.user_id));

  const userVoted = comment.upvotes?.includes(userId);
  const votingSection = (
    <button
      className="text-gray-500"
      onClick={() => setLikedCommentAction(!userVoted)}
    >
      {userVoted ? "Unlike" : "Like"} {comment.upvotes?.length || 0}
    </button>
  );

  const userResolved = comment.resolved;
  const resolvedSection = (
    <button
      className={`text-${userResolved ? "green" : "gray"}-500`}
      onClick={() => setResolvedCommentAction(!userResolved)}
    >
      {userResolved ? "UnResolve" : "Resolve"}
    </button>
  );

  const commenterActions =
    commenter.id === userId ? (
      <>
        <button className="text-red-500" onClick={deleteCommentAction}>
          Delete
        </button>
        <span> </span>
        {resolvedSection}
      </>
    ) : null;

  return (
    <article
      key={comment.id}
      className={`bg-white text-base dark:bg-theme-800 ${childOrParentStyling}`}
    >
      <footer className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            <Link
              className="text-lg font-medium hover:underline"
              href={`/profile/${commenter.id}`}
            >
              {commenter.username || commenter.full_name}
            </Link>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time
              dateTime={date.toLocaleString()}
              title={date.toLocaleString()}
            >
              {date.toLocaleString()}
            </time>
          </p>
        </div>
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{comment.data}</p>
      {commenterActions}
      <span> </span>
      {votingSection}
    </article>
  );
}
