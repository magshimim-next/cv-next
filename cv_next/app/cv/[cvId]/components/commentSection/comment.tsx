"use client";

import { useSWRConfig } from "swr";
import { RxPlus } from "react-icons/rx";
import { GoCheckCircle, GoCheckCircleFill } from "react-icons/go";

import { FaRegTrashCan } from "react-icons/fa6";
import { FaComment } from "react-icons/fa";
import { AiTwotoneLike, AiFillLike } from "react-icons/ai";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HiXMark } from "react-icons/hi2";
import { addComment } from "@/app/actions/comments/addComment";
import { upvoteComment } from "@/app/actions/comments/setLike";
import { setResolved } from "@/app/actions/comments/setResolved";
import { deleteComment } from "@/app/actions/comments/deleteComment";
import Alert from "@/components/ui/alert";
import Tooltip from "@/components/ui/tooltip";
import Definitions from "@/lib/definitions";

interface NewCommentBlockProps {
  commentOnCommentStatus: boolean;
  addNewCommentClickEvent: (commentData: string) => Promise<boolean>;
  setCommentOnCommentStatus: (status: boolean) => void;
  parentCommenter: string;
}

const NewCommentBlock = ({
  commentOnCommentStatus,
  addNewCommentClickEvent,
  setCommentOnCommentStatus,
  parentCommenter,
}: NewCommentBlockProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState(`@${parentCommenter} `);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (commentOnCommentStatus && inputRef.current) {
      inputRef.current.focus();
    } else if (
      !commentOnCommentStatus &&
      inputValue != `@${parentCommenter} `
    ) {
      setInputValue(`@${parentCommenter} `);
    }
  }, [commentOnCommentStatus, inputValue, parentCommenter]);

  const handleSubmit = async () => {
    if (inputValue.length > Definitions.MAX_COMMENT_SIZE) {
      return;
    }
    const addCommentResult = await addNewCommentClickEvent(inputValue);
    if (addCommentResult) {
      setCommentOnCommentStatus(!commentOnCommentStatus);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
      if (inputValue.length > Definitions.MAX_COMMENT_SIZE) {
        return;
      }
      e.preventDefault();
      await handleSubmit();
    } else if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      setInputValue((prev) => prev + "\n");
    }
  };

  return commentOnCommentStatus ? (
    <div>
      <div className="flex items-end justify-between gap-2">
        <div className="flex w-full flex-col">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              if (e.target.value.length < Definitions.MAX_COMMENT_SIZE + 1) {
                setInputValue(e.target.value);
                setShowError(false);
              } else {
                setShowError(true);
              }
            }}
            onFocus={(e) =>
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
              )
            }
            onKeyDown={handleKeyDown}
            rows={2}
            className="mb-1 mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
          <div className="px-1 text-right text-sm">
            <span
              className={`${
                inputValue.length >= Definitions.MAX_COMMENT_SIZE
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {inputValue.length} / {Definitions.MAX_COMMENT_SIZE} characters
            </span>
          </div>
        </div>

        <Tooltip id="Reply Icon" message="Reply">
          <RxPlus
            style={{ fontSize: "5vh", cursor: "pointer" }}
            onClick={async () => {
              await handleSubmit();
            }}
          />
        </Tooltip>
      </div>

      <Alert
        display={showError ? "flex" : "none"}
        message={`Your comment can't be over ${Definitions.MAX_COMMENT_SIZE} characters long!`}
        color="red"
      ></Alert>
    </div>
  ) : null;
};

interface VotingSectionProps {
  userVoted: boolean;
  setLikedCommentAction: (liked: boolean) => Promise<void>;
}

const VotingSection = ({
  userVoted,
  setLikedCommentAction,
}: VotingSectionProps) => {
  return userVoted ? (
    <Tooltip id="Dislike Icon" message="Dislike">
      <button>
        <AiFillLike
          onClick={() => setLikedCommentAction(false)}
          size="1.4rem"
          style={{
            transform: "translateY(2px)",
          }}
        />
      </button>
    </Tooltip>
  ) : (
    <Tooltip id="Like Icon" message="Like">
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
    </Tooltip>
  );
};

