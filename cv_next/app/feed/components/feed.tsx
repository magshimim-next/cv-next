"use client"

import CVItem from "@/app/feed/components/CVItem"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { fetchCvsForFeed } from "@/app/actions/fetchCvs"
import CVItemRSC from "./CVItemRSC"
import { CvsContext, CvsDispatchContext } from "@/providers/cvsProvider"
import { ReloadButton } from "@/components/ui/reloadButton"
import Definitions from "@/lib/definitions"
import { useInView } from "react-intersection-observer"

export default function Feed({
  initialBatch,
}: {
  initialBatch: PaginatedCvsModel | null
}) {
  const cvsContextConsumer = useContext(CvsContext)
  const cvsDispatchContextConsumer = useContext(CvsDispatchContext)
  const initialCvs = cvsContextConsumer.cvs?.length
    ? cvsContextConsumer.cvs
    : initialBatch?.cvs ?? []

  const [cvs, setCvs] = useState<CvModel[] | null>(initialCvs)
  const cvsRef = useRef<CvModel[] | null>()
  const page = useRef<number>(
    initialBatch?.page ?? Definitions.DEFAULT_PAGINATION_FIRST_PAGE_NUMBER
  )
  const [loadMore, setLoadMore] = useState(true)

  function TriggerPagination({
    callbackTrigger,
  }: {
    callbackTrigger: () => Promise<void>
  }) {
    const [triggerRef, inView] = useInView()

    useEffect(() => {
      if (inView) {
        callbackTrigger()
      }
    }, [callbackTrigger, inView])

    return <div ref={triggerRef}></div>
  }

  useEffect(() => {
    cvsRef.current = cvs
  }, [cvs])

  const fetchCvsCallback = useCallback(async () => {
    if (loadMore) {
      const response = await fetchCvsForFeed({ page: page.current + 1 })
      if (response && response.cvs.length > 0) {
        if (response.page === page.current) {
          setLoadMore(false)
        } else {
          setCvs((prevCvs) => [
            ...(prevCvs?.length ? prevCvs : []),
            ...response.cvs,
          ])
          page.current = response.page
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
          <TriggerPagination callbackTrigger={fetchCvsCallback} />
        </div>
        {!loadMore ? (
          <div className="sticky bottom-5 z-10 flex justify-center">
            <ReloadButton callback={forceReload}>Reload</ReloadButton>
          </div>
        ) : (
          //TODO: replace with proper spinner
          <div className="z-10 flex justify-center">Loading...</div>
        )}
      </div>
    </main>
  )
}
