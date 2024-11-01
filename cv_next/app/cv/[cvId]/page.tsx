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
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[70%_30%] md:gap-x-4">
        <section className="h-[78.75rem] flex-col rounded-lg">
          {cv ? <CvPreview cv={cv} /> : null}
        </section>

        <section className="h-[78.75rem] flex-col self-start rounded-lg">
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div style={{ flex: "0 0 auto" }}>
              <CommentForm cv={cv} />
            </div>
            <div
              style={{
                flex: "1 1 auto",
                overflowY: "auto",
              }}
            >
              <CommentsSection cv={cv} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
