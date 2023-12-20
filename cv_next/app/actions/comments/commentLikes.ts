"use server";

import { updateComment } from "@/server/api/comments";
import CommentModel, { ClientCommentModel } from "@/types/models/comment";

export const addLikeToComment = async (comment: ClientCommentModel, userId: string)
: Promise<ClientCommentModel | null> => {
    
    const newComment = new CommentModel(comment.id, comment.userID, comment.data,
        comment.resolved, comment.deleted,comment.documentID ?? undefined,
        comment.parentCommentID ?? undefined, comment.upvotes ?? undefined,
        comment.downvotes ?? undefined, Date.now().valueOf());
    if (newComment.upvotes) {
        newComment.upvotes.push(userId);
    } else {
        newComment.upvotes = [userId];
    }
    
    const updatedComment = await updateComment(newComment);
    return updatedComment.success ? transformCommentToClient(newComment) : null;
};

export const removeLikeFromComment = async (comment: ClientCommentModel, userId: string)
: Promise<ClientCommentModel | null> => {
    
    const newComment = new CommentModel(comment.id, comment.userID, comment.data,
        comment.resolved, comment.deleted,comment.documentID ?? undefined,
        comment.parentCommentID ?? undefined, comment.upvotes ?? undefined,
        comment.downvotes ?? undefined, Date.now().valueOf());
    if (newComment.upvotes) {
        newComment.upvotes = newComment.upvotes.filter(userUpvote => userUpvote !== userId);
    }

    const updatedComment = await updateComment(newComment);
    return updatedComment.success ? transformCommentToClient(newComment) : null;
};

const transformCommentToClient = (serverComment: CommentModel) => {
    const {removeBaseData, updateData, markDeleted, updateResolvedValue,
        addUpvote, removeUpvote, addDownvote, removeDownvote, ...clientComment} = serverComment;
    return clientComment;
}
