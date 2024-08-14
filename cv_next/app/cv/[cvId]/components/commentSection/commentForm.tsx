"use client";
import { addComment } from "@/app/actions/comments/addComment";
import { useSupabase } from "@/hooks/supabase";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { RxPaperPlane } from "react-icons/rx";
import { mutate } from "swr";

const COMMENT_FIELD_NAME = "comment";

export default function CommentForm({ cv }: { cv: CvModel }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const supabase = useSupabase();

  const formAction = async (formData: FormData) => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId)
      router.push("/inactive"); //TODO: redirect to login with next param
    else {
      const comment: NewCommentModel = {
        data: formData.get(COMMENT_FIELD_NAME) as string,
        document_id: cv.id,
        parent_comment_Id: null,
        user_id: userId,
      };

      await addComment(comment).finally(() => {
        formRef.current?.reset();
        mutate(cv.id);
      });
    }
  };

  return (
    <form className="mb-6" ref={formRef} action={formAction}>
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
          rows={2}
          className="row-span-2 mt-2 min-h-[2.5rem] w-full resize-y flex-col overflow-hidden border-0 px-0
                                text-sm leading-5 text-gray-900 focus:outline-none focus:ring-0
                                dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          placeholder="Write a comment..."
        />
        <button
          type="submit"
          className="col-start-2 row-start-2 flex-col items-center rounded-lg bg-slate-50 px-4
                                py-2.5 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800
                                dark:text-white dark:hover:bg-gray-500/50 dark:focus:ring-gray-900"
        >
          <RxPaperPlane />
        </button>
      </div>
    </form>
  );
}
