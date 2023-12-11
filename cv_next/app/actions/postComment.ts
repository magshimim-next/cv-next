'use server';

import { addNewComment } from "@/server/api/comments";
import CommentModel from "@/types/models/comment";

export const postComment = async (commentData: {cvId?: string, parentCommentId?: string, userId: string, message: string})
: Promise<string | null> => {
    
    const { message, cvId, userId, parentCommentId } = commentData;
    let commentToAdd:Omit<CommentModel, "id">;
    //if we recieve a parent id, we don't want to attach cv id (cv id exists == upper level comment)
    if (parentCommentId) {
        commentToAdd = new CommentModel("", userId, message, false, false, undefined, parentCommentId);
    } else {
        commentToAdd = new CommentModel("", userId, message, false, false, cvId, undefined);
    }
    const newComment = await addNewComment(commentToAdd);
    return newComment.success ? newComment.data! : null;
};