interface ResolvedSectionProps {
  userResolved: boolean;
  setResolvedCommentAction: (resolved: boolean) => Promise<void>;
}

const ResolvedSection = ({
  userResolved,
  setResolvedCommentAction,
}: ResolvedSectionProps) => {
  return userResolved ? (
    <Tooltip id="Resolve icon" message="Unresolve">
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
    </Tooltip>
  ) : (
    <Tooltip id="Resolve icon" message="Resolve">
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
    </Tooltip>
  );
};

interface CommenterModel {
  id: string;
  username?: string;
  display_name?: string;
}

interface CommenterActionsProps {
  commenter: CommenterModel;
  userId: string;
  setShowAlert: (value: boolean) => void;
  resolvedSection: JSX.Element;
  userIsAdmin: boolean;
  userIsAuthor: boolean;
}

const CommenterActions = ({
  commenter,
  userId,
  setShowAlert,
  resolvedSection,
  userIsAdmin,
  userIsAuthor,
}: CommenterActionsProps) => {
  return commenter.id === userId || userIsAdmin ? (
    <>
      <span>
        <>
          <Tooltip id="Trash Icon" message="Delete">
            <button className="text-red-500" onClick={() => setShowAlert(true)}>
              <FaRegTrashCan
                data-tooltip-target="Trash Icon"
                style={{
                  transform: "translateY(2px)",
                }}
                fontSize="1.4rem"
              />
            </button>
          </Tooltip>
          <span> </span>
        </>
      </span>
      <span> </span>
      {resolvedSection}
    </>
  ) : userIsAuthor ? (
    <span>{resolvedSection}</span>
  ) : null;
};

interface GeneralActionsProps {
  startNewComment: JSX.Element;
  votingSection: JSX.Element;
  comment: CommentModel;
}

const GeneralActions = ({
  startNewComment,
  votingSection,
  comment,
}: GeneralActionsProps) => {
  return (
    <>
      <span>{startNewComment}</span>
      <span>
        {votingSection} {comment.upvotes?.length || null}
      </span>
    </>
  );
};

interface AlertComponentProps {
  showAlert: boolean;
  onAlertClick: (type: boolean) => Promise<void>;
}

const AlertComponent = ({ showAlert, onAlertClick }: AlertComponentProps) => {
  return showAlert ? (
    <Alert
      display={showAlert ? "flex" : "none"}
      message="You sure you want to delete this comment?"
      color="red"
      onClick={onAlertClick}
    ></Alert>
  ) : null;
};

interface StartNewCommentProps {
  commentOnCommentStatus: boolean;
  setCommentOnCommentStatus: (status: boolean) => void;
}

const StartNewComment = ({
  commentOnCommentStatus,
  setCommentOnCommentStatus,
}: StartNewCommentProps) => {
  return !commentOnCommentStatus ? (
    <Tooltip id="Comment Icon" message="Comment">
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
    </Tooltip>
  ) : (
    <Tooltip id="Cancel Icon" message="Cancel">
      <button className="text-red-500">
        <HiXMark
          size="1.2rem"
          style={{
            marginRight: "0.4rem",
            transform: "translateY(2px)",
          }}
          onClick={() => setCommentOnCommentStatus(!commentOnCommentStatus)}
        />
      </button>
    </Tooltip>
  );
};

interface CommentProps {
  comment: CommentModel;
  userId: string;
  childDepth?: number;
  commentsOfComment: CommentModel[];
  setCommentsOfComments: (
    update: (prev: Map<string, any[]>) => Map<string, any[]>
  ) => void;
  userIsAdmin: boolean;
  userIsAuthor: boolean;
}

