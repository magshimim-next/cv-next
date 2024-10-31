"use server";

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
