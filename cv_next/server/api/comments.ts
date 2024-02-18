import "server-only"

import MyLogger from "@/server/base/logger"
import SupabaseHelper from "./supabaseHelper"

// async function addNewComment(
//   comment: CommentModel
// ): Promise<boolean> {
//   try {
//     let data = Helper.serializeObjectToFirebaseUsage(comment.removeBaseData())
//     let res = await FirebaseHelper.addData(data, comment.collectionName)
//     return new DbOperationResult(
//       typeof res === "string",
//       res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
//       res
//     )
//   } catch (err) {
//     MyLogger.logInfo("Error @ FirebaseHelper::addNewComment", err)
//     return new DbOperationResult(
//       false,
//       typeof err === typeof RateLimitError
//         ? ErrorReasons.rateLimitPerSecondReached
//         : ErrorReasons.undefinedErr,
//       err
//     )
//   }
// }

// async function updateComment(
//   comment: CommentModel
// ): Promise<DbOperationResult> {
//   try {
//     let data = Helper.serializeObjectToFirebaseUsage(comment.removeBaseData())
//     let res = await FirebaseHelper.updateData(
//       comment.id,
//       data,
//       comment.collectionName
//     )
//     return new DbOperationResult(
//       res,
//       res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
//       res
//     )
//   } catch (err) {
//     MyLogger.logInfo("Error @ FirebaseHelper::updateComment", err)
//     return new DbOperationResult(
//       false,
//       typeof err === typeof RateLimitError
//         ? ErrorReasons.rateLimitPerSecondReached
//         : ErrorReasons.undefinedErr,
//       err
//     )
//   }
// }

// async function getAllCommentsByUserId(
//   userId: string,
//   filterOutDeleted: boolean = true
// ): Promise<CommentModel[] | null> {
//   return this.getAllCommentsByQueryFilter(
//     where("userID", "==", userId),
//     filterOutDeleted
//   )
// }

/**
 * Retrieves all comments for a given CV ID.
 *
 * @param {string} cvId - The ID of the CV
 * @param {boolean} [ascending=false] - Flag to indicate if comments should be sorted in ascending order based on date
 * @return {Promise<CommentModel[] | null>} The list of comments or null if there's an error
 */
export async function getAllCommentsByCVId(
  cvId: string,
  ascending: boolean = false
): Promise<CommentModel[] | null> {
  try {
    const { data: comments, error } = await SupabaseHelper.getSupabaseInstance()
      .from("comments")
      .select("*")
      .eq("document_id", cvId)
      .order("last_update", { ascending: ascending })

    if (error) {
      MyLogger.logInfo("Error @ comments::getAllCommentsByDocumentId", error)
      return null
    }

    return comments
  } catch (error) {
    MyLogger.logInfo("Error @ comments::getAllCommentsByDocumentId", error)
    return null
  }
}

//   async function getAllCommentsByParentCommentID(
//     parentCommentID: string
//   ): Promise<CommentModel[] | null> {
//     return this.getAllCommentsByQueryFilter(
//       where("parentCommentID", "==", parentCommentID)
//     )
//   }
// }
