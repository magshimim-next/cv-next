import { addLikeToComment, fetchChildComments, removeLikeFromComment } from "@/app/actions/comments";
import { fetchUser } from "@/app/actions/users";
import { ClientCommentModel } from "@/types/models/comment";
import { use } from "react";
import { CommentActions } from "./commentActions";


const ChildComments = async ({ childDepth, parentCommentId, submitNewComment, revalidatePath }:
    { childDepth: number, parentCommentId: string,
        submitNewComment: (formData: FormData, parentCommentId?: string) => Promise<string | null>,
        revalidatePath: (path: string) => Promise<void> }) => {

    const childComments = await fetchChildComments(parentCommentId);

    if (childComments === null) {
        return <></>;
    }

    return (
        childComments.map((comment) => <Comment key={comment.id} comment={comment}
        submitNewComment={submitNewComment}
        revalidatePath={revalidatePath} childDepth={childDepth + 1} />)
    )
}

export const Comment = ({ comment, submitNewComment, revalidatePath, childDepth = 0 }:
    { comment: ClientCommentModel, submitNewComment: (formData: FormData, parentCommentId?: string) => Promise<string | null>,
        revalidatePath: (path: string) => Promise<void>, childDepth?: number }) => {

    const user = use(fetchUser(comment.userID));

    if (user === null) {
        return <>Failed to load user</>
    }

    const date = new Date(comment.lastUpdate);
    const childOrParentStyling = childDepth ?
        `p-3 ml-${6/childDepth} lg:ml-${12/childDepth} border-t border-gray-400 dark:border-gray-600` :
        "p-6 mb-3 border-b border-gray-200 rounded-lg";

    const submitNewCommentWithParent = async (formData: FormData) => {
        "use server";
        formData.set("parentCommentId", comment.id);
        console.log(formData);
        

        return submitNewComment(formData, comment.id);
    }

    const likeAction = async (userId: string) => {
        "use server";

        revalidatePath; //for some reason need to "announce" this function for the server action to know it exists
        // might be resolved in next 14.

        //for some reason server actions doesnt like es5 methods (some, filter, etc).
        //hopefully resolved in next 14.
        let hasUserAlreadyLiked = false;
        for (const upvoteUser of comment.upvotes as string[]) {
            if (upvoteUser === userId) {
                hasUserAlreadyLiked = true;
                break;
            }
        }

        if (hasUserAlreadyLiked) {
            return removeLikeFromComment(comment, userId)
            .finally(() => {
                revalidatePath("/cv/[cvId]");
            });
        } else {
            return addLikeToComment(comment, userId)
            .finally(() => {
                revalidatePath("/cv/[cvId]");
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
                    revalidatePath={revalidatePath} />
            {/* @ts-expect-error Server Component */}
            <ChildComments childDepth={childDepth + 1} parentCommentId={comment.id}
                submitNewComment={submitNewComment} revalidatePath={revalidatePath} />
        </article>
    )
}