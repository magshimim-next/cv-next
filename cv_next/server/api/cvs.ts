import "server-only"

import Helper from "@/server/base/helper"
import MyLogger from "@/server/base/logger"
import Categories from "@/types/models/categories"
import CvModel from "@/types/models/cv"
import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  CollectionReference,
  FieldPath,
  Filter
} from "firebase-admin/firestore"
import Definitions from "../base/definitions"
import FirebaseHelper from "./firebaseHelper"
import { DbOperationResult, ErrorReasons, RateLimitError } from "./utils"

const queryLimit: number = Definitions.CVS_PER_PAGE
  Definitions.DEFAULT_PAGINATION_FIRST_PAGE_NUMBER

/**
 * Converts a document snapshot to a CV model.
 *
 * @param {QueryDocumentSnapshot} documentSnapshot - The document snapshot to convert.
 * @return {CvModel} The CV model created from the document snapshot.
 */
export function documentSnapshotToCV(
  documentSnapshot: QueryDocumentSnapshot
): CvModel {
  const documentData = documentSnapshot.data() as DocumentData
  return new CvModel(
    documentSnapshot.id,
    documentData.userID,
    documentData.documentLink,
    documentData.categoryID,
    documentData.description,
    documentData.resolved,
    documentData.deleted,
    documentData.uploadDate
  )
}

/**
 * Retrieves paginated CVs based on a query filter and optionally filters out deleted CVs.
 * If last document id is given, retreive the "page" that starts after it.
 *
 * @param {Filter} queryFilter - Optional query filter to apply to the CVs.
 * @param {boolean} filterOutDeleted - Optional flag to filter out deleted CVs. Defaults to true.
 * @param {string?} lastId - Optional last cv document id to start the query after.
 * @return {Promise<CvModel[] | null>} A promise that resolves to an array of CV models or null if an error occurred.
 */
export async function getPaginatedCvsByQueryFilter(
  queryFilter?: Filter,
  filterOutDeleted: boolean = true,
  lastId?: string
): Promise<CvModel[] | null> {
  let pageQuery: Query<DocumentData>;
  let collectionRef = FirebaseHelper.getFirestoreInstance().collection(
    CvModel.CollectionName
  );
  let filterDeletedQuery = Filter.where("deleted", "==", !filterOutDeleted);
  
  if (lastId) {
    const lastDoc = await getCvById(lastId, collectionRef, false);
    if (!lastDoc || lastDoc instanceof CvModel) {
      return null;
    }
    pageQuery =
    queryFilter !== undefined
    ? 
    collectionRef
    .orderBy("uploadDate", "desc")
    .limit(queryLimit)
    .where(filterDeletedQuery)
    .where(queryFilter)
    .startAfter(lastDoc)
    : 
    collectionRef
    .orderBy("uploadDate", "desc")
    .limit(queryLimit)
    .where(filterDeletedQuery)
    .startAfter(lastDoc)
    ;
  } else {
    pageQuery =
    queryFilter !== undefined
    ? collectionRef
    .orderBy("uploadDate", "desc")
    .limit(queryLimit)
    .where(filterDeletedQuery)
    .where(queryFilter)
    : collectionRef
    .orderBy("uploadDate", "desc")
    .limit(queryLimit)
    .where(filterDeletedQuery);
  }
  
  try {
    const querySnapshot = await FirebaseHelper.myGetDocs(pageQuery)
    const matchingDocuments: CvModel[] = []

    querySnapshot.forEach((documentSnapshot) => {
      matchingDocuments.push(documentSnapshotToCV(documentSnapshot))
    })
    return matchingDocuments
  } catch (error) {
    MyLogger.logInfo(
      "Error @ FirebaseHelper::paginatedGetAllCvsByQueryFilter",
      error
    )
  }

  return null
}

export async function getCvById(cvId: string,
  collectionRefParam?: CollectionReference,
  translateSnapshot: boolean = true)
  : Promise<CvModel | QueryDocumentSnapshot<DocumentData> | undefined> {
  const collectionRef = collectionRefParam ?? FirebaseHelper.getFirestoreInstance().collection(
    CvModel.CollectionName
  )
  const findDocQuery = collectionRef.where(FieldPath.documentId(), "==", cvId);
  
  try {
    const querySnapshot = await FirebaseHelper.myGetDocs(findDocQuery);
    if (querySnapshot.size != 1) {
      throw new Error("Expected only one match for query; documents found: " + querySnapshot.docs);
    }
    if (translateSnapshot) {
      const matchingDocuments: CvModel[] = []

      querySnapshot.forEach((documentSnapshot) => {
        matchingDocuments.push(documentSnapshotToCV(documentSnapshot))
      })
      return matchingDocuments.at(0)
    } else {
      return querySnapshot.docs.at(0)
    }
  } catch (error) {
    MyLogger.logInfo(
      "Error @ FirebaseHelper::paginatedGetAllCvsByQueryFilter",
      error
    )
  }
}

