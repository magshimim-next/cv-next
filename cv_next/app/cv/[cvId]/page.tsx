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

export async function generateMetadata({
  params,
}: {
  params: { cvId: string };
}): Promise<Metadata> {
  const { cvId } = params;
  const decodedCvId = decodeValue(decodeURIComponent(cvId));
  if (!decodedCvId) {
    notFound();
  }
  const cv = await getCvById(decodedCvId);

  if (cv === null) {
    notFound();
  }

  const authorData = JSON.parse(JSON.stringify(cv.user_id));

  return {
    title: "CV of " + authorData.display_name,
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
  const fullCV = validCV ? "lg:grid-cols-[60%_40%]" : "";
  const userId = await getCurrentId();
  if (!userId.ok) {
    notFound();
  }
  const authorData = JSON.parse(JSON.stringify(cv.user_id));

  return (
    <div>
      <ScrollToTop />
      <div className={`grid grid-cols-1 gap-y-4 ${fullCV} lg:gap-x-4`}>
        <div className="block lg:hidden">
          <CvData
            cv={cv}
            validCV={validCV}
            currentUserIsAuthor={userId.val == authorData.id}
          />
        </div>
        <section className=" flex-col rounded-lg">
          {cv ? <CvPreview cv={cv} height={validCV ? 1300 : 400} /> : null}
        </section>
        {validCV && (
          <div className="flex flex-col">
            <div className="hidden lg:block">
              <CvData
                cv={cv}
                validCV={validCV}
                currentUserIsAuthor={userId.val == authorData.id}
              />
            </div>
            <section className="flex h-[85vh] max-h-[85vh] w-[100%] flex-col self-start overflow-y-auto overflow-x-hidden">
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
