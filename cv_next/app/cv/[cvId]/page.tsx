"use server";

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCvById, getRandomizedCvs } from "@/server/api/cvs";
import { decodeValue } from "@/lib/utils";
import { ScrollToTop } from "@/components/ui/scrollToTop";
import { CvPreview } from "@/components/ui/cvPreview";
import { getCurrentId, userIsAdmin } from "@/server/api/users";
import CarouselStructure from "@/components/ui/Carousel/carouselStructure";
import { CVClickableCard } from "@/components/ui/CVComponents/cvClickableCard";
import CommentsSection from "./components/commentSection/commentsSection";
import CommentForm from "./components/commentSection/commentForm";
import CvData from "./components/cvData";

/**
 *
 * @param root0
 * @param root0.params
 * @param root0.params.cvId
 */
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

/**
 *
 * @param root0
 * @param root0.params
 * @param root0.params.cvId
 */
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
  const resultAdminCheck = await userIsAdmin();

  const recommendedRaw = await getRandomizedCvs(true, 5, {
    searchValue: "",
    categoryIds: cv.cv_categories,
  });
  let recommendedCVs = (recommendedRaw || []).filter(
    (rec: CvModel) => rec.id !== cv.id
  );
  if (recommendedCVs.length >= 5) {
    recommendedCVs = recommendedCVs.slice(0, 5);
  }

  return (
    <div>
      <ScrollToTop />
      <CvData
        cv={cv}
        validCV={validCV}
        canEditCv={userId.val == authorData.id || resultAdminCheck.ok}
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
                <CommentsSection
                  cv={cv}
                  userIsAdmin={resultAdminCheck.ok}
                  userIsAuthor={userId.val == authorData.id}
                />
              </div>
            </section>
          </div>
        )}
      </div>

      {recommendedCVs.length > 0 && (
        <div className="bg-gradient mt-8 rounded-xl py-8">
          <h2 className="mb-4 text-center text-3xl font-bold">Similar CVs</h2>
          <h3 className="mb-4 text-center text-base font-bold text-gray-700 dark:text-gray-300">
            {`Based on the categories of ${authorData.display_name}'s CV`}
          </h3>
          <CarouselStructure options={{ loop: true }}>
            {recommendedCVs.map((recCv: CvModel) => (
              <div className="p-4" key={recCv.id}>
                <CVClickableCard cv={recCv} />
              </div>
            ))}
          </CarouselStructure>
        </div>
      )}
    </div>
  );
}
