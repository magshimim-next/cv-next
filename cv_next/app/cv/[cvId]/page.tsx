"use server";

import { notFound } from "next/navigation";
import { getCvById } from "@/server/api/cvs";
import { decodeValue } from "@/lib/utils";
import { ScrollToTop } from "@/components/ui/scrollToTop";
import { CvPreview } from "@/components/ui/cvPreview";
import CommentsSection from "./components/commentSection/commentsSection";
import CommentForm from "./components/commentSection/commentForm";
import CvData from "./components/cvData";

export default async function Page({ params }: { params: { cvId: string } }) {
  const { cvId } = params;

  const decodedCvId = decodeValue(decodeURIComponent(cvId));
  if (!decodedCvId) {
    notFound();
  }
  const cv = await getCvById(decodedCvId);

  if (cv === null) {
    notFound();
  }
  return (
    <div>
      <ScrollToTop />
      <CvData cv={cv} />
      <div className="grid grid-cols-1 grid-rows-[30%_70%] gap-y-4 md:grid-cols-[70%_30%]  md:gap-x-4">
        <section className="h-[78.75rem] flex-col rounded-lg">
          {cv ? <CvPreview cv={cv} /> : null}
        </section>
        <div className="flex">
          <section className="flex h-[85vh] max-h-[85vh] w-[50vh] flex-col self-start overflow-y-auto overflow-x-hidden">
            <CommentForm cv={cv} />
            <div className="flex h-[85vh] max-h-[85vh] w-[100%] flex-col self-start overflow-y-auto overflow-x-hidden">
              <CommentsSection cv={cv} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
