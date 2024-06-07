"use server"

import { filterValues } from "@/app/feed/components/filterPanel"
import { getPaginatedCvs } from "@/server/api/cvs"

export const fetchCvsForFeed = async ({
  page,
  filters,
}: {
  page?: number
  filters: filterValues
}): Promise<PaginatedCvsModel | null> => {
  return await getPaginatedCvs(true, page, filters)
}