export default function Comment({
  comment,
  userId,
  childDepth = 0,
  commentsOfComment = [],
  setCommentsOfComments,
  userIsAdmin,
  userIsAuthor,
}: CommentProps) {
  const [commentOnCommentStatus, setCommentOnCommentStatus] =
    useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const { mutate } = useSWRConfig();

  const onAlertClick = async (type: boolean) => {
    if (type) await deleteCommentAction();
    setShowAlert(false);
  };

  const addNewCommentClickEvent = useCallback(
    async (commentData: string): Promise<boolean> => {
      const commentToAdd: NewCommentModel = {
        data: commentData,
        document_id: comment.document_id,
        parent_comment_Id: comment.id,
        user_id: userId,
      };

      if (comment.parent_comment_Id) {
        commentToAdd.parent_comment_Id = comment.parent_comment_Id;
      }

      mutate(
        comment.document_id,
        (currentSubComments: CommenterModel[] = []) => [
          ...currentSubComments,
          {
            ...commentToAdd,
            id: Date.now().toString(),
            deleted: false,
            last_update: new Date().toISOString(),
            resolved: false,
            upvoted: [],
          },
        ],
        {
          optimisticData: true,
          rollbackOnError: true,
          revalidate: false,
        }
      );

      const addedComment = await addComment(commentToAdd);
      if (addedComment.ok) {
        mutate(
          comment.document_id,
          async (currentSubComments: CommenterModel[] = []) => {
            return [
              ...currentSubComments,
              {
                ...addedComment,
                id: addedComment.val.id,
                last_update: new Date().toISOString(),
              },
            ];
          },
          {
            revalidate: true,
          }
        );
        return true;
      }
      return false;
    },
    [comment, userId, mutate]
  );

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

  const commenter = JSON.parse(JSON.stringify(comment.user_id || "Loading..."));

  const userVoted = comment.upvotes?.includes(userId) || false;
  const userResolved = comment.resolved;

  const commentBackground = userResolved
    ? "bg-green-200 dark:bg-green-800"
    : "bg-white dark:bg-theme-800";

  return (
    <article
      key={comment.id}
      className={`${commentBackground} relative text-base ${childOrParentStyling}`}
    >
      <footer className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            <Link
              className="text-lg font-medium hover:underline"
              href={`/profile/${commenter.username}`}
            >
              {commenter.display_name}
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
      <p className="whitespace-pre-wrap text-gray-500 dark:text-gray-400">
        {comment.data}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <span style={{ display: "flex", width: "100%" }}>
          <div>
            <GeneralActions
              startNewComment={
                <StartNewComment
                  commentOnCommentStatus={commentOnCommentStatus}
                  setCommentOnCommentStatus={setCommentOnCommentStatus}
                />
              }
              votingSection={
                <VotingSection
                  userVoted={userVoted}
                  setLikedCommentAction={setLikedCommentAction}
                />
              }
              comment={comment}
            />
          </div>
          <div style={{ marginLeft: "auto" }}>
            <CommenterActions
              commenter={commenter}
              userId={userId}
              setShowAlert={setShowAlert}
              resolvedSection={
                <ResolvedSection
                  userResolved={userResolved}
                  setResolvedCommentAction={setResolvedCommentAction}
                />
              }
              userIsAdmin={userIsAdmin}
              userIsAuthor={userIsAuthor}
            />
          </div>
        </span>
      </div>
      <AlertComponent showAlert={showAlert} onAlertClick={onAlertClick} />
      <NewCommentBlock
        commentOnCommentStatus={commentOnCommentStatus}
        addNewCommentClickEvent={addNewCommentClickEvent}
        setCommentOnCommentStatus={setCommentOnCommentStatus}
        parentCommenter={commenter.display_name}
      />
      {commentsOfComment?.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          userId={userId}
          childDepth={1}
          commentsOfComment={[]}
          setCommentsOfComments={setCommentsOfComments}
          userIsAdmin={userIsAdmin}
          userIsAuthor={userIsAuthor}
        />
      ))}
    </article>
  );
}
