"use client"

import CVItem from "@/app/feed/components/CVItem"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { fetchCvsForFeed } from "@/app/actions/fetchCvs"
import CVItemRSC from "./CVItemRSC"
import TriggerPagination from "./TriggerPagination"
import { CvsContext, CvsDispatchContext } from "@/providers/cvsProvider"
import { ReloadButton } from "@/components/ui/reloadButton"
import Definitions from "@/lib/definitions"

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

  useEffect(() => {
    cvsRef.current = cvs
  }, [cvs])

  const fetchCvsCallback = useCallback(async () => {
    //fetch cvs and handle loading states
    if (loadMore) {
      const fetchedCvs = await fetchCvsForFeed({ page: page.current + 1 })
      console.log(fetchedCvs)
      if (fetchedCvs && fetchedCvs.cvs.length > 0) {
        if (fetchedCvs.page === page.current) {
          setLoadMore(false)
        } else {
          setCvs((prevCvs) => [
            ...(prevCvs?.length ? prevCvs : []),
            ...fetchedCvs.cvs,
          ])
          page.current = fetchedCvs.page
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
