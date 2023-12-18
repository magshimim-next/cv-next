// "use client";

import { fetchComments, postComment } from "@/app/actions/comments";
import { isBrowser } from "@/lib/utils";
import { ClientCvModel } from "@/types/models/cv";
import { revalidatePath } from "next/cache";
import { Suspense, use } from "react";
import useSWR from "swr";
import { CommentForm, CommentFormRSC } from "../commentForm";
import { Comment } from "./comment";
import { Comments } from "./comments";
import { CommentSkeleton } from "./commentSkeleton";

 const NO_COMMENTS_MESSAGE = "No comments yet. Start the conversation!";

export const CommentsSection = ({ cv, children }: { cv: ClientCvModel, children?: React.ReactNode }) => {

    // const { data: comments } = useSWR(cv.id, fetchComments);
    // if (!comments) {
    //     return <></>
    // };
    const userId = "dB3txgQQWJS4MggsZHP0"; ////TODO: get as current user from either cache or Context

    return (
    <div className="mx-auto px-4 h-full flex flex-col flex-start rounded-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion</h2>
        </div>
        <CommentForm show={true} cvId={cv.id} userId={userId}/>
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 
        dark:scrollbar-thumb-gray-800 scrollbar-thumb-rounded-full flex-1">
            {/* {comments.length ? */}
                <>
                {/* @ts-expect-error Server Component */}
                <Comments cvId={cv.id}/>
                </>
                {/* : <h3 className="text-gray-800 dark:text-gray-200">{NO_COMMENTS_MESSAGE}</h3>} */}
        </div>
    </div>
    )
}