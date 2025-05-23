"use client";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { RxPaperPlane } from "react-icons/rx";
import { mutate } from "swr";

import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { addComment } from "@/app/actions/comments/addComment";
import Definitions from "@/lib/definitions";
import Tooltip from "@/components/ui/tooltip";
import Alert from "@/components/ui/alert";

const COMMENT_FIELD_NAME = "comment";

export default function CommentForm({ cv }: { cv: CvModel }) {
  const pathname = usePathname();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const supabase = createClientComponent();
  const [formData, setFormData] = useState(new FormData());
  const [text, setText] = useState("");
  const [showError, setShowError] = useState(false);

  const formAction = async () => {
    setShowError(false);

    // Reset the form after submission and check if the comment is empty
    formRef.current?.reset();
    if ((formData.get(COMMENT_FIELD_NAME) as String).length <= 0) return;
    const userId = await supabase.auth.getUser();
    if (userId.error) {
      router.push(`/${Definitions.LOGIN_REDIRECT}?next=${pathname}`);
    } else {
      const comment: NewCommentModel = {
        data: formData.get(COMMENT_FIELD_NAME) as string,
        document_id: cv.id,
        parent_comment_Id: null,
        user_id: userId.data.user.id,
      };

      mutate(
        cv.id,
        (currentComments: CommentModel[] = []) => [
          ...currentComments,
          {
            ...comment,
            id: Date.now().toString(),
            deleted: false,
            last_update: new Date().toISOString(),
            resolved: false,
            upvotes: [],
          },
        ],
        false
      );

      try {
        const result = await addComment(comment);
        if (result.ok) {
          setText("");
        }
        mutate(cv.id);
        return result.ok;
      } catch (error) {
        // Rollback optimistic update
        mutate(
          cv.id,
          (currentComments: CommentModel[] = []) =>
            currentComments.filter((comment) => comment.id !== comment.id),
          false
        );
        return false;
      }
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      setText((prev) => prev + "\n");
    } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      if (text.length > Definitions.MAX_COMMENT_SIZE) {
        return;
      }
      e.preventDefault();
      const res = await formAction();
      if (res) setText("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length < Definitions.MAX_COMMENT_SIZE + 1) {
      const value = e.target.value;
      setText(value);

      const updatedFormData = new FormData();
      updatedFormData.set(COMMENT_FIELD_NAME, value);
      setFormData(updatedFormData);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  return (
    <form className="mb-2" ref={formRef} action={formAction}>
      <div
        className="grid grid-cols-[1fr_auto] items-end gap-x-2 rounded-lg border border-gray-200
             bg-white p-2 dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex w-full flex-col">
          <label htmlFor={COMMENT_FIELD_NAME} className="sr-only">
            Your comment
          </label>
          <textarea
            id={COMMENT_FIELD_NAME}
            name={COMMENT_FIELD_NAME}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={text}
            rows={5}
            className="mt-2 w-full resize-none border-0 text-sm leading-5 text-gray-900 
                 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white 
                 dark:placeholder-gray-400"
            placeholder="Write a comment..."
          />
          <div className="mt-1 text-right text-sm text-gray-500">
            <span
              className={`${
                text.length >= Definitions.MAX_COMMENT_SIZE
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {text.length} / {Definitions.MAX_COMMENT_SIZE} characters
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={text.length > Definitions.MAX_COMMENT_SIZE}
          className="flex h-fit items-center justify-center rounded-lg bg-slate-50 px-4 py-2.5
               hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800
               dark:text-white dark:hover:bg-gray-500/50 dark:focus:ring-gray-900"
        >
          <Tooltip id="Comment Icon" message="send">
            <RxPaperPlane />
          </Tooltip>
        </button>
      </div>
      <Alert
        display={showError ? "flex" : "none"}
        message={`Your comment can't be over ${Definitions.MAX_COMMENT_SIZE} characters long!`}
        color="red"
      ></Alert>
    </form>
  );
}
