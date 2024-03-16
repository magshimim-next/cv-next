import "server-only"

import Helper from "@/server/base/helper"
import CommentModel from "@/types//models/comment"
import MyLogger from "@/server/base/logger"
import { DbOperationResult, ErrorReasons, RateLimitError } from "./utils"

//TODO: implement CommentsApi with supabase

export default class CommentsApi {
  /**
   * Adds a new comment to the db, excludes the model ID (created automatically)
   * @param comment the comment model to add
   * @returns true if succeeded.
   */
  public static async addNewComment(
    comment: CommentModel
  ): Promise<DbOperationResult> {
    try {
      let data = Helper.serializeObjectToFirebaseUsage(comment.removeBaseData())
      let res = await FirebaseHelper.addData(data, comment.collectionName)
      return new DbOperationResult(
        typeof res === "string",
        res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
        res
      )
    } catch (err) {
      MyLogger.logInfo("Error @ FirebaseHelper::addNewComment", err)
      return new DbOperationResult(
        false,
        typeof err === typeof RateLimitError
          ? ErrorReasons.rateLimitPerSecondReached
          : ErrorReasons.undefinedErr,
        err
      )
    }
  }

  /**
   * Updates a specific comment using the given model
   * @param comment should hold the proper ID in order to update the correct document
   * @returns true upon success
   */
  public static async updateComment(
    comment: CommentModel
  ): Promise<DbOperationResult> {
    try {
      let data = Helper.serializeObjectToFirebaseUsage(comment.removeBaseData())
      let res = await FirebaseHelper.updateData(
        comment.id,
        data,
        comment.collectionName
      )
      return new DbOperationResult(
        res,
        res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
        res
      )
    } catch (err) {
      MyLogger.logInfo("Error @ FirebaseHelper::updateComment", err)
      return new DbOperationResult(
        false,
        typeof err === typeof RateLimitError
          ? ErrorReasons.rateLimitPerSecondReached
          : ErrorReasons.undefinedErr,
        err
      )
    }
  }

  private static documentSnapshotToComment(
    documentSnapshot: QueryDocumentSnapshot
  ): CommentModel {
    const documentData = documentSnapshot.data() as DocumentData
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
    )
  }

  private static async getAllCommentsByQueryFilter(
    queryFilter: QueryFieldFilterConstraint,
    filterOutDeleted: boolean = true
  ): Promise<CommentModel[] | null> {
    try {
      let collectionRef = collection(
        FirebaseHelper.getFirestoreInstance(),
        CommentModel.CollectionName
      )
      const q = query(
        collectionRef,
        queryFilter,
        where("deleted", "==", !filterOutDeleted)
      )
      const querySnapshot = await FirebaseHelper.myGetDocs(q)
      const matchingDocuments: CommentModel[] = []

      querySnapshot.forEach((documentSnapshot) => {
        matchingDocuments.push(this.documentSnapshotToComment(documentSnapshot))
      })
      return matchingDocuments
    } catch (err) {
      MyLogger.logInfo("Error @ FirebaseHelper::updateComment", err)
    }
    return null
  }

  /**
   *
   * @param userId the userID to filter by
   * @param filterOutDeleted whether or not we'd like to filter out the deleted comments - true by default
   * @returns the comments
   */
  public static async getAllCommentsByUserId(
    userId: string,
    filterOutDeleted: boolean = true
  ): Promise<CommentModel[] | null> {
    return this.getAllCommentsByQueryFilter(
      where("userID", "==", userId),
      filterOutDeleted
    )
  }

  /**
   *
   * @param documentID is the ID of the specific CV document.
   * @returns all the top level comments of the CV
   */
  public static async getAllCommentsByDocumentId(
    documentID: string
  ): Promise<CommentModel[] | null> {
    return this.getAllCommentsByQueryFilter(
      where("documentID", "==", documentID)
    )
  }

  /**
   *
   * @param parentCommentID is the ID of the specific Parent Comment.
   * @returns all the top level comments of the specific parent comment
   */
  public static async getAllCommentsByParentCommentID(
    parentCommentID: string
  ): Promise<CommentModel[] | null> {
    return this.getAllCommentsByQueryFilter(
      where("parentCommentID", "==", parentCommentID)
    )
  }
}
