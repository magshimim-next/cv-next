import "server-only"

import SupabaseHelper from "./supabaseHelper"
import Definitions from "@/lib/definitions"
import { Ok, Err } from "@/lib/utils"

export const revalidate = Definitions.COMMENTS_REVALIDATE_TIME_IN_SECONDS

/**
 * Add a new comment to the database.
 *
 * @param {NewCommentModel} comment - the comment to be added
 * @return {Promise<Result<void, string>>} A Promise that resolves to a Result object containing no value if successful, or an error message.
 */
export async function addNewCommentToCv(
  comment: NewCommentModel
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from("comments")
      .insert(comment)
      .select()
    if (error) {
      return Err("Error @ " + addNewCommentToCv.name + "\n", error)
    }
    return Ok.EMPTY
  } catch (err) {
    return Err("Error @ " + addNewCommentToCv.name + "\n" + err)
  }
}

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
 * Retrieves all comments associated with a specific CV ID.
 *
 * @param {string} cvId - The ID of the CV for which to retrieve comments.
 * @param {boolean} [ascending=false] - Whether to sort the comments in ascending order.
 * @param {boolean} [filterOutDeleted=true] - Whether to filter out deleted comments.
 * @return {Promise<Result<CommentModel[], string>>} A Promise that resolves to a Result object containing the retrieved comments or an error message.
 */
export async function getAllCommentsByCVId(
  cvId: string,
  ascending: boolean = false,
  filterOutDeleted = true
): Promise<Result<CommentModel[], string>> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance()
    let query = supabase
      .from("comments")
      .select("*")
      .eq("document_id", cvId)
      .order("last_update", { ascending: ascending })
    if (filterOutDeleted) {
      query = query.eq("deleted", false)
    }

    const { data: comments, error } = await query

    if (error) {
      return Err("Error @ " + getAllCommentsByCVId.name + "\n", error)
    }
    return Ok(comments)
  } catch (error) {
    return Err("Error @ " + getAllCommentsByCVId.name + "\n" + error)
  }
}
