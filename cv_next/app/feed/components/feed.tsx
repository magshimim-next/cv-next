"use client"

import CVItem from "@/app/feed/components/CVItem"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { fetchCvs } from "@/app/actions/fetchCvs"
import CVItemRSC from "./CVItemRSC"
import TriggerPagination from "./TriggerPagination"
import { ClientCvModel } from "@/types/models/cv"
import { CvsContext, CvsDispatchContext } from "@/providers/cvsProvider"
import { ReloadButton } from "@/components/ui/reloadButton"

export default function Feed({
  initialBatch,
}: {
  initialBatch: ClientCvModel[] | null
}) {
  const cvsContextConsumer = useContext(CvsContext)
  const cvsDispatchContextConsumer = useContext(CvsDispatchContext)
  const [cvs, setCvs] = useState<ClientCvModel[] | null>(
    cvsContextConsumer.cvs?.length ? cvsContextConsumer.cvs : initialBatch
  )
  const cvsRef = useRef<ClientCvModel[] | null>()
  const lastCvRef = useRef<string | undefined>(cvs?.[cvs?.length]?.id)
  const [loadMore, setLoadMore] = useState(true)

  useEffect(() => {
    //update cv-related refs
    cvsRef.current = cvs
    lastCvRef.current = cvs?.[cvs?.length - 1]?.id
  }, [cvs])

  const fetchCvsCallback = useCallback(async () => {
    //fetch cvs and handle loading states
    if (loadMore) {
      const fetchedCvs = await fetchCvs({ lastId: lastCvRef.current })

      if (fetchedCvs && fetchedCvs?.length > 0) {
        if (fetchedCvs[fetchedCvs.length - 1]?.id === lastCvRef.current) {
          setLoadMore(false)
        } else {
          setCvs((prevCvs) => [
            ...(prevCvs?.length ? prevCvs : []),
            ...fetchedCvs,
          ])
        }
      } else {
        setLoadMore(false)
      }
    }
  }, [loadMore])

  useEffect(() => {
    //before unmount, save current cvs state to context for smoother navigation
    //TODO: add time-based revalidation for context
    return () => {
      if (cvsRef.current) {
        cvsDispatchContextConsumer({ type: `replace`, payload: cvsRef.current })
      }
    }
  }, [cvsDispatchContextConsumer])

  const forceReload = () => {
    cvsDispatchContextConsumer({ type: `reset`, payload: [] })
    setCvs([])
    setLoadMore(true)
  }

  return (
    <main>
      <div className="container mx-auto space-y-8 p-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {cvs ? (
            cvs.map((cv) => (
              <CVItem key={cv.id} cv={cv}>
                <CVItemRSC cv={cv} />
              </CVItem>
            ))
          ) : (
            <></>
          )}
        </div>
        {loadMore ? (
          <TriggerPagination callbackTrigger={fetchCvsCallback} />
        ) : (
          <div className="sticky bottom-5 z-10 flex justify-center">
            <ReloadButton callback={forceReload}>Reload</ReloadButton>
          </div>
        )}
      </div>
    </main>
  )
}
