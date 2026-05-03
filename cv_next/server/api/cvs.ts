import "server-only";

import { PostgrestError } from "@supabase/supabase-js";
import {
  Tables,
  CvKeys,
  ProfileKeys,
  Storage,
} from "@/lib/supabase-definitions";
import { FilterValues } from "@/types/models/filters";
import Definitions from "@/lib/definitions";
import logger from "@/server/base/logger";
import { Err, Ok } from "@/lib/utils";
import SupabaseHelper from "./supabaseHelper";

/**
 * Fetches a single CV by its ID, joining the author's profile fields.
 * @param {string} cvId - The unique CV ID to look up.
 * @returns {Promise<CvModel | null>} The matching CV with author profile, or null on error or no match.
 */
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

/**
 * Fetches all CVs belonging to a user, optionally including soft-deleted ones.
 * @param {string} userId - The profile ID of the CV owner.
 * @param {boolean} [filterOutDeleted] - When true, excludes CVs marked as deleted.
 * @returns {Promise<CvModel[] | null>} Array of CVs with author profile, or null on error.
 */
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

/**
 * Fetches a paginated, filtered page of CVs ordered by most recently updated.
 * Applies category overlap filtering and profile name search when provided.
 * @param {boolean} [filterOutDeleted] - When true, excludes soft-deleted CVs.
 * @param {number} [page] - Zero-based page index; defaults to PAGINATION_INIT_PAGE_NUMBER.
 * @param {FilterValues} [filters] - Optional category and search value filters.
 * @returns {Promise<PaginatedCvsModel | null>} The page number and matching CVs, or null on error.
 */
export async function getPaginatedCvs(
  filterOutDeleted: boolean = true,
  page: number = Definitions.PAGINATION_INIT_PAGE_NUMBER,
  filters?: FilterValues
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

/**
 * Fetches a randomized sample of CVs from the randomized_cvs view.
 * Uses the `rnd` column for ordering so results differ across calls.
 * @param {boolean} [filterOutDeleted] - When true, excludes soft-deleted CVs.
 * @param {number} [amount] - Maximum number of CVs to return; defaults to DEFAULT_RANDOM_CVS.
 * @param {FilterValues} [filters] - Optional category and profile exclusion filters.
 * @returns {Promise<CvModel[] | null>} Array of randomized CVs, or null on error.
 */
export async function getRandomizedCvs(
  filterOutDeleted: boolean = true,
  amount: number = Definitions.DEFAULT_RANDOM_CVS,
  filters?: FilterValues
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

/**
 * Excludes CVs whose author display name or username matches the search value.
 * Used for the randomized feed where matching profiles should be hidden, not surfaced.
 * @param {any} profileQuery - The active Supabase query builder to mutate.
 * @param {FilterValues} [filters] - Filters containing the optional search value.
 * @returns {any} The query builder with profile exclusion filters applied.
 */
function filterOutProfiles(profileQuery: any, filters?: FilterValues) {
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

/**
 * Narrows a profiles query to rows whose display name or username matches the search value (ilike).
 * The resulting profile IDs are later used to include matching CVs in the paginated feed.
 * @param {any} profileQuery - The active Supabase profiles query builder to mutate.
 * @param {FilterValues} [filters] - Filters containing the optional search value.
 * @returns {any} The query builder with the profile name filter applied.
 */
function applyProfileSearchFilter(profileQuery: any, filters?: FilterValues) {
  if (filters?.searchValue) {
    const searchValue = `%${filters.searchValue}%`;
    profileQuery = profileQuery.or(
      `${ProfileKeys.display_name}.ilike.${searchValue},${ProfileKeys.username}.ilike.${searchValue}`
    );
  }
  return profileQuery;
}

/**
 * Adds an array-overlap filter on cv_categories when category IDs are provided.
 * @param {any} query - The active Supabase CVs query builder to mutate.
 * @param {FilterValues} [filters] - Filters containing the optional category ID list.
 * @returns {any} The query builder with the category filter applied, or unchanged if no categories.
 */
function applyCategoryFilter(query: any, filters?: FilterValues) {
  if (filters?.categoryIds?.length) {
    logger.debug(filters.categoryIds, "category ids");
    query = query.overlaps(CvKeys.cv_categories, filters.categoryIds);
  }
  return query;
}

/**
 * Extends a CVs query to include results matching either the CV description or the
 * profile IDs returned by a pre-built profile search query.
 * Executes the profile query internally and joins the results into the CV filter.
 * @param {any} query - The active Supabase CVs query builder to mutate.
 * @param {any} profileQuery - A Supabase profiles query already filtered by search value.
 * @param {FilterValues} [filters] - Filters containing the optional search value.
 * @returns {Promise<any>} The CV query builder extended with the combined OR filter.
 */
async function applyProfileSearchToCvs(
  query: any,
  profileQuery: any,
  filters?: FilterValues
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

/**
 * Updates all fields of an existing CV row matched by its unique_cv_id.
 * @param {CvModel} cv - The CV object with updated fields; must include unique_cv_id.
 * @returns {Promise<PostgrestError | CvModel>} The updated CV on success, or the PostgREST error on failure.
 */
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

/**
 * Inserts a new CV row into the cvs table and returns the created record.
 * @param {NewCvModel} cv - The new CV data to insert.
 * @returns {Promise<CvModel | null>} The created CV on success, or null on error.
 */
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

/**
 * Soft-deletes a CV by setting its deleted flag to true. The row is retained in the database.
 * @param {string} cvId - The unique CV ID to mark as deleted.
 * @returns {Promise<Result<void, string>>} Ok on success, or Err with a message on failure.
 */
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

/**
 * Generates a short-lived signed URL for previewing a CV file from Supabase Storage.
 * The URL expiration is controlled by CV_PREVIEW_EXPIRATION_TIME in Definitions.
 * @param {string} fileName - The storage path of the CV file.
 * @returns {Promise<Result<string, string>>} Ok with the signed URL on success, or Err on failure.
 */
export async function getCVSignedPreview(
  fileName: string
): Promise<Result<string, string>> {
  const { data: previewUrl, error } = await SupabaseHelper.getSupabaseInstance()
    .storage.from(Storage.cvs)
    .createSignedUrl(fileName, Definitions.CV_PREVIEW_EXPIRATION_TIME);
  const signedUrl = previewUrl?.signedUrl;

  if (!error && signedUrl) return Ok(signedUrl);
  return Err(getCVSignedPreview.name, {
    err: error as Error,
  });
}
