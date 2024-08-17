import "server-only";

import SupabaseHelper from "./supabaseHelper";
import { Ok, Err } from "@/lib/utils";
import { Tables, CommentKeys, ProfileKeys } from "@/lib/supabase-definitions";

/**
 * Add a new comment to the database.
 *
 * @param {NewCommentModel} comment - the comment to be added
 * @return {Promise<Result<void, string>>} A Promise that resolves to a Result object containing no value if successful, or an error message.
 */
export async function addCommentToCv(
  comment: NewCommentModel
): Promise<Result<void, string>> {
  try {
    const { data, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.comments)
      .insert(comment)
      .select();

    if (error && error.message) {
      return Err(addCommentToCv.name, error);
    }

    // if no data is returned, the comment was not added
    if (!data) {
      return Err(
        addCommentToCv.name,
        undefined,
        undefined,
        new Error("adding comment failed")
      );
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(addCommentToCv.name, undefined, undefined, err as Error);
  }
}

/**
 * Marks a comment as deleted.
 *
 * @param {string} commentId - The ID of the comment to be marked as deleted.
 * @return {Promise<Result<void, string>>} A promise that resolves to a Result object indicating the success or failure of the operation.
 */
export async function markCommentAsDeleted(
  commentId: string
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.comments)
      .update({ deleted: true })
      .eq(CommentKeys.id, commentId);
    if (error) {
      return Err(markCommentAsDeleted.name, error);
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(markCommentAsDeleted.name, undefined, undefined, err as Error);
  }
}

/**
 * Marks a comment as resolved or unresolved in the database.
 *
 * @param {string} commentId - The ID of the comment to mark as resolved or unresolved.
 * @param {boolean} resolved - Boolean indicating if the comment is resolved.
 * @return {Promise<Result<void, string>>} A promise that resolves with void or rejects with an error message.
 */
export async function setResolved(
  commentId: string,
  resolved: boolean
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.comments)
      .update({ resolved })
      .eq(CommentKeys.id, commentId);
    if (error) {
      return Err(setResolved.name, error);
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setResolved.name, undefined, undefined, err as Error);
  }
}

/**
 * Retrieves all comments associated with a specific CV ID.
 *
 * @param {string} cvId - The ID of the CV for which to retrieve comments.
 * @param {boolean} [ascending=false] - Whether to sort the comments in ascending order.
 * @param {boolean} [filterOutDeleted=true] - Whether to filter out deleted comments.
 * @return {Promise<Result<CommentModel[], string>>} A Promise that resolves to a Result object containing the retrieved comments or an error message.
 * The user_id of the retrieved comments is a json of the user_id, full_name of that user and that's username
 */
export async function getAllCommentsByCVId(
  cvId: string,
  ascending: boolean = false,
  filterOutDeleted = true
): Promise<Result<CommentModel[], string>> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.comments)
      .select(
        `*, ${CommentKeys.user_id} (${ProfileKeys.id}, ${ProfileKeys.full_name}, ${ProfileKeys.username})`
      )
      .eq(CommentKeys.document_id, cvId)
      .order(CommentKeys.last_update, { ascending: ascending });
    if (filterOutDeleted) {
      query = query.eq(CommentKeys.deleted, false);
    }
    const { data: comments, error } = await query;
    if (error) {
      return Err(getAllCommentsByCVId.name, error);
    }

    return Ok(comments);
  } catch (err) {
    return Err(getAllCommentsByCVId.name, undefined, undefined, err as Error);
  }
}

async function getCommentLikes(commentId: string): Promise<string[]> {
  const { data } = await SupabaseHelper.getSupabaseInstance()
    .from(Tables.comments)
    .select(CommentKeys.upvotes)
    .eq(CommentKeys.id, commentId)
    .limit(1);
  return data && data[0].upvotes ? data[0].upvotes : [];
}

export async function setLiked(
  commentId: string,
  liked: boolean,
  userId: string
): Promise<Result<void, string>> {
  try {
    let likes = await getCommentLikes(commentId);
    if (likes.includes(userId)) {
      if (!liked) {
        likes = likes.filter((item) => item !== userId);
      }
    } else {
      if (liked) {
        likes = [...likes, userId];
      }
    }

    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.comments)
      .update({ upvotes: likes })
      .eq(CommentKeys.id, commentId)
      .select(CommentKeys.upvotes);

    if (error) {
      return Err(setResolved.name, error);
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setResolved.name, undefined, undefined, err as Error);
  }
}

/**
 * Retrieves all comments associated with a specific User ID.
 *
 * @param {string} userId - The ID of the User for which to retrieve comments.
 * @param {boolean} [ascending=false] - Whether to sort the comments in ascending order.
 * @param {boolean} [filterOutDeleted=true] - Whether to filter out deleted comments.
 * @return {Promise<Result<CommentModel[], string>>} A Promise that resolves to a Result object containing the retrieved comments or an error message.
 */
export async function getAllCommentsByUserId(
  userId: string,
  ascending: boolean = false,
  filterOutDeleted = true
): Promise<Result<CommentModel[], string>> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.comments)
      .select("*")
      .eq(CommentKeys.user_id, userId)
      .order(CommentKeys.last_update, { ascending: ascending });
    if (filterOutDeleted) {
      query = query.eq(CommentKeys.deleted, false);
    }
    const { data: comments, error } = await query;
    if (error) {
      return Err(getAllCommentsByUserId.name, error);
    }
    return Ok(comments);
  } catch (err) {
    return Err(getAllCommentsByUserId.name, undefined, undefined, err as Error);
  }
}
