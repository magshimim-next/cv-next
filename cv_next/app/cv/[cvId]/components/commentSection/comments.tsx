import { fetchComments } from "@/app/actions/comments";
import { Suspense } from "react";
import useSWRMutation from "swr/mutation";
import { CommentSkeleton } from "./commentSkeleton";
import { CommentsRender } from "./commentsRender";
import { Comment } from "./comment";


const CommentSectionSkeleton = () => {
    //TODO: perhaps calculate amount of skeletons needed according to viewport?
    return (
        <>
        <CommentSkeleton/>
        <CommentSkeleton/>
        <CommentSkeleton/>
        <CommentSkeleton/>
        <CommentSkeleton/>
        <CommentSkeleton/>
        <CommentSkeleton/>
        <CommentSkeleton/>
        <CommentSkeleton/>
        </>
    )
}


export const Comments = async ({ cvId } : { cvId: string }) => {

    const comments = await fetchComments(cvId);

    if (!comments) return <></>;
    console.log(comments?.length);
    
    const userId = /*useContext... */ "dB3txgQQWJS4MggsZHP0";
    
    return (
        <Suspense fallback={<CommentSectionSkeleton/>}>
            <CommentsRender cvId={cvId}>
                {comments.map((comment) =>
                    <>
                    {/* @ts-expect-error Server Component */}
                    <Comment key={comment.id} comment={comment} userId={userId}/>
                    </>)}
            </CommentsRender>
        </Suspense>
    )
}