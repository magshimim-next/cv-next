import "server-only";

import { PostgrestError } from "@supabase/supabase-js";
import { Tables, CvKeys, ProfileKeys } from "@/lib/supabase-definitions";
import { filterValues } from "@/types/models/filters";
import Definitions from "@/lib/definitions";
import logger from "@/server/base/logger";
import SupabaseHelper from "./supabaseHelper";

/**
 * Retrieves a CV by its ID from the database.
 *
 * @param {string} cvId - The ID of the CV to retrieve
 * @return {Promise<CvModel | null>} The retrieved CV or null if not found
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
 *
 * @param {string} userId - The user ID
 * @param {boolean} filterOutDeleted - Whether to filter out deleted CVs (default true)
 * @return {Promise<CvModel[] | null>} The retrieved CVs or null if an error occurs
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
 *
 * @param {boolean} filterOutDeleted - Indicates whether deleted CVs should be filtered out.
 * @param {number} page - The page number for pagination.
 * @return {Promise<CvModel[] | null>} A Promise that resolves with an array of CvModel or null.
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
 *
 * @param {CvModel} cv - the CV to be updated
 * @return {Promise<PostgrestError | null>} the error, if any, or null if the update was successful
 */
export async function updateCV(cv: CvModel): Promise<PostgrestError | null> {
  try {
    const { error } = await SupabaseHelper.getSupabaseInstance()
      .from(Tables.cvs)
      .update(cv)
      .eq(CvKeys.id, cv.id);
    if (error) {
      logger.error(error, "cvs::updateCV");
      return error;
    }
    return null;
  } catch (error) {
    logger.error(error, "cvs::updateCV");
    //TODO: handle error
    return null;
  }
}

/**
 * Uploads a CV to the database.
 *
 * @param {NewCvModel} cv - the CV to upload
 * @return {Promise<null | CvModel>} null on error, the uploaded object if upload was successful
 */
export async function uploadCV(cv: NewCvModel): Promise<null | CvModel> {
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
