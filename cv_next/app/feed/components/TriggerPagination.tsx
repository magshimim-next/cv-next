'use client'

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";


export default function TriggerPagination({loadMore, pageNum, setPage, lastId, isLoading, callbackTrigger} :
        { loadMore: boolean, pageNum: number, setPage: Dispatch<SetStateAction<number>>,
            lastId: string | undefined, isLoading: boolean, callbackTrigger: (page: number) => Promise<void> }) {

    const [triggerRef, inView] = useInView();

    if (!loadMore) return <>No more cvs to load...</>;

    const prevId = useRef<string>();

    useEffect(() => {
        if (isLoading) return;

        if (inView && (!prevId.current || prevId.current != lastId)) {
            const nextPage = pageNum + 1;
            callbackTrigger(nextPage);
            setPage(nextPage);
            prevId.current = lastId;
        }
    }, [ inView ])

    return (
        <div ref={triggerRef} className="flex justify-center z-10">
            <div>Loading...</div>
        </div>
    )
}