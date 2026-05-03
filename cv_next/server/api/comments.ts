import "server-only";

import { Ok, Err } from "@/lib/utils";
import { Tables, CommentKeys, ProfileKeys } from "@/lib/supabase-definitions";
import SupabaseHelper from "./supabaseHelper";

/**
 * Inserts a new comment row into the cv_comments table and returns the created record.
 * @param {NewCommentModel} comment - The comment data to insert, including cv ID and author profile ID.
 * @returns {Promise<Result<CommentModel, string>>} Ok with the created comment on success, or Err on failure.
 */
export async function addCommentToCv(
  comment: NewCommentModel
): Promise<Result<CommentModel, string>> {
  try {
    const { data, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cv_comments)
      .insert(comment)
      .select();

    if (error && error.message) {
      return Err(addCommentToCv.name, { postgrestError: error });
    }

    if (!data) {
      return Err(addCommentToCv.name, {
        err: new Error("adding comment failed"),
      });
    }
    return Ok(data[0]);
  } catch (err) {
    return Err(addCommentToCv.name, {
      err: err as Error,
    });
  }
}

/**
 * Soft-deletes a comment by setting its deleted flag to true. The row is retained in the database.
 * @param {string} commentId - The unique comment ID to mark as deleted.
 * @returns {Promise<Result<void, string>>} Ok on success, or Err on failure.
 */
export async function markCommentAsDeleted(
  commentId: string
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cv_comments)
      .update({ deleted: true })
      .eq(CommentKeys.unique_cv_comment_id, commentId);
    if (error) {
      return Err(markCommentAsDeleted.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(markCommentAsDeleted.name, {
      err: err as Error,
    });
  }
}

/**
 * Updates the resolved flag on a comment.
 * @param {string} commentId - The unique comment ID to update.
 * @param {boolean} resolved - The new resolved state to persist.
 * @returns {Promise<Result<void, string>>} Ok on success, or Err on failure.
 */
export async function setResolved(
  commentId: string,
  resolved: boolean
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cv_comments)
      .update({ resolved })
      .eq(CommentKeys.unique_cv_comment_id, commentId);
    if (error) {
      return Err(setResolved.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setResolved.name, {
      err: err as Error,
    });
  }
}

/**
 * Fetches all comments for a given CV, joining the commenter's profile fields.
 * @param {string} cvId - The unique CV ID whose comments to fetch.
 * @param {boolean} [ascending] - Sort order by updated_at; false returns newest first.
 * @param {boolean} [filterOutDeleted] - When true, excludes soft-deleted comments.
 * @returns {Promise<Result<CommentModel[], string>>} Ok with the comment list on success, or Err on failure.
 */
export async function getAllCommentsByCVId(
  cvId: string,
  ascending: boolean = false,
  filterOutDeleted = true
): Promise<Result<CommentModel[], string>> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.cv_comments)
      .select(
        `*, ${CommentKeys.unique_profile_id} (${ProfileKeys.unique_profile_id}, ${ProfileKeys.display_name}, ${ProfileKeys.username})`
      )
      .eq(CommentKeys.unique_cv_id, cvId)
      .order(CommentKeys.updated_at, { ascending: ascending });
    if (filterOutDeleted) {
      query = query.eq(CommentKeys.deleted, false);
    }
    const { data: comments, error } = await query;
    if (error) {
      return Err(getAllCommentsByCVId.name, { postgrestError: error });
    }

    return Ok(comments);
  } catch (err) {
    return Err(getAllCommentsByCVId.name, {
      err: err as Error,
    });
  }
}

/**
 * Fetches the current upvotes array for a single comment.
 * Used internally by setLiked to read the existing likes before mutating.
 * @param {string} commentId - The unique comment ID to read upvotes for.
 * @returns {Promise<string[]>} The array of profile IDs who upvoted, or an empty array on error.
 */
async function getCommentLikes(commentId: string): Promise<string[]> {
  const { data } = await SupabaseHelper.getSupabaseInstance()
    .from(Tables.cv_comments)
    .select(CommentKeys.upvotes)
    .eq(CommentKeys.unique_cv_comment_id, commentId)
    .limit(1);
  return data && data[0].upvotes ? data[0].upvotes : [];
}

/**
 * Adds or removes a user's upvote on a comment by reading the current likes array and writing it back.
 * No-ops if the user tries to like an already-liked comment or unlike a comment they haven't liked.
 * @param {string} commentId - The unique comment ID to update.
 * @param {boolean} liked - True to add the upvote, false to remove it.
 * @param {string} userId - The profile ID of the user casting or removing the vote.
 * @returns {Promise<Result<void, string>>} Ok on success, or Err on failure.
 */
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
      .from(Tables.cv_comments)
      .update({ upvotes: likes })
      .eq(CommentKeys.unique_cv_comment_id, commentId)
      .select(CommentKeys.upvotes);

    if (error) {
      return Err(setResolved.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(setResolved.name, {
      err: err as Error,
    });
  }
}

/**
 * Fetches all comments authored by a given user across all CVs.
 * @param {string} userId - The profile ID of the comment author.
 * @param {boolean} [ascending] - Sort order by updated_at; false returns newest first.
 * @param {boolean} [filterOutDeleted] - When true, excludes soft-deleted comments.
 * @returns {Promise<Result<CommentModel[], string>>} Ok with the comment list on success, or Err on failure.
 */
export async function getAllCommentsByUserId(
  userId: string,
  ascending: boolean = false,
  filterOutDeleted = true
): Promise<Result<CommentModel[], string>> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.cv_comments)
      .select("*")
      .eq(CommentKeys.unique_profile_id, userId)
      .order(CommentKeys.updated_at, { ascending: ascending });
    if (filterOutDeleted) {
      query = query.eq(CommentKeys.deleted, false);
    }
    const { data: comments, error } = await query;
    if (error) {
      return Err(getAllCommentsByUserId.name, { postgrestError: error });
    }
    return Ok(comments);
  } catch (err) {
    return Err(getAllCommentsByUserId.name, {
      err: err as Error,
    });
  }
}

/**
 * Fetches a single comment by its unique ID.
 * @param {string} commentId - The unique comment ID to look up.
 * @returns {Promise<Result<CommentModel, string>>} Ok with the comment on success, or Err on failure.
 */
export async function getCommentById(
  commentId: string
): Promise<Result<CommentModel, string>> {
  try {
    const { data: comment, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cv_comments)
      .select("*")
      .eq(CommentKeys.unique_cv_comment_id, commentId)
      .single();
    if (error) {
      return Err(getCommentById.name, { postgrestError: error });
    }
    return Ok(comment);
  } catch (err) {
    return Err(getCommentById.name, {
      err: err as Error,
    });
  }
}
