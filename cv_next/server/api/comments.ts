import "server-only";

import { Ok, Err } from "@/lib/utils";
import { Tables, CommentKeys, ProfileKeys } from "@/lib/supabase-definitions";
import SupabaseHelper from "./supabaseHelper";

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

async function getCommentLikes(commentId: string): Promise<string[]> {
  const { data } = await SupabaseHelper.getSupabaseInstance()
    .from(Tables.cv_comments)
    .select(CommentKeys.upvotes)
    .eq(CommentKeys.unique_cv_comment_id, commentId)
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
