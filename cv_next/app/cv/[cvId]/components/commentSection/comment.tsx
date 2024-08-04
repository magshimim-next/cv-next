"use client";
import { deleteComment } from "@/app/actions/comments/deleteComment";
import { setResolved } from "@/app/actions/comments/setResolved";
import { upvoteComment } from "@/app/actions/comments/setLike";
import { addComment } from "@/app/actions/comments/addComment";
import { mutate } from "swr";
import { RxPlus } from "react-icons/rx";
import { GoCheckCircle } from "react-icons/go";
import { GoCheckCircleFill } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaComment } from "react-icons/fa";
import Tooltip from "../../../../../components/ui/tooltip";

import { AiTwotoneLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";

import { useState } from "react";
import Alert from "../../../../../components/ui/alert";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useSupabase } from "@/hooks/supabase";

export default function Comment({
  comment,
  userId,
  childDepth = 0,
  cv,
  commentsOfComment = [],
  setCommentsOfComments,
}: {
  comment: CommentModel;
  userId: string;
  childDepth?: number;
  cv: CvModel;
  commentsOfComment: any[];
  setCommentsOfComments: (
    update: (prev: Map<string, any[]>) => Map<string, any[]>
  ) => void;
}) {
  const supabase = useSupabase();
  const [commentOnCommentStatus, setCommentOnCommentStatus] =
    useState<boolean>(false);
  const [commentOnComment, setCommentOnComment] = useState<string>("");
  const router = useRouter();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const onAlertClick = async (type: boolean) => {
    if (type) await deleteCommentAction();
    setShowAlert(false);
  };

  const addNewCommentClickEvent = async () => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) router.push("/inactive");
    else {
      const commentToAdd: NewCommentModel = {
        data: commentOnComment,
        document_id: cv.id,
        parent_comment_Id: comment.id,
        user_id: userId,
      };

      await addComment(commentToAdd).finally(() => {
        setCommentsOfComments((prev: Map<string, any[]>) => {
          const newCommentsOfComments = new Map<string, any[]>(prev);
          newCommentsOfComments.set(
            comment.id,
            newCommentsOfComments
              .get(comment.id)
              ?.concat([commentToAdd]) as Array<any>
          );
          return newCommentsOfComments;
        });
        setCommentOnCommentStatus(false);
      });
      mutate(comment.document_id);
    }
  };

  const date = new Date(
    comment.last_update ? comment.last_update : new Date().getTime()
  );
  const childOrParentStyling = childDepth
    ? `p-3 ml-${6 / childDepth} lg:ml-${12 / childDepth} border-t border-gray-400 dark:border-gray-600`
    : "p-6 mb-3 border-b border-gray-200 rounded-lg";

  const deleteCommentAction = async () => {
    await deleteComment(comment.id).finally(() => {
      setCommentsOfComments((prev: Map<string, any[]>) => {
        const newCommentsOfComments = new Map<string, any[]>(prev);
        newCommentsOfComments.delete(comment.id);
        return newCommentsOfComments;
      });
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
  const votingSection = userVoted ? (
    <button>
      <AiFillLike
        onClick={() => setLikedCommentAction(false)}
        size="1.4rem"
        style={{
          transform: "translateY(2px)",
        }}
      />
    </button>
  ) : (
    <button>
      <AiTwotoneLike
        size="1.4rem"
        color="grey"
        style={{
          transform: "translateY(2px)",
        }}
        onClick={() => setLikedCommentAction(true)}
      />
    </button>
  );

  const startNewComment = !comment.parent_comment_Id ? (
    <button className="text-green-500">
      <FaComment
        size="1.2rem"
        style={{
          marginRight: "0.4rem",
          transform: "translateY(2px)",
        }}
        onClick={() => setCommentOnCommentStatus(!commentOnCommentStatus)}
      />
    </button>
  ) : null;

  const newCommentBlock = commentOnCommentStatus ? (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        onChange={(e) => setCommentOnComment(e.target.value)}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        required
      />
      <RxPlus
        style={{ fontSize: "5vh" }}
        onClick={async () => {
          await addNewCommentClickEvent();
        }}
      />
    </div>
  ) : null;

  const userResolved = comment.resolved;
  const commentBackground = userResolved
    ? "bg-green-200 dark:bg-green-800"
    : "bg-white dark:bg-theme-800";
  const resolvedSection = userResolved ? (
    <button
      className="text-green-500"
      onClick={() => setResolvedCommentAction(false)}
    >
      <GoCheckCircleFill
        style={{
          transform: "translateY(2px)",
        }}
        fontSize="1.4rem"
      />
    </button>
  ) : (
    <button
      className="text-green-500"
      onClick={() => setResolvedCommentAction(true)}
    >
      <GoCheckCircle
        style={{
          transform: "translateY(2px)",
        }}
        fontSize="1.4rem"
      />
    </button>
  );

  const commenterActions =
    commenter.id === userId ? (
      <>
        <span>
          <>
            <button className="text-red-500" onClick={() => setShowAlert(true)}>
              <FaRegTrashCan
                data-tooltip-target="Trash Icon"
                style={{
                  transform: "translateY(2px)",
                }}
                fontSize="1.4rem"
              />
            </button>
            <Tooltip id="Trash icon" message="delete"></Tooltip>
            <span> </span>
          </>
        </span>
        <span> </span>
        {resolvedSection}
      </>
    ) : null;

  const generalActions = (
    <>
      <span>{startNewComment}</span>
      <span>
        {votingSection} {comment.upvotes?.length || null}
      </span>
    </>
  );

  return (
    <article
      key={comment.id}
      className={`${commentBackground} text-base ${childOrParentStyling}`}
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ display: "flex", width: "100%" }}>
          <div>{generalActions}</div>
          <div style={{ marginLeft: "auto" }}>{commenterActions}</div>
        </span>
      </div>
      {showAlert ? (
        <Alert
          display={showAlert ? "flex" : "none"}
          message="You sure you want to delete this comment?"
          color="red"
          onClick={onAlertClick}
        ></Alert>
      ) : null}
      {newCommentBlock}
      {commentsOfComment?.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          userId={userId}
          cv={cv}
          childDepth={1}
          commentsOfComment={[]}
          setCommentsOfComments={setCommentsOfComments}
        />
      ))}
    </article>
  );
}
