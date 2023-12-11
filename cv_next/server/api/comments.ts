import 'server-only'

import Helper from "@/server/base/helper";
import {
  collection,
  where,
  query,
  DocumentData,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
} from "firebase/firestore";
import CommentModel from "@/types//models/comment";
import MyLogger from "@/server/base/logger";
import { DbOperationResult, ErrorReasons, RateLimitError } from "./utils";
import FirebaseHelper from './firebaseHelper'


/**
 * Adds a new comment to the db, excludes the model ID (created automatically)
 * @param comment the comment model to add
 * @returns true if succeeded.
 */
export async function addNewComment(
  comment: Omit<CommentModel, "id">
): Promise<DbOperationResult> {
  try {
    let data = Helper.serializeObjectToFirebaseUsage(
      comment.removeBaseData()
    );
    let res = await FirebaseHelper.addData(data, comment.collectionName);
    return new DbOperationResult(
      typeof res === "string",
      res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
      res
    );
  } catch (err) {
    MyLogger.logInfo("Error @ FirebaseHelper::addNewComment", err);
    return new DbOperationResult(
      false,
      typeof err === typeof RateLimitError
        ? ErrorReasons.rateLimitPerSecondReached
        : ErrorReasons.undefinedErr,
      err
    );
  }
}

/**
 * Updates a specific comment using the given model
 * @param comment should hold the proper ID in order to update the correct document
 * @returns true upon success
 */
export async function updateComment(
  comment: CommentModel
): Promise<DbOperationResult> {
  try {
    let data = Helper.serializeObjectToFirebaseUsage(
      comment.removeBaseData()
    );
    let res = await FirebaseHelper.updateData(
      comment.id,
      data,
      comment.collectionName
    );
    return new DbOperationResult(
      res,
      res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
      res
    );
  } catch (err) {
    MyLogger.logInfo("Error @ FirebaseHelper::updateComment", err);
    return new DbOperationResult(
      false,
      typeof err === typeof RateLimitError
        ? ErrorReasons.rateLimitPerSecondReached
        : ErrorReasons.undefinedErr,
      err
    );
  }
}

function documentSnapshotToComment(
  documentSnapshot: QueryDocumentSnapshot
): CommentModel {
  const documentData = documentSnapshot.data() as DocumentData;
  return new CommentModel(
    documentSnapshot.id,
    documentData.userID,
    documentData.data,
    documentData.resolved,
    documentData.deleted,
    documentData.documentID,
    documentData.parentCommentID,
    documentData.upvotes,
    documentData.downvotes,
    documentData.lastUpdate
  );
}

export async function getAllCommentsByQueryFilter(
  queryFilter: QueryFieldFilterConstraint,
  filterOutDeleted: boolean = true
): Promise<CommentModel[] | null> {
  try {
    let collectionRef = collection(
      FirebaseHelper.getFirestoreInstance(),
      CommentModel.CollectionName
    );
    const q = query(
      collectionRef,
      queryFilter,
      where("deleted", "==", !filterOutDeleted)
    );
    const querySnapshot = await FirebaseHelper.myGetDocs(q);
    const matchingDocuments: CommentModel[] = [];

    querySnapshot.forEach((documentSnapshot) => {
      matchingDocuments.push(
        documentSnapshotToComment(documentSnapshot)
      );
    });
    return matchingDocuments;
  } catch (err) {
    MyLogger.logInfo("Error @ FirebaseHelper::getAllCommentsByQueryFilter", err);
  }
  return null;
}

/**
 *
 * @param userId the userID to filter by
 * @param filterOutDeleted whether or not we'd like to filter out the deleted comments - true by default
 * @returns the comments
 */
export async function getAllCommentsByUserId(
  userId: string,
  filterOutDeleted: boolean = true
): Promise<CommentModel[] | null> {
  return getAllCommentsByQueryFilter(
    where("userID", "==", userId),
    filterOutDeleted
  );
}

/**
 *
 * @param documentID is the ID of the specific CV document.
 * @returns all the top level comments of the CV
 */
export async function getAllCommentsByDocumentId(
  documentID: string
): Promise<CommentModel[] | null> {
  return getAllCommentsByQueryFilter(
    where("documentID", "==", documentID)
  );
}

/**
 *
 * @param parentCommentID is the ID of the specific Parent Comment.
 * @returns all the top level comments of the specific parent comment
 */
export async function getAllCommentsByParentCommentID(
  parentCommentID: string
): Promise<CommentModel[] | null> {
  return getAllCommentsByQueryFilter(
    where("parentCommentID", "==", parentCommentID)
  );
}