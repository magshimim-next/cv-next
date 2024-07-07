import "server-only";

import logger from "@/server/base/logger";
import Categories from "@/types/models/categories";
import Definitions from "@/lib/definitions";
import { Tables, CvKeys } from "@/lib/supabase-definitions";
import SupabaseHelper from "./supabaseHelper";
import { PostgrestError } from "@supabase/supabase-js";
import { filterValues } from "@/types/models/filters";

export const revalidate = Definitions.CVS_REVALIDATE_TIME_IN_SECONDS;

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
      .select("*")
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
 */
export async function getCvsByUserId(
  userId: string,
  filterOutDeleted = true
): Promise<CvModel[] | null> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.cvs)
      .select("*")
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

export async function getAllCvsByCategory(
  category: Categories.category,
  filterOutDeleted: boolean = true
): Promise<CvModel[] | null> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.cvs)
      .select("*")
      .eq(CvKeys.category_id, category);

    if (filterOutDeleted) {
      query = query.eq(CvKeys.deleted, false);
    }

    const { data: cvs, error } = await query;

    if (error) {
      logger.error(error, "getAllCvsByCategory");
      return null;
    }

    return cvs as CvModel[];
  } catch (error) {
    logger.error(error, "getAllCvsByCategory");
    return null;
  }
}

async function _getAllCvsByCategories(
  categories: Categories.category[],
  filterOutDeleted: boolean = true
): Promise<any> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase
      .from(Tables.cvs)
      .select("*")
      .in(CvKeys.category_id, categories);

    if (filterOutDeleted) {
      query = query.eq(CvKeys.deleted, false);
    }

    const { data: cvs, error } = await query;

    if (error) {
      logger.error(error, "getAllCvsByCategories");
      return error;
    }
    logger.debug(cvs, "Fetched CVs: ");
    return cvs as CvModel[];
  } catch (error) {
    logger.error(error, "getAllCvsByCategories");
    return error;
  }
}

/**
 * Retrieves a paginated list of CVs based on the provided page number.
 *
 * @param {boolean} filterOutDeleted - Indicates whether deleted CVs should be filtered out.
 * @param {number} page - The page number for pagination.
 * @return {Promise<CvModel[] | null>} A Promise that resolves with an array of CvModel or null.
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
      .select("*")
      .range(from, to - 1);

    logger.debug(filters, "filters");
    if (filters) {
      if (filters.searchValue) {
        query = query.textSearch(CvKeys.description, filters.searchValue);
      }
      if (filters.categoryIds) {
        logger.debug(filters.categoryIds, "category ids");
        query = query.overlaps(CvKeys.cv_categories, filters.categoryIds);
      }
    }

    if (filterOutDeleted) {
      query = query.eq(CvKeys.deleted, false);
    }

    const { data: cvs, error } = await query;
    logger.debug(cvs?.map((cv) => cv.cv_categories, "cvs"));

    if (error) {
      logger.error(error, "getPaginatedCvs");
      return null;
    }

    return { page: page, cvs: cvs as CvModel[] };
  } catch (error) {
    logger.error(error, "getPaginatedCvs");
    return null;
  }
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
