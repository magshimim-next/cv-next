import "server-only";

import MyLogger from "@/server/base/logger";
import Categories from "@/types/models/categories";
import Definitions from "../../lib/definitions";
import SupabaseHelper from "./supabaseHelper";
import { PostgrestError, } from "@supabase/supabase-js";
import { filterValues } from "@/app/feed/components/filterPanel";

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
      .from("cvs")
      .select("*")
      .eq("id", cvId);

    if (error) {
      MyLogger.logInfo("Error @ cvs::getCvById", error);
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
    MyLogger.logInfo("Error @ cvs::getCvById", error);
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
    let query = supabase.from("cvs").select("*").eq("user_id", userId);

    if (filterOutDeleted) {
      query = query.eq("deleted", false);
    }

    const { data: cvs, error } = await query;

    if (error) {
      MyLogger.logInfo("Error @ getCvsByUserId", error);
      return null;
    }

    return cvs as CvModel[];
  } catch (error) {
    MyLogger.logInfo("Error @ getCvsByUserId", error);
    return null;
  }
}

export async function getAllCvsByCategory(
  category: Categories.category,
  filterOutDeleted: boolean = true
): Promise<CvModel[] | null> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase.from("cvs").select("*").eq("category_id", category);

    if (filterOutDeleted) {
      query = query.eq("deleted", false);
    }

    const { data: cvs, error } = await query;

    if (error) {
      MyLogger.logInfo("Error @ getAllCvsByCategory", error);
      return null;
    }

    return cvs as CvModel[];
  } catch (error) {
    MyLogger.logInfo("Error @ getAllCvsByCategory", error);
    return null;
  }
}

async function _getAllCvsByCategories(
  categories: Categories.category[],
  filterOutDeleted: boolean = true
): Promise<any> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance();
    let query = supabase.from("cvs").select("*").in("category_id", categories);

    if (filterOutDeleted) {
      query = query.eq("deleted", false);
    }

    const { data: cvs, error } = await query;

    if (error) {
      MyLogger.logInfo("Error @ getAllCvsByCategories", error);
      return error;
    }
    MyLogger.logDebug("Fetched CVs: ", cvs);
    return cvs as CvModel[];
  } catch (error) {
    MyLogger.logInfo("Error @ getAllCvsByCategories", error);
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
      .from("cvs")
      .select("*");
    let queryUserId = supabase
      .from("profiles")
      .select("*");
    let checkNames = false;
    let ids = null;
    MyLogger.logDebug("filters", filters);
    if (filters) {
      if (filters.searchValue) {
        query = query.textSearch("description", filters.searchValue);
        queryUserId = queryUserId.textSearch("full_name", filters.searchValue);
        checkNames = true;
      }
      if (filters.categoryId) {
        MyLogger.logDebug("catagory id:", filters.categoryId);
        query = query.eq("category_id", filters.categoryId);
      }
    }

    if (filterOutDeleted) {
      query = query.eq("deleted", false);
    }
    if(checkNames){
      ids = await queryUserId;
    }
    
    const { data: cvs, error } = await query;
    MyLogger.logDebug(
      "cvs:",
      cvs?.map((cv) => cv.category_id)
    );

    if (error) {
      MyLogger.logInfo("Error @ getPaginatedCvs", error);
      return null;
    }
    if(ids && ids['data'].length > 0){
      let cvsId = await getCvsByUserId(ids['data'][0]['id']);
      if(cvsId){
        MyLogger.logDebug(
          "ids:",
          cvsId
        );
        let ret_tmp = cvs.concat(cvsId);
        let ret = [...ret_tmp.reduce((map, obj) => map.set(obj.id, obj), new Map()).values()].slice(from, to);

        return {page: page, cvs: ret as CvModel[]};
      }
      
    }
    return { page: page, cvs: cvs.slice(from, to) as CvModel[] };
  } catch (error) {
    MyLogger.logInfo("Error @ getPaginatedCvs", error);
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
      .from("cvs")
      .update(cv)
      .eq("id", cv.id);
    if (error) {
      MyLogger.logInfo("Error @ cvs::updateCV", error);
      return error;
    }
    return null;
  } catch (error) {
    MyLogger.logInfo("Error @ cvs::updateCV", error);
    //TODO: handle error
    return null;
  }
}
