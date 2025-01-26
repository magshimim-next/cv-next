"use client";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { RxPaperPlane } from "react-icons/rx";
import { mutate } from "swr";

import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { addComment } from "@/app/actions/comments/addComment";
import Definitions from "@/lib/definitions";
import Tooltip from "@/components/ui/tooltip";

const COMMENT_FIELD_NAME = "comment";

export default function CommentForm({ cv }: { cv: CvModel }) {
  const pathname = usePathname();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const supabase = createClientComponent();
  const [formData, setFormData] = useState(new FormData());
  const [text, setText] = useState("");

  const formAction = async () => {
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
        await addComment(comment);
        mutate(cv.id);
      } catch (error) {
        // Rollback optimistic update
        mutate(
          cv.id,
          (currentComments: CommentModel[] = []) =>
            currentComments.filter((comment) => comment.id !== comment.id),
          false
        );
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      setText((prev) => prev + "\n");
    } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      formAction();
      setText("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    const updatedFormData = new FormData();
    updatedFormData.set(COMMENT_FIELD_NAME, value);
    setFormData(updatedFormData);
  };

  return (
    <form className="mb-2" ref={formRef} action={formAction}>
      <div
        className="grid grid-cols-[90%_10%] rounded-lg rounded-t-lg border border-gray-200 bg-white py-2
                            pl-4 pr-2 dark:border-gray-700 dark:bg-gray-800"
      >
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
          className={`
    row-span-2 mt-2 min-h-[2.5rem] w-full resize-none flex-col overflow-auto
    border-0 px-0 text-sm leading-5 text-gray-900
    focus:outline-none focus:ring-0 dark:bg-gray-800
    dark:text-white dark:placeholder-gray-400
  `}
          placeholder="Write a comment..."
        />

        <Tooltip id="Comment Icon" message="Comment">
          <button
            type="submit"
            className="col-start-2 row-start-2 flex-col items-center rounded-lg bg-slate-50 px-4
                                  py-2.5 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800
                                  dark:text-white dark:hover:bg-gray-500/50 dark:focus:ring-gray-900"
          >
            <RxPaperPlane />
          </button>
        </Tooltip>
      </div>
    </form>
  );
}
