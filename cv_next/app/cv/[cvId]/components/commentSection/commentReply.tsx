"use client";

import { useState } from "react"
import { CommentForm } from "../commentForm/commentForm"
import { CommentFormRSC } from "./CommentFormRSC"


export const CommentReply = ({ submitNewComment, revalidatePath, parentCommentId }: 
    { submitNewComment: (formData: FormData, parentCommentId?: string) => Promise<string | null>,
        revalidatePath: (path: string) => Promise<void>, parentCommentId?: string }) => {

    const [renderReplyFrom, setRenderReplyForm] = useState(false);


    return (
        <>
        <div className="flex items-center mt-4 space-x-4">
                <button type="button" onClick={() => setRenderReplyForm(!renderReplyFrom)}
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                    <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                    </svg>
                    Reply
                </button>
            </div>
            <CommentForm show={renderReplyFrom}
                formAction={(formData: FormData) => {setRenderReplyForm(false); return submitNewComment(formData, parentCommentId);}}
                revalidatePath={revalidatePath}>
                <CommentFormRSC />
            </CommentForm>
        </>
    )
}