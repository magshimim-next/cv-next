"use server";

import { getCvById } from "@/server/api/cvs";

export const getCvsFromComments = async (
  comments: CommentModel[]
): Promise<CvModel[]> => {
  const uniqueCvs: Set<CvModel> = new Set(); // Use a Set to store unique documents
  const uniqueCvsFromComments: Set<string> = new Set();

  // Get unique cv ids
  for (const comment of comments) {
    if (comment.document_id !== undefined) {
      uniqueCvsFromComments.add(comment.document_id);
    }
  }

  // Get cvs set
  for (const cvId of uniqueCvsFromComments) {
    const cv = await getCvById(cvId);
    if (cv) {
      uniqueCvs.add(cv); // Add the document to the Set
    }
  }

  return Array.from(uniqueCvs); // Convert Set to array and return
};
