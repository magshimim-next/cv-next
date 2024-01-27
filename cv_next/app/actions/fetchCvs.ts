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
  MyLogger.logDebug(`new call with id: ${page}`)

  if (forceReset) {
    mappedResults = {}
  }
  MyLogger.logDebug(Object.keys(mappedResults).toString())

  if (page && mappedResults?.[page]) {
    MyLogger.logDebug(`result from cache for id: ${page}`)
    return mappedResults?.[page]
  }

  const result: PaginatedCvsModel | null = await getPaginatedCvs(
    true,
    page ?? undefined
  )
  if (result) {
    mappedResults[result.page] = result
  }
  return result
}
