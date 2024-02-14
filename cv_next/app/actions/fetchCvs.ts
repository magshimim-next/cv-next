"use server"

import { getPaginatedCvs } from "@/server/api/cvs"
import MyLogger from "@/server/base/logger"

let mappedResults: { [key: number]: PaginatedCvsModel | null } = {}

export const fetchCvsForFeed = async ({
  page,
  forceReset = false,
}: {
  page?: number
  forceReset?: boolean
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

  const result: PaginatedCvsModel | null = await getPaginatedCvs(true, page)
  if (result) {
    mappedResults[result.page] = result
  }
  return result
}
