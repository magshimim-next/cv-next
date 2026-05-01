import "server-only";

import { PostgrestError } from "@supabase/supabase-js";
import {
  Tables,
  CvKeys,
  ProfileKeys,
  Storage,
} from "@/lib/supabase-definitions";
import { filterValues } from "@/types/models/filters";
import Definitions from "@/lib/definitions";
import logger from "@/server/base/logger";
import { Err, Ok } from "@/lib/utils";
import SupabaseHelper from "./supabaseHelper";

export async function getCvById(cvId: string): Promise<CvModel | null> {
  try {
    const { data: cvs, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cvs)
      .select(
        `*, ${CvKeys.unique_profile_id} (${ProfileKeys.unique_profile_id}, ${ProfileKeys.display_name}, ${ProfileKeys.username}, ${ProfileKeys.avatar_url})`
      )
      .eq(CvKeys.unique_cv_id, cvId);

    if (error) {
      logger.error(error, "cvs::getCvById");
      return null;
    }

    if (!cvs || cvs.length !== 1) {
      throw new Error(
        "Expected only one match for query; cvs found: " +
          (cvs ? cvs.length : 0)
      );
    }

    return cvs[0] as CvModel;
  } catch (error) {
    logger.error(error, "cvs::getCvById");
    return null;
  }
}

export async function getCvsByUserId(
  userId: string,
  filterOutDeleted = true
): Promise<CvModel[] | null> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.cvs)
      .select(
        `*, ${CvKeys.unique_profile_id} (${ProfileKeys.unique_profile_id}, ${ProfileKeys.display_name}, ${ProfileKeys.username})`
      )
      .eq(CvKeys.unique_profile_id, userId);

    if (filterOutDeleted) {
      query = query.eq(CvKeys.deleted, false);
    }

    const { data: cvs, error } = await query;

    if (error) {
      logger.error(error, "getCvsByUserId");
      return null;
    }

    return cvs as CvModel[];
  } catch (error) {
    logger.error(error, "getCvsByUserId");
    return null;
  }
}

export async function getPaginatedCvs(
  filterOutDeleted: boolean = true,
  page: number = Definitions.PAGINATION_INIT_PAGE_NUMBER,
  filters?: filterValues
): Promise<PaginatedCvsModel | null> {
  try {
    const from = page * Definitions.CVS_PER_PAGE;
    const to = page
      ? from + Definitions.CVS_PER_PAGE
      : Definitions.CVS_PER_PAGE;

    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.cvs)
      .select(
        `*, ${CvKeys.unique_profile_id} (${ProfileKeys.unique_profile_id}, ${ProfileKeys.display_name}, ${ProfileKeys.username})`
      )
      .order(CvKeys.updated_at, { ascending: false })
      .eq(CvKeys.deleted, !filterOutDeleted)
      .range(from, to - 1);
    let profileQuery = supabase
      .from(Tables.profiles)
      .select(ProfileKeys.unique_profile_id);

    logger.debug(filters, "filters");

    profileQuery = applyProfileSearchFilter(profileQuery, filters);
    query = applyCategoryFilter(query, filters);
    query = await applyProfileSearchToCvs(query, profileQuery, filters);

    const { data: cvs, error } = await query;
    logger.debug(
      cvs?.map((cv) => cv.cv_categories),
      "cvs"
    );

    if (error) {
      logger.error(error, "getPaginatedCvs");
      return null;
    }

    return { page, cvs: cvs as CvModel[] };
  } catch (error) {
    logger.error(error, "getPaginatedCvs");
    return null;
  }
}

export async function getRandomizedCvs(
  filterOutDeleted: boolean = true,
  amount: number = Definitions.DEFAULT_RANDOM_CVS,
  filters?: filterValues
): Promise<CvModel[] | null> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.randomized_cvs)
      .select(
        `*, ${CvKeys.unique_profile_id} (${ProfileKeys.unique_profile_id}, ${ProfileKeys.display_name}, ${ProfileKeys.username})`
      )
      .eq(CvKeys.deleted, !filterOutDeleted)
      .order("rnd")
      .limit(amount + 1);
    logger.debug(filters, "filters");

    query = applyCategoryFilter(query, filters);
    query = filterOutProfiles(query, filters);

    const { data: cvs, error } = await query;
    logger.debug(
      (cvs as any[])?.map((cv) => cv.cv_categories),
      "randomized cvs"
    );

    if (error) {
      logger.error(error, "getRandomizedCvs");
      return null;
    }

    return cvs as unknown as CvModel[];
  } catch (error) {
    logger.error(error, "getRandomizedCvs");
    return null;
  }
}

