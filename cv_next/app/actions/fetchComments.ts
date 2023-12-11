'use server';

import { getAllCommentsByDocumentId, getAllCommentsByParentCommentID } from "@/server/api/comments";
import CommentModel, { ClientCommentModel } from "@/types/models/comment";

export const fetchComments = async (cvId : string, descending = false): Promise<ClientCommentModel[] | null> => {

    const fetchedComments: CommentModel[] | null = await getAllCommentsByDocumentId(cvId);
    return fetchedComments?.map(serverComment => transformCommentToClient(serverComment))
    .sort((a, b) => descending ? a.lastUpdate - b.lastUpdate : b.lastUpdate - a.lastUpdate) ?? null;
};

export const fetchChildComments = async (parentCommentId: string, descending = false): Promise<ClientCommentModel[] | null> => {

    const fetchedChildComments: CommentModel[] | null = await getAllCommentsByParentCommentID(parentCommentId);
    return fetchedChildComments?.map(serverComment => transformCommentToClient(serverComment))
    .sort((a, b) => descending ? a.lastUpdate - b.lastUpdate : b.lastUpdate - a.lastUpdate) ?? null;
}

const transformCommentToClient = (serverComment: CommentModel) => {
    const {removeBaseData, updateData, markDeleted, updateResolvedValue,
        addUpvote, removeUpvote, addDownvote, removeDownvote, ...clientComment} = serverComment;
    return clientComment;
}