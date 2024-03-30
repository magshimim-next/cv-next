"use client"
import { deleteComment } from "@/app/actions/comments/deleteComment"
import { setResolved } from "@/app/actions/comments/setResolved"
import { getUser } from "@/app/actions/users/getUser"
import useSWR, { mutate } from "swr"

export default function Comment({
  comment,
  userId,
  childDepth = 0,
}: {
  comment: CommentModel
  userId: string
  childDepth?: number
}) {
  const date = new Date(comment.last_update)
  const childOrParentStyling = childDepth
    ? `p-3 ml-${6 / childDepth} lg:ml-${12 / childDepth} border-t border-gray-400 dark:border-gray-600`
    : "p-6 mb-3 border-b border-gray-200 rounded-lg"

  const deleteCommentAction = async () => {
    await deleteComment(comment.id).finally(() => {
      mutate(comment.document_id)
    })
  }

  const resolveCommentAction = async () => {
    await setResolved(comment.id, true).finally(() => {
      mutate(comment.document_id)
    })
  }

  const unResolveCommentAction = async () => {
    await setResolved(comment.id, false).finally(() => {
      mutate(comment.document_id)
    })
  }

  const { data: user } = useSWR(comment.user_id, getUser)
  if (user && user.ok) {
    const userName =
      user.val.username && user.val.username.length > 0
        ? user.val.username
        : user.val.full_name

    return (
      <article
        key={comment.id}
        className={`bg-white text-base dark:bg-theme-800 ${childOrParentStyling}`}
      >
        <footer className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
              {userName}
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
        {comment.user_id === userId ? (
          <>
            <button className="text-red-500" onClick={deleteCommentAction}>
              Delete
            </button>
            <span> </span>
            {comment.resolved === true ? (
              // TODO: change appearence of comment based on if its resolved or not
              <button
                className="text-green-500"
                onClick={unResolveCommentAction}
              >
                UnResolve
              </button>
            ) : (
              <button className="text-gray-500" onClick={resolveCommentAction}>
                Resolve
              </button>
            )}
          </>
        ) : null}
      </article>
    )
  } else {
    // TODO: Show error
    return null
  }
}
