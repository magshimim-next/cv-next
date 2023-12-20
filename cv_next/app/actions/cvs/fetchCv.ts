'use server';

import { getCvById } from "@/server/api/cvs";
import CvModel from "@/types/models/cv";
import { cache } from "react";

export type ClientCvModel = Omit<CvModel, "removeBaseData" | "setResolved" | "setDeleted" | "updateDescription" | "getCategory">;

export const fetchCv = cache(async (cvId : string): Promise<ClientCvModel | null> => {
    console.log(`new call with id: ${cvId}`);
    

    const fetchedCv: CvModel | undefined = await getCvById(cvId) as CvModel | undefined;
    return fetchedCv ? transformCvToClient(fetchedCv) : null;
});

const transformCvToClient = (serverCv: CvModel) => {
    const {removeBaseData, setResolved, setDeleted, updateDescription, getCategory, ...clientCv} = serverCv;
    return clientCv;
}