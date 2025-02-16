"use server";

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCvById } from "@/server/api/cvs";
import { decodeValue } from "@/lib/utils";
import { ScrollToTop } from "@/components/ui/scrollToTop";
import { CvPreview } from "@/components/ui/cvPreview";
import { getCurrentId } from "@/server/api/users";
import CommentsSection from "./components/commentSection/commentsSection";
import CommentForm from "./components/commentSection/commentForm";
import CvData from "./components/cvData";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "CV Page",
  };
}

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

  const resp = await fetch(cv.document_link, {
    redirect: "manual",
  });
  const validCV = resp.status === 200;
  const fullCV = validCV ? "md:grid-cols-[70%_30%]" : "";
  const userId = await getCurrentId();
  if (!userId.ok) {
    notFound();
  }
  const authorData = JSON.parse(JSON.stringify(cv.user_id));

  return (
    <div>
      <ScrollToTop />
      <CvData
        cv={cv}
        validCV={validCV}
        currentUserIsAuthor={userId.val == authorData.id}
      />
      <div className={`grid grid-cols-1 gap-y-4 ${fullCV} md:gap-x-4`}>
        <section className=" flex-col rounded-lg">
          {cv ? <CvPreview cv={cv} height={validCV ? 800 : 400} /> : null}
        </section>
        {validCV && (
          <div className="flex">
            <section className="flex h-[85vh] max-h-[85vh] w-[50vh] flex-col self-start overflow-y-auto overflow-x-hidden">
              <CommentForm cv={cv} />
              <div className="flex h-[85vh] max-h-[85vh] w-[100%] flex-col self-start overflow-y-auto overflow-x-hidden">
                <CommentsSection cv={cv} />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
