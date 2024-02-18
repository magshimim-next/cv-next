"use server"

import { getPaginatedCvs } from "@/server/api/cvs"

export const fetchCvsForFeed = async ({
  page,
}: {
  page?: number
}): Promise<PaginatedCvsModel | null> => {
  return await getPaginatedCvs(true, page)
}
