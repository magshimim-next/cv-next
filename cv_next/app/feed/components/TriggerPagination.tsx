'use client'

import { Dispatch, SetStateAction, useCallback, useRef } from "react";


export default function TriggerPagination({loadMore, pageNum, setPage, lastId} :
        { loadMore: boolean, pageNum: number, setPage: Dispatch<SetStateAction<number>>, lastId: string | undefined }) {

    if (!loadMore) return <></>;

    const prevId = useRef<string>();

    const triggerRef = useCallback((node: any) => {
        if (!node) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!prevId.current || prevId.current != lastId) {
                        setPage(pageNum + 1);
                        prevId.current = lastId;
                    }
                    observer.disconnect();
                }
            });
        });
        observer.observe(node);
    }, [lastId, pageNum]);

    return (
        <div ref={triggerRef}></div>
    )
}