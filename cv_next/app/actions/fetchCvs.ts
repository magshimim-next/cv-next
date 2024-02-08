"use server"

import { getPaginatedCvs } from "@/server/api/cvs"
import CvModel, { ClientCvModel } from "@/types/models/cv"

let mappedResults: { [key: string]: ClientCvModel[] | null } = {}

export const fetchCvs = async ({
  lastId,
  forceReset = false,
}: {
  lastId?: string
  forceReset?: boolean
}): Promise<ClientCvModel[] | null> => {
  console.log(Object.keys(mappedResults))
  if (forceReset) {
    mappedResults = {}
  }
  if (lastId && mappedResults?.[lastId]) {
    console.log(`result from cache for id: ${lastId}`)

    return mappedResults?.[lastId]
  }
  console.log(`new call with id: ${lastId}`)

  const fetchedCvs: CvModel[] | null = await getPaginatedCvs(true, lastId)
  const result =
    fetchedCvs?.map((serverCv) => transformCvToClient(serverCv)) ?? null
  mappedResults[`${lastId}`] = result
  return result
}

const transformCvToClient = (serverCv: CvModel) => {
  const {
    removeBaseData,
    setResolved,
    setDeleted,
    updateDescription,
    getCategory,
    ...clientCv
  } = serverCv
  return clientCv
}
