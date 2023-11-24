'use client';

import CVItem from "@/app/feed/components/CVItem";
import { useContext, useEffect, useRef, useState } from "react";
import { fetchCvs } from "@/app/actions/fetchCvs";
import CVItemRSC from "./CVItemRSC";
import TriggerPagination from "./TriggerPagination";
import { ClientCvModel } from "@/types/models/cv";
import { CvsContext, CvsDispatchContext } from "@/providers/cvsProvider";
import { ReloadButton } from "@/components/ui/reloadButton";

export default function Feed({initialBatch} : {initialBatch: ClientCvModel[] | null}) {
  
  const cvsContextConsumer = useContext(CvsContext);
  const cvsDispatchContextConsumer = useContext(CvsDispatchContext);
  const [cvs, setCvs] = useState<ClientCvModel[] | null>(cvsContextConsumer.cvs?.length ? cvsContextConsumer.cvs : initialBatch);
  const cvsRef = useRef<ClientCvModel[] | null>();
  const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);

  useEffect(() => {
    //make sure cvs ref is reset on mount
    cvsRef.current = null;
  }, []);
  
  const fetchCvsCallback = async (page: number) => {      
    //fetch cvs and handle loading states
    if (loadMore && page > 0) {
      setLoading(true);
      const fetchedCvs = await fetchCvs({lastId: cvs?.[cvs.length-1]?.id});
      
      if (fetchedCvs && fetchedCvs?.length > 0) {
        if (fetchedCvs[fetchedCvs.length - 1]?.id === cvs?.[cvs.length-1]?.id) {
          setLoadMore(false);
        } else {
          cvsRef.current = cvs ? [...cvs, ...fetchedCvs] : fetchedCvs;
          setCvs(cvs ? [...cvs, ...fetchedCvs] : fetchedCvs);
        }
        setLoading(false);
      } else {
        setLoadMore(false);
      }
    }
  };

  useEffect(() => {
    //before unmount, save current cvs state to context for smoother navigation
    //TODO: add time-based revalidation for context
    return () => {
      if (cvsRef.current) {
        cvsDispatchContextConsumer({ type: `replace`, payload: cvsRef.current });
      }
    }
  }, []);

  const forceReload = () => {
    cvsDispatchContextConsumer({type: `reset`, payload: []});
    setCvs([]);
    setPage(0);
    setLoadMore(true);
    setLoading(false);
    //force delay to wait for state change so we can be sure Effect will run
    setTimeout(()=>{}, 100);
  };

  return (
    <main>
      <div className="container mx-auto space-y-8 p-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {cvs ? cvs.map((cv) => (
            <CVItem key={cv.id} cv={cv}>
              <CVItemRSC cv={cv} />
            </CVItem>
          )) : <></>
        }
        </div>
          {loadMore &&
            <TriggerPagination
                loadMore={loadMore}
                pageNum={page}
                setPage={setPage}
                lastId={cvs?.[cvs.length - 1]?.id}
                isLoading={isLoading}
                callbackTrigger={fetchCvsCallback}
          />}
          {!loadMore &&
          <div className="flex justify-center sticky bottom-5 z-10">
            <ReloadButton callback={forceReload}>
              Reload
            </ReloadButton>
          </div>}
      </div>
    </main>
  )
}
