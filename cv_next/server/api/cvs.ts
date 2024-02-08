import "server-only"

import MyLogger from "@/server/base/logger"
import Categories from "@/types/models/categories"
import Definitions from "../../lib/definitions"
import SupabaseHelper from "./supabaseHelper"
import { PostgrestError } from "@supabase/supabase-js"

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
      .eq("id", cvId)

    if (error) {
      MyLogger.logInfo("Error @ cvs::getCvById", error)
      return null
    }

    if (!cvs || cvs.length !== 1) {
      throw new Error(
        "Expected only one match for query; cvs found: " +
          (cvs ? cvs.length : 0)
      )
    }

    return cvs[0] as CvModel
  } catch (error) {
    MyLogger.logInfo("Error @ cvs::getCvById", error)
    return null
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
    const supabase = SupabaseHelper.getSupabaseInstance()
    let query = supabase.from("cvs").select("*").eq("user_id", userId)

    if (filterOutDeleted) {
      query = query.eq("deleted", false)
    }

    const { data: cvs, error } = await query

    if (error) {
      MyLogger.logInfo("Error @ getCvsByUserId", error)
      return null
    }

    return cvs as CvModel[]
  } catch (error) {
    MyLogger.logInfo("Error @ getCvsByUserId", error)
    return null
  }
}

export async function getAllCvsByCategory(
  category: Categories.category,
  filterOutDeleted: boolean = true
): Promise<CvModel[] | null> {
  try {
    const supabase = SupabaseHelper.getSupabaseInstance()
    let query = supabase.from("cvs").select("*").eq("category_id", category)

    if (filterOutDeleted) {
      query = query.eq("deleted", false)
    }

    const { data: cvs, error } = await query

    if (error) {
      MyLogger.logInfo("Error @ getAllCvsByCategory", error)
      return null
    }

    return cvs as CvModel[]
  } catch (error) {
    MyLogger.logInfo("Error @ getAllCvsByCategory", error)
    return null
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
  page: number = Definitions.DEFAULT_PAGINATION_FIRST_PAGE_NUMBER
): Promise<PaginatedCvsModel | null> {
  try {
    const from = page * Definitions.CVS_PER_PAGE
    const to = page ? from + Definitions.CVS_PER_PAGE : Definitions.CVS_PER_PAGE

    const supabase = SupabaseHelper.getSupabaseInstance()
    let query = supabase
      .from("cvs")
      .select("*")
      .range(from, to - 1)

    if (filterOutDeleted) {
      query = query.eq("deleted", false)
    }

    const { data: cvs, error } = await query

    if (error) {
      MyLogger.logInfo("Error @ getPaginatedCvs", error)
      return null
    }

    return { page: page, cvs: cvs as CvModel[] }
  } catch (error) {
    MyLogger.logInfo("Error @ getPaginatedCvs", error)
    return null
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
      .eq("id", cv.id)
    if (error) {
      MyLogger.logInfo("Error @ cvs::updateCV", error)
      return error
    }
    return null
  } catch (error) {
    MyLogger.logInfo("Error @ cvs::updateCV", error)
    //TODO: handle error
    return null
  }
}
