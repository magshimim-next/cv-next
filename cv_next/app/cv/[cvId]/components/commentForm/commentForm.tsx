"use client";

import useSWRMutation from 'swr/mutation'
import { fetchComments, postComment } from "@/app/actions/comments";
import { useRef } from "react";
import { ClientCommentModel } from '@/types/models/comment';
import { RxPaperPlane } from 'react-icons/rx';

type CommentFormProps = {
    children?: React.ReactNode,
    cvId?: string,
    userId: string //TODO: get as current user from either cache or Context
    show: boolean
}

const commentsFetcherAlias = (cvId: string, {arg} : {arg?: boolean}) => fetchComments(cvId, arg);

export const CommentForm:React.FC<CommentFormProps> = ({ cvId, userId, show }) => {
    const { trigger, isMutating } = useSWRMutation(cvId, commentsFetcherAlias,{
        populateCache: true
    });
    const formRef = useRef<HTMLFormElement | null>(null);

    const formAction = async (formData: FormData) => {
        
        const commentData = {
            cvId: cvId, 
            userId: userId, 
            message: formData.get("comment") as string,
            parentCommentId: undefined
        };

        return await postComment(commentData)
        .finally(() => {
            formRef.current?.reset();
            trigger(undefined, {
                optimisticData(currentData) {
                    const newComment:ClientCommentModel = {
                        data: formData.get("comment") as string,
                        userID: userId,
                        lastUpdate: Date.now(),
                        documentID: cvId ?? null,
                        resolved: false,
                        deleted: false,
                        parentCommentID: null,
                        upvotes: null,
                        downvotes: null,
                        id: "0"
                    };
                    return currentData ? [
                        newComment,
                        ...currentData
                    ] : [ newComment ];
                },
            })
        });
    }

    return (
        <form className="mb-6" hidden={!show} ref={formRef} action={formAction}>
            <div className="py-2 pl-4 pr-2 bg-white rounded-lg rounded-t-lg border border-gray-200
                            dark:bg-gray-800 dark:border-gray-700 grid grid-cols-[90%_10%]">
                <label htmlFor="comment" className="sr-only">Your comment</label>
                <textarea id="comment" name="comment" rows={2}
                    className="flex-col row-span-2 overflow-hidden resize-y min-h-[2.5rem] leading-5 px-0 w-full text-sm
                                text-gray-900 border-0 focus:ring-0 focus:outline-none mt-2
                                dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                    placeholder="Write a comment..."/>
                <button type="submit" disabled={isMutating}
                    className="flex-col row-start-2 col-start-2 items-center py-2.5 px-4 dark:bg-gray-800
                                dark:text-white bg-slate-50 dark:hover:bg-gray-500/50 rounded-lg focus:ring-4
                                focus:ring-gray-200 dark:focus:ring-gray-900 hover:bg-gray-300">
                    <RxPaperPlane/>
                </button>
            </div>
        </form>
    )
}