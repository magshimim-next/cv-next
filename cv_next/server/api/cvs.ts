import "server-only";

import { PostgrestError } from "@supabase/supabase-js";
import { Tables, CvKeys, ProfileKeys } from "@/lib/supabase-definitions";
import { filterValues } from "@/types/models/filters";
import Definitions from "@/lib/definitions";
import logger from "@/server/base/logger";
import { Err, Ok } from "@/lib/utils";
import SupabaseHelper from "./supabaseHelper";

/**
 * Retrieves a CV by its ID from the database.
 * @param {string} cvId - The ID of the CV to retrieve
 * @returns {Promise<CvModel | null>} The retrieved CV or null if not found
 */
export async function getCvById(cvId: string): Promise<CvModel | null> {
  try {
    const { data: cvs, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cvs)
      .select(
        `*, ${CvKeys.user_id} (${ProfileKeys.id}, ${ProfileKeys.display_name}, ${ProfileKeys.username}, ${ProfileKeys.avatar_url})`
      )
      .eq(CvKeys.id, cvId);

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
 * Retrieves CVs by user ID.
 * @param {string} userId - The user ID
 * @param {boolean} filterOutDeleted - Whether to filter out deleted CVs (default true)
 * @returns {Promise<CvModel[] | null>} The retrieved CVs or null if an error occurs
 * The user_id of the retrieved CVs is a json of the user_id, display_name of that user and it's username
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
        `*, ${CvKeys.user_id} (${ProfileKeys.id}, ${ProfileKeys.display_name}, ${ProfileKeys.username})`
      )
      .eq(CvKeys.user_id, userId);

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
 * Retrieves a paginated list of CVs based on the provided page number.
 * @param {boolean} filterOutDeleted - Indicates whether deleted CVs should be filtered out.
 * @param {number} page - The page number for pagination.
 * @param {filterValues} filters - The filters apply to CV search.
 * @returns {Promise<CvModel[] | null>} A Promise that resolves with an array of CvModel or null.
 * The user_id of the retrieved CVs is a json of the user_id, display_name of that user and it's username
 */
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
        `*, ${CvKeys.user_id} (${ProfileKeys.id}, ${ProfileKeys.display_name}, ${ProfileKeys.username})`
      )
      .order(CvKeys.created_at, { ascending: false })
      .eq(CvKeys.deleted, !filterOutDeleted)
      .range(from, to - 1);
    let profileQuery = supabase.from(Tables.profiles).select(ProfileKeys.id);

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
 * The function applys a search filter that is based on profiles.
 * @param {any} profileQuery - The existing profiles query that will be modified.
 * @param {filterValues} filters - The existing filter that will be applied.
 * @returns {any} The query with the profiles filter applied.
 */
function applyProfileSearchFilter(profileQuery: any, filters?: filterValues) {
  if (filters?.searchValue) {
    const searchValue = `%${filters.searchValue}%`;
    profileQuery = profileQuery.or(
      `${ProfileKeys.display_name}.ilike.${searchValue},${ProfileKeys.username}.ilike.${searchValue}`
    );
  }
  return profileQuery;
}

/**
 * The function applys a search filter that is based on categories.
 * @param {any} query - The existing query query that will be modified.
 * @param {filterValues} filters - The existing filter that will be applied.
 * @returns {any} The query with the categories filter applied.
 */
function applyCategoryFilter(query: any, filters?: filterValues) {
  if (filters?.categoryIds?.length) {
    logger.debug(filters.categoryIds, "category ids");
    query = query.overlaps(CvKeys.cv_categories, filters.categoryIds);
  }
  return query;
}

/**
 * The function applies the profile filter to CV general filter.
 * @param {any} query The general CVs query.
 * @param {any} profileQuery The profiles query to apply.
 * @param {filterValues} filters The current filters that are applied to the search.
 * @returns {Promise<any>} The query with the profiles search.
 */
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

    const profileIds = profiles?.map((profile: UserModel) => profile.id) || [];
    const searchValue = `%${filters.searchValue}%`;
    query = query.or(
      `${CvKeys.description}.ilike.${searchValue},${CvKeys.user_id}.in.(${profileIds.join(",")})`
    );
  }
  return query;
}

/**
 * Updates a CV in the database.
 * @param {CvModel} cv - the CV to be updated
 * @returns {Promise<PostgrestError | CvModel>} the error, if any, or the updated data if the update was successful
 */
export async function updateGivenCV(
  cv: CvModel
): Promise<PostgrestError | CvModel> {
  try {
    const { data, error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cvs)
      .update(cv)
      .eq(CvKeys.id, cv.id)
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
 * Uploads a CV to the database.
 * @param {NewCvModel} cv - the CV to upload
 * @returns {Promise<null | CvModel>} null on error, the uploaded object if upload was successful
 */
export async function uploadNewCV(cv: NewCvModel): Promise<null | CvModel> {
  const { data, error } = await SupabaseHelper.getSupabaseInstance()
    .from("cvs")
    .insert(cv)
    .select();
  if (error) {
    logger.error("Error @ cvs::uploadCV", error);
    return null;
  }
  return data[0];
}

/**
 * Marks a comment as deleted.
 * @param {string} cvId - The ID of the CV to be marked as deleted.
 * @returns {Promise<Result<void, string>>} A promise that resolves to a Result object indicating the success or failure of the operation.
 */
export async function markCVAsDeleted(
  cvId: string
): Promise<Result<void, string>> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cvs)
      .update({ deleted: true })
      .eq(CvKeys.id, cvId);
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
