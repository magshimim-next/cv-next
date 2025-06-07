"use server";

import { Err, Ok } from "@/lib/utils";
import { getCvById } from "@/server/api/cvs";

export const getCvsFromComments = async (
  comments: CommentModel[]
): Promise<CvModel[]> => {
  const uniqueCvs: Set<CvModel> = new Set();
  const uniqueCvsFromComments: Set<string> = new Set();

  for (const comment of comments) {
    if (comment.document_id !== undefined) {
      uniqueCvsFromComments.add(comment.document_id);
    }
  }

  for (const cvId of uniqueCvsFromComments) {
    const cv = await getCvById(cvId);
    if (cv) {
      uniqueCvs.add(cv);
    }
  }

  return Array.from(uniqueCvs);
};

/**
 * Retrieves CV data by CV ID.
 *
 * @param {string} cvId - The ID of the CV to retrieve
 * @return {Promise<Result<CvModel, string>>} A promise that resolves to a Result containing the CV data or an error message
 */
export const getCvModel = async (
  cvId: string
): Promise<Result<CvModel, string>> => {
  const cv = await getCvById(cvId);

  if (cv === null) {
    return Err("Couldn't get the requested CV");
  }
  return Ok(cv);
};
