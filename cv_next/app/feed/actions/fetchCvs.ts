'use server';

import { getPaginatedCvs } from "@/server/api/cvs";
import CvModel from "@/types/models/cv";

export type ClientCvModel = Omit<CvModel, "removeBaseData" | "setResolved" | "setDeleted" | "updateDescription" | "getCategory">;

export default async function fetchCvs({ lastId } : { lastId?: string }): Promise<ClientCvModel[] | null> {

    const fetchedCvs: CvModel[] | null = await getPaginatedCvs(true, lastId);
    return fetchedCvs?.map(serverCv => transformCvToClient(serverCv)) ?? null;
}

const transformCvToClient = (serverCv: CvModel) => {
    const {removeBaseData, setResolved, setDeleted, updateDescription, getCategory, ...clientCv} = serverCv;
    return clientCv;
}