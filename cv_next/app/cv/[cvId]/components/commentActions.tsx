"use client";

import { useState } from "react"
import { CommentForm } from "./commentForm"
import { CommentFormRSC } from "./CommentFormRSC"
import { AiFillLike } from "react-icons/ai";
import { ClientCommentModel } from "@/types/models/comment";


export const CommentActions = ({ submitNewComment, likeAction, revalidatePath, parentCommentId, upvotes = null }: 
    { submitNewComment: (formData: FormData, parentCommentId?: string) => Promise<string | null>,
        likeAction: (userId: string) => Promise<ClientCommentModel | null>,
        revalidatePath: (path: string) => Promise<void>, parentCommentId?: string,
        upvotes?: string[] | null }) => {

    const [renderReplyFrom, setRenderReplyForm] = useState(false);
    const userId = "dB3txgQQWJS4MggsZHP0" //TODO: CHANGEME to current logged user
    const userAlreadyLiked = upvotes?.some(userUpvote => userUpvote === userId) ?? false;
    const likeStyle = userAlreadyLiked ? "fill-white" : "hover:fill-white";

    return (
        <>
            <div className="flex justify-between items-center mt-4 space-x-4">
                <button type="button" onClick={() => setRenderReplyForm(!renderReplyFrom)}
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                    <svg className="mr-1.5 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                    </svg>
                    Reply
                </button>
                <button type="button" onClick={() => likeAction(userId)}
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-white font-medium">
                        <span className="mt-0.5">{upvotes?.length ?? 0}</span>
                        <AiFillLike className={`ml-1 w-4 h-4 ${likeStyle}`} />
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