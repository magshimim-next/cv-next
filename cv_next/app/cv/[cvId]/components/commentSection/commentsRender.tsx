"use client";

import { fetchComments } from "@/app/actions/comments";
import { ClientCommentModel } from "@/types/models/comment";
import useSWRMutation from "swr/mutation";
import { Comment } from "./comment";


const commentsFetcherAlias = (cvId: string, {arg} : {arg?: boolean}) => fetchComments(cvId, arg);

export const CommentsRender = ({ children, cvId } : { children?: React.ReactNode, cvId: string }) => {

    const { isMutating } = useSWRMutation(cvId, commentsFetcherAlias, {});
    const userId = /*useContext... */ "dB3txgQQWJS4MggsZHP0";
    const staleStyle = isMutating ? "opacity-50" : "opacity-100";
    console.log(isMutating);
    

    if (!children) {
        return <></>
    }

    return (
        <div className={staleStyle}>
            {children}
        </div>
    )
}