/**
 * Retrieves all CVs from the database based on a given query filter and
 * optionally filters out deleted CVs.
 *
 * @param {Filter} queryFilter - The query filter to apply.
 * @param {boolean} filterOutDeleted - Whether to filter out deleted CVs.
 * @return {Promise<CvModel[] | null>} An array of CV models that match the
 * query filter, or null if there was an error.
 */
export async function _getAllCvsByQueryFilter(
  queryFilter?: Filter,
  filterOutDeleted: boolean = true
): Promise<CvModel[] | null> {
  try {
    let collectionRef = FirebaseHelper.getFirestoreInstance().
    collection(
      CvModel.CollectionName
    )
    let filterDeletedQuery = Filter.where("deleted", "==", !filterOutDeleted)
    const q =
      queryFilter !== undefined
        ? collectionRef.where(queryFilter).where(filterDeletedQuery)
        : collectionRef.where(filterDeletedQuery)
    const querySnapshot = await FirebaseHelper.myGetDocs(q)
    const matchingDocuments: CvModel[] = []

    querySnapshot.forEach((documentSnapshot) => {
      matchingDocuments.push(documentSnapshotToCV(documentSnapshot))
    })
    return matchingDocuments
  } catch (error) {
    MyLogger.logInfo("Error @ FirebaseHelper::_getAllCvsByQueryFilter", error)
  }
  return null
}

/**
 * Retrieves all CVs by user ID.
 *
 * @param {string} userId - The ID of the user.
 * @param {boolean} filterOutDeleted - Whether to filter out deleted CVs.
 * @return {Promise<CvModel[] | null>} - A promise that resolves to an array of CV models or null.
 */
export async function getAllCvsByUserId(
  userId: string,
  filterOutDeleted: boolean = true
): Promise<CvModel[] | null> {
  return _getAllCvsByQueryFilter(
    Filter.where("userID", "==", userId),
    filterOutDeleted
  )
}

/**
 * Retrieves all CVs by category.
 *
 * @param {Categories.category} category - The category to filter CVs by.
 * @param {boolean} filterOutDeleted - Whether to exclude deleted CVs from the result. Defaults to true.
 * @return {Promise<CvModel[] | null>} - A promise that resolves to an array of CV models or null.
 */
export async function getAllCvsByCategory(
  category: Categories.category,
  filterOutDeleted: boolean = true
): Promise<CvModel[] | null> {
  return _getAllCvsByQueryFilter(
    Filter.where("categoryID", "==", category),
    filterOutDeleted
  )
}

/**
 * Retrieves paginated CVs from the database.
 *
 * @param {boolean} filterOutDeleted - Whether to filter out deleted CVs.
 * @param {string?} lastId - optionally pass the last cv id to start the query after. 
 * @return {Promise<CvModel[] | null>} - A promise that resolves to an array of CV models or null.
 */
export async function getPaginatedCvs(
  filterOutDeleted: boolean = true,
  lastId?: string
): Promise<CvModel[] | null> {
  let res = getPaginatedCvsByQueryFilter(undefined, filterOutDeleted, lastId)
  MyLogger.logDebug(
    `requested all cvs(pagination) - last cv id: ${lastId}`
  )
  return res
}

/**
 * Updates a CV in the database.
 *
 * @param {CvModel} cv - The CV model to be updated.
 * @return {Promise<DbOperationResult>} A promise that resolves to a DbOperationResult object.
 */
export async function updateCV(cv: CvModel): Promise<DbOperationResult> {
  try {
    let data = Helper.serializeObjectToFirebaseUsage(cv.removeBaseData())
    let res = await FirebaseHelper.updateData(cv.id, data, cv.collectionName)
    return new DbOperationResult(
      res,
      res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
      res
    )
  } catch (err) {
    MyLogger.logInfo("Error @ FirebaseHelper::updateCV", err)
    return new DbOperationResult(
      false,
      typeof err === typeof RateLimitError
        ? ErrorReasons.rateLimitPerSecondReached
        : ErrorReasons.undefinedErr,
      err
    )
  }
}
