"use client";
import { getUser } from "@/app/actions/users/getUser";
import useSWR from "swr";
import Link from "next/link";

export default function Comment({
  comment,
  childDepth = 0,
}: {
  comment: CommentModel;
  childDepth?: number;
}) {
  const date = new Date(comment.last_update);
  const childOrParentStyling = childDepth
    ? `p-3 ml-${6 / childDepth} lg:ml-${12 / childDepth} border-t border-gray-400 dark:border-gray-600`
    : "p-6 mb-3 border-b border-gray-200 rounded-lg";

  const { data: user } = useSWR(comment.user_id, getUser);
  if (user && user.ok) {
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
                href={`/profile/${user.val.id}`}
              >
                {user.val.username || user.val.full_name}
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
        {comment.upvotes?.length || 0} Likes
      </article>
    );
  } else {
    // TODO: Show error
    return null;
  }
}
