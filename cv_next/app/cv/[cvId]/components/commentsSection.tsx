import { fetchComments } from "@/app/actions/fetchComments";
import { postComment } from "@/app/actions/postComment";
import { ClientCvModel } from "@/types/models/cv";
import { revalidatePath } from "next/cache";
import { Suspense, use } from "react";
import { Comment } from "./comment";
import { CommentForm } from "./commentForm";
import { CommentFormRSC } from "./CommentFormRSC";


export const CommentsSection = ({ cv }: { cv: ClientCvModel }) => {

    const comments = use(fetchComments(cv.id));
    if (!comments) {
        return <></>
    };

    const submitNewComment = async (formData: FormData, parentCommentId?: string) => {
        'use server'        

        console.log(`commentSection`, formData);
        
        const commentData = {
            cvId: cv.id, 
            userId: "dB3txgQQWJS4MggsZHP0", 
            message: formData.get("comment")?.toString()!,
            parentCommentId: parentCommentId ?? formData.get("parentCommentId")?.toString()
        };
        return postComment(commentData);
    }

    const revalidatePathAction = async (path: string) => {
        'use server'

        return revalidatePath(path);
    }

    return (
    <div className="mx-auto px-4 h-full flex flex-col flex-start rounded-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion</h2>
        </div>
        <CommentForm show={true} formAction={submitNewComment} revalidatePath={revalidatePathAction}>
            <CommentFormRSC />
        </CommentForm>
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 
        dark:scrollbar-thumb-gray-800 scrollbar-thumb-rounded-full flex-1">
            {comments.length ?
                <Suspense fallback="Loading discussion..."> {/* TODO: add skeleton */}
                    {comments.map((comment) => <Comment key={comment.id} comment={comment}
                        submitNewComment={submitNewComment} revalidatePath={revalidatePathAction} />)}
                </Suspense>
                : <h3 className="text-gray-800 dark:text-gray-200">
                    No comments yet. Start the conversation!
                </h3>}
        </div>
    </div>
    )
}