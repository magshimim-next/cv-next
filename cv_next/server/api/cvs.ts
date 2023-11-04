import "server-only"

import Helper from "@/server/base/helper"
import MyLogger from "@/server/base/logger"
import Categories from "@/types/models/categories"
import CvModel from "@/types/models/cv"
import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  collection,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore"
import Definitions from "../base/definitions"
import FirebaseHelper from "./firebaseHelper"
import { DbOperationResult, ErrorReasons, RateLimitError } from "./utils"

let startAfterSnapshot: QueryDocumentSnapshot<unknown> | undefined
let endBeforeSnapshot: QueryDocumentSnapshot<unknown> | undefined
let queryLimit: number = Definitions.CVS_PER_PAGE
let initialQueryDone: boolean = false
let paginationReachedEnd: boolean = false
let currentCvPaginatioPage: number =
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
 *
 * @param {QueryFieldFilterConstraint} queryFilter - Optional query filter to apply to the CVs.
 * @param {boolean} filterOutDeleted - Optional flag to filter out deleted CVs. Defaults to true.
 * @return {Promise<CvModel[] | null>} A promise that resolves to an array of CV models or null if an error occurred.
 */
export async function paginatedGetAllCvsByQueryFilter(
  queryFilter?: QueryFieldFilterConstraint,
  filterOutDeleted: boolean = true
): Promise<CvModel[] | null> {
  if (!initialQueryDone) {
    initialQueryDone = true
  }
  let pageQuery: Query<DocumentData>
  let collectionRef = collection(
    FirebaseHelper.getFirestoreInstance(),
    CvModel.CollectionName
  )
  let filterDeletedQuery = where("deleted", "==", !filterOutDeleted)

  if (paginationReachedEnd) {
    return []
  } else if (startAfterSnapshot) {
    // Create a new query starting after the last document of the previous page
    pageQuery =
      queryFilter !== undefined
        ? query(
            collectionRef,
            orderBy("uploadDate", "desc"),
            startAfter(startAfterSnapshot),
            limit(queryLimit),
            filterDeletedQuery,
            queryFilter
          )
        : query(
            collectionRef,
            orderBy("uploadDate", "desc"),
            startAfter(startAfterSnapshot),
            limit(queryLimit),
            filterDeletedQuery
          )
    currentCvPaginatioPage++
  } else {
    // Perform the initial query
    pageQuery =
      queryFilter !== undefined
        ? query(
            collectionRef,
            orderBy("uploadDate", "desc"),
            limit(queryLimit),
            filterDeletedQuery,
            queryFilter
          )
        : query(
            collectionRef,
            orderBy("uploadDate", "desc"),
            limit(queryLimit),
            filterDeletedQuery
          )
  }

  try {
    const querySnapshot = await FirebaseHelper.myGetDocs(pageQuery)
    const matchingDocuments: CvModel[] = []

    querySnapshot.forEach((documentSnapshot) => {
      matchingDocuments.push(documentSnapshotToCV(documentSnapshot))
    })
    // Determine if there are more pages to fetch
    if (querySnapshot.size === queryLimit) {
      // Get the first and last document from the current page
      const firstVisible = querySnapshot.docs[0]
      const lastVisible = querySnapshot.docs[querySnapshot.size - 1]

      startAfterSnapshot = lastVisible
      endBeforeSnapshot = firstVisible
    } else {
      // No more pages to fetch
      startAfterSnapshot = undefined
      endBeforeSnapshot = undefined
      paginationReachedEnd = true
    }
    return matchingDocuments
  } catch (error) {
    MyLogger.logInfo(
      "Error @ FirebaseHelper::paginatedGetAllCvsByQueryFilter",
      error
    )
  }

  return null
}

/**
 * Retrieves all CVs from the database based on a given query filter and
 * optionally filters out deleted CVs.
 *
 * @param {QueryFieldFilterConstraint} queryFilter - The query filter to apply.
 * @param {boolean} filterOutDeleted - Whether to filter out deleted CVs.
 * @return {Promise<CvModel[] | null>} An array of CV models that match the
 * query filter, or null if there was an error.
 */
export async function _getAllCvsByQueryFilter(
  queryFilter?: QueryFieldFilterConstraint,
  filterOutDeleted: boolean = true
): Promise<CvModel[] | null> {
  try {
    let collectionRef = collection(
      FirebaseHelper.getFirestoreInstance(),
      CvModel.CollectionName
    )
    let filterDeletedQuery = where("deleted", "==", !filterOutDeleted)
    const q =
      queryFilter !== undefined
        ? query(collectionRef, queryFilter, filterDeletedQuery)
        : query(collectionRef, filterDeletedQuery)
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
    where("userID", "==", userId),
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
    where("categoryID", "==", category),
    filterOutDeleted
  )
}

/**
 * Retrieves all CVs from the database.
 *
 * @param {boolean} filterOutDeleted - Whether to filter out deleted CVs.
 * @return {Promise<CvModel[] | null>} - A promise that resolves to an array of CV models or null.
 */
export async function getAllCvs(
  filterOutDeleted: boolean = true
): Promise<CvModel[] | null> {
  let res = paginatedGetAllCvsByQueryFilter(undefined, filterOutDeleted)
  MyLogger.logDebug(
    `requested all cvs(pagination) - current page number: ${getCurrentPageNumber()}` +
      `\n got:`,
    res
  )
  return res
}

/**
 * Retrieves the current page number.
 *
 * @return {number} The current page number.
 */
export function getCurrentPageNumber(): number {
  return currentCvPaginatioPage
}

/**
 * Resets the cv pagination number to the default first page number.
 *
 * @return {void} This function does not return anything.
 */
export function resetCvPeginationNumber() {
  currentCvPaginatioPage = Definitions.DEFAULT_PAGINATION_FIRST_PAGE_NUMBER
  paginationReachedEnd = false
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
