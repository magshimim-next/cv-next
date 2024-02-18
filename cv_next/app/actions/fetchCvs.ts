"use server"

import { getPaginatedCvs } from "@/server/api/cvs"
import MyLogger from "@/server/base/logger"
import { filterObj } from "../feed/components/filterPanel"

let mappedResults: { [key: number]: PaginatedCvsModel | null } = {}

export const fetchCvsForFeed = async ({
  page,
  forceReset = false,
  filters
}: {
  page?: number
  forceReset?: boolean
  filters?: filterObj,
}): Promise<PaginatedCvsModel | null> => {
  if (forceReset) {
    mappedResults = {}
  }
  if (page && mappedResults?.[page]) {
    MyLogger.logDebug(
      `result from cache for id: ${page}\ncache: ${Object.keys(
        mappedResults
      ).toString()}`
    )
    return mappedResults?.[page]
  }

  const result: PaginatedCvsModel | null = await getPaginatedCvs(true, page, filters)
  if (result) {
    mappedResults[result.page] = result
  }
  return result
}
