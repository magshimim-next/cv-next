'use client';

import CVItem from "@/app/feed/components/CVItem";
import { useEffect, useState } from "react";
import fetchCvs, { ClientCvModel } from "../actions/fetchCvs";
import TriggerPagination from "./TriggerPagination";

export default function Feed({initialBatch} : {initialBatch: ClientCvModel[] | null}) {

  const [cvs, setCvs] = useState<ClientCvModel[] | null>(initialBatch);
  const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);

  useEffect(() => {
    async function fetchCvsEffect() {
      if (loadMore && page > 0) {
        setLoading(true);
        const fetchedCvs = await fetchCvs({lastId: cvs?.[cvs.length-1]?.id});
        if (fetchedCvs && fetchedCvs?.length > 0) {
          if (fetchedCvs[fetchedCvs.length - 1]?.id === cvs?.[cvs.length-1]?.id) {
            setLoadMore(false);
          } else {
            setCvs(cvs ? [...cvs, ...fetchedCvs] : fetchedCvs);
          }
          setLoading(false);
        }
      }
    }
    fetchCvsEffect();
  }, [ page, loadMore ]);

  return (
    <main>
      <div className="container mx-auto space-y-8 p-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {cvs ? cvs.map((cv) => (
            <CVItem key={cv.id} cv={cv} />
          )) : <></>
        }
        </div>
          {!isLoading && loadMore &&
            <TriggerPagination
                loadMore={loadMore}
                pageNum={page}
                setPage={setPage}
                lastId={cvs?.[cvs.length - 1]?.id}
          />}
      </div>
    </main>
  )
}