function filterOutProfiles(profileQuery: any, filters?: filterValues) {
  if (filters?.searchValue) {
    const searchValue = `${filters.searchValue}`;

    profileQuery = profileQuery
      .not(
        `${CvKeys.unique_profile_id}.${ProfileKeys.display_name}`,
        "ilike",
        searchValue
      )
      .not(
        `${CvKeys.unique_profile_id}.${ProfileKeys.username}`,
        "ilike",
        searchValue
      );
  }

  return profileQuery;
}

function applyProfileSearchFilter(profileQuery: any, filters?: filterValues) {
  if (filters?.searchValue) {
    const searchValue = `%${filters.searchValue}%`;
    profileQuery = profileQuery.or(
      `${ProfileKeys.display_name}.ilike.${searchValue},${ProfileKeys.username}.ilike.${searchValue}`
    );
  }
  return profileQuery;
}

function applyCategoryFilter(query: any, filters?: filterValues) {
  if (filters?.categoryIds?.length) {
    logger.debug(filters.categoryIds, "category ids");
    query = query.overlaps(CvKeys.cv_categories, filters.categoryIds);
  }
  return query;
}

async function applyProfileSearchToCvs(
  query: any,
  profileQuery: any,
  filters?: filterValues
) {
  if (filters?.searchValue) {
    const { data: profiles, error: profileError } = await profileQuery;
    if (profileError) {
      logger.error(profileError, "getPaginatedCvs - profileQuery");
      return query;
    }

    const profileIds =
      profiles?.map((profile: UserModel) => profile.unique_profile_id) || [];
    const searchValue = `%${filters.searchValue}%`;
    query = query.or(
      `${CvKeys.description}.ilike.${searchValue},${CvKeys.unique_profile_id}.in.(${profileIds.join(",")})`
    );
  }
  return query;
}

export async function updateGivenCV(
  cv: CvModel
): Promise<PostgrestError | CvModel> {
  try {
    const { data, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cvs)
      .update(cv)
      .eq(CvKeys.unique_cv_id, cv.unique_cv_id)
      .select();

    if (error || data.length === 0) {
      logger.error(error, "cvs::updateCV");
      return error as PostgrestError;
    }
    return data[0] as CvModel;
  } catch (error) {
    logger.error(error, "cvs::updateCV");
    return error as PostgrestError;
  }
}

export async function uploadNewCV(cv: NewCvModel): Promise<null | CvModel> {
  const { data, error } = await SupabaseHelper.getSupabaseInstance()
    .from("cvs")
    .insert(cv)
    .select();
  if (error) {
    logger.error(error, "Error @ cvs::uploadCV");
    return null;
  }
  return data[0];
}

export async function markCVAsDeleted(
  cvId: string
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cvs)
      .update({ deleted: true })
      .eq(CvKeys.unique_cv_id, cvId);
    if (error) {
      return Err(markCVAsDeleted.name, { postgrestError: error });
    }
    return Ok.EMPTY;
  } catch (err) {
    return Err(markCVAsDeleted.name, {
      err: err as Error,
    });
  }
}

export async function getCVSignedPreview(
  fileName: string
): Promise<Result<string, string>> {
  const { data: previewUrl, error } =
    await SupabaseHelper.getSupabaseInstance()
      .storage.from(Storage.cvs)
      .createSignedUrl(fileName, Definitions.CV_PREVIEW_EXPIRATION_TIME);
  const signedUrl = previewUrl?.signedUrl;

  if (!error && signedUrl) return Ok(signedUrl);
  return Err(getCVSignedPreview.name, {
    err: error as Error,
  });
}
