// "use client";

import useSWR from 'swr';
import { addLikeToComment, fetchChildComments, postComment, removeLikeFromComment } from "@/app/actions/comments";
import { fetchUser } from "@/app/actions/users";
import { isBrowser } from "@/lib/utils";
import { ClientCommentModel } from "@/types/models/comment";
import { use } from "react";
import { CommentActions } from "./commentActions";


const ChildComments = async ({ childDepth, parentCommentId, userId }:
    { childDepth: number, parentCommentId: string,
        userId: string,
        }) => {

    // const { data: childComments } = useSWR(parentCommentId, fetchChildComments);
    const childComments = await fetchChildComments(parentCommentId);

    if (!childComments) {
        return <></>;
    }

    return (
        <>
        {childComments.map((comment) =>
        <>
            {/* @ts-expect-error Server Component */}
            <Comment key={comment.id} comment={comment} userId={userId}
                childDepth={childDepth + 1}/>
        </>)}
        </>);
}


export const Comment = async ({ comment, userId, childDepth = 0 }:
    { comment: ClientCommentModel, userId: string, childDepth?: number }) => {
    // const { data: user } = useSWR(comment.userID, fetchUser);
    const user = await fetchUser(comment.userID);
    console.log(user?.id);
    console.log(`I was rendered in the ${isBrowser() ? `browser`: `server`}`);
    
    if (!user) {
        return <>Failed to load user</>
    }

    const date = new Date(comment.lastUpdate);
    const childOrParentStyling = childDepth ?
        `p-3 ml-${6/childDepth} lg:ml-${12/childDepth} border-t border-gray-400 dark:border-gray-600` :
        "p-6 mb-3 border-b border-gray-200 rounded-lg";

    const submitNewCommentWithParent = async (formData: FormData, parentCommentId: string = comment.id) => {
        "use server";

        const commentData = {
            cvId: undefined, 
            userId: userId, 
            message: formData.get("comment") as string,
            parentCommentId: parentCommentId
        };

        return await postComment(commentData);
    }

    const likeAction = async () => {
        "use server";

        let hasUserAlreadyLiked = false;
        if (comment.upvotes !== null) {
            for (const upvoteUser of comment.upvotes as string[]) {
                if (upvoteUser === userId) {
                    hasUserAlreadyLiked = true;
                    break;
                }
            }
        }

        if (hasUserAlreadyLiked) {
            return removeLikeFromComment(comment, userId)
            .finally(() => {
                // revalidatePath("/cv/[cvId]");
            });
        } else {
            return addLikeToComment(comment, userId)
            .finally(() => {
                // revalidatePath("/cv/[cvId]");
            });
        }
    }

    return (
        <article key={comment.id} className={`text-base bg-white dark:bg-gray-900 ${childOrParentStyling}`}>
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400"><time dateTime={date.toLocaleString()}
                            title={date.toLocaleString()}>{date.toLocaleString()}</time></p>
                </div>
            </footer>
            <p className="text-gray-500 dark:text-gray-400">{comment.data}</p>
            <CommentActions submitNewComment={submitNewCommentWithParent}
                    likeAction={likeAction} upvotes={comment.upvotes}
                     />
            {/* @ts-expect-error Server Component */}
            <ChildComments childDepth={childDepth + 1} parentCommentId={comment.id}
                userId={userId}  />
        </article>
    )
}