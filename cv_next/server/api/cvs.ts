// import 'server-only'

import Helper from "@/server/base/helper";
import {
  collection,
  where,
  query,
  DocumentData,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  limit,
  orderBy,
  Query,
  startAfter,
} from "firebase/firestore";
import CommentModel from "@/types//models/comment";
import MyLogger from "@/server/base/logger";
import { Categories } from "@/types/models/categories";
import CvModel from "@/types/models/cv";
import Definitions from "../base/definitions";
import { DbOperationResult, ErrorReasons, RateLimitError } from "./utils";
import FirebaseHelper from './firebaseHelper'


export default class CvsApi {

    
  /**
   * Updates a specific cv using the given model
   * @param cv should hold the proper ID in order to update the correct document
   * @returns DbOperationResult
   */
  public static async updateCV(cv: CvModel): Promise<DbOperationResult> {
    try {
      let data = Helper.serializeObjectToFirebaseUsage(cv.removeBaseData());
      let res = await FirebaseHelper.updateData(cv.id, data, cv.collectionName);
      return new DbOperationResult(
        res,
        res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
        res
      );
    } catch (err) {
      MyLogger.logInfo("Error @ FirebaseHelper::updateCV", err);
      return new DbOperationResult(
        false,
        typeof err === typeof RateLimitError
          ? ErrorReasons.rateLimitPerSecondReached
          : ErrorReasons.undefinedErr,
        err
      );
    }
  }

  private static documentSnapshotToCV(
    documentSnapshot: QueryDocumentSnapshot
  ): CvModel {
    const documentData = documentSnapshot.data() as DocumentData;
    return new CvModel(
      documentSnapshot.id,
      documentData.userID,
      documentData.documentLink,
      documentData.categoryID,
      documentData.description,
      documentData.resolved,
      documentData.deleted,
      documentData.uploadDate
    );
  }

  private static startAfterSnapshot: QueryDocumentSnapshot<unknown> | undefined;
  private static endBeforeSnapshot: QueryDocumentSnapshot<unknown> | undefined;
  private static pageSize: number = Definitions.CVS_PER_PAGE;
  private static queryLimit: number = this.pageSize;
  private static initialQueryDone: boolean = false;
  private static paginationReachedEnd: boolean = false;
  private static currentCvPaginatioPage: number =
    Definitions.DEFAULT_PAGINATION_FIRST_PAGE_NUMBER;

  private static async paginatedGetAllCvsByQueryFilter(
    queryFilter?: QueryFieldFilterConstraint,
    filterOutDeleted: boolean = true
  ): Promise<CvModel[] | null> {
    if (!this.initialQueryDone) {
        this.initialQueryDone = true;
    }
    let pageQuery: Query<DocumentData>;
    let collectionRef = collection(
      FirebaseHelper.getFirestoreInstance(),
      CvModel.CollectionName
    );
    let filterDeletedQuery = where("deleted", "==", !filterOutDeleted);

    if (this.paginationReachedEnd) {
      return [];
    } else if (this.startAfterSnapshot) {
      // Create a new query starting after the last document of the previous page
      pageQuery =
        queryFilter !== undefined
          ? query(
              collectionRef,
              orderBy("uploadDate", "desc"),
              startAfter(this.startAfterSnapshot),
              limit(this.queryLimit),
              filterDeletedQuery,
              queryFilter
            )
          : query(
              collectionRef,
              orderBy("uploadDate", "desc"),
              startAfter(this.startAfterSnapshot),
              limit(this.queryLimit),
              filterDeletedQuery
            );
            this.currentCvPaginatioPage++;
    } else {
      // Perform the initial query
      pageQuery =
        queryFilter !== undefined
          ? query(
              collectionRef,
              orderBy("uploadDate", "desc"),
              limit(this.queryLimit),
              filterDeletedQuery,
              queryFilter
            )
          : query(
              collectionRef,
              orderBy("uploadDate", "desc"),
              limit(this.queryLimit),
              filterDeletedQuery
            );
    }

    try {
      const querySnapshot = await FirebaseHelper.myGetDocs(pageQuery);
      const matchingDocuments: CvModel[] = [];

      querySnapshot.forEach((documentSnapshot) => {
        matchingDocuments.push(
            this.documentSnapshotToCV(documentSnapshot)
        );
      });
      // Determine if there are more pages to fetch
      if (querySnapshot.size === this.queryLimit) {
        // Get the first and last document from the current page
        const firstVisible = querySnapshot.docs[0];
        const lastVisible = querySnapshot.docs[querySnapshot.size - 1];

        this.startAfterSnapshot = lastVisible;
        this.endBeforeSnapshot = firstVisible;
      } else {
        // No more pages to fetch
        this.startAfterSnapshot = undefined;
        this.endBeforeSnapshot = undefined;
        this.paginationReachedEnd = true;
      }
      return matchingDocuments;
    } catch (error) {
      MyLogger.logInfo(
        "Error @ FirebaseHelper::paginatedGetAllCvsByQueryFilter",
        error
      );
    }

    return null;
  }

  private static async _getAllCvsByQueryFilter(
    queryFilter?: QueryFieldFilterConstraint,
    filterOutDeleted: boolean = true
  ): Promise<CvModel[] | null> {
    try {
      let collectionRef = collection(
        FirebaseHelper.getFirestoreInstance(),
        CvModel.CollectionName
      );
      let filterDeletedQuery = where("deleted", "==", !filterOutDeleted);
      const q =
        queryFilter !== undefined
          ? query(collectionRef, queryFilter, filterDeletedQuery)
          : query(collectionRef, filterDeletedQuery);
      const querySnapshot = await FirebaseHelper.myGetDocs(q);
      const matchingDocuments: CvModel[] = [];

      querySnapshot.forEach((documentSnapshot) => {
        matchingDocuments.push(
            this.documentSnapshotToCV(documentSnapshot)
        );
      });
      return matchingDocuments;
    } catch (error) {
      MyLogger.logInfo(
        "Error @ FirebaseHelper::_getAllCvsByQueryFilter",
        error
      );
    }
    return null;
  }

  /**
   *
   * @param userId the userId to filter by
   * @param filterOutDeleted whether or not we'd like to filter out the deleted cvs - true by default
   * @returns the CVs
   */
  public static async getAllCvsByUserId(
    userId: string,
    filterOutDeleted: boolean = true
  ): Promise<CvModel[] | null> {
    return this._getAllCvsByQueryFilter(
      where("userID", "==", userId),
      filterOutDeleted
    );
  }

  /**
   *
   * @param category the category to filter by
   * @param filterOutDeleted whether or not we'd like to filter out the deleted cvs - true by default
   * @returns the CVs
   */
  public static async getAllCvsByCategory(
    category: Categories.category,
    filterOutDeleted: boolean = true
  ): Promise<CvModel[] | null> {
    return this._getAllCvsByQueryFilter(
      where("categoryID", "==", category),
      filterOutDeleted
    );
  }

  /**
   * @param forward - always true to get the next data
   * @param filterOutDeleted whether or not we'd like to filter out the deleted CVs - true by default
   * @returns the users
   */
  public static async getAllCvs(
    forward: boolean,
    filterOutDeleted: boolean = true
  ): Promise<CvModel[] | null> {
    let res = this.paginatedGetAllCvsByQueryFilter(
      undefined,
      filterOutDeleted
    );
    MyLogger.logDebug(
      `requested all cvs(pagination) - current page number: ${this.getCurrentPageNumber()}` +
        `\n got:`,
      res
    );
    return res;
  }

  public static getCurrentPageNumber(): number {
    return this.currentCvPaginatioPage;
  }

  public static resetCvPeginationNumber() {
    this.currentCvPaginatioPage =
      Definitions.DEFAULT_PAGINATION_FIRST_PAGE_NUMBER;
    this.paginationReachedEnd = false;
  }
}