"use server";

import CarouselStructure from "@/components/ui/Carousel/carouselStructure";
import { CVClickableCard } from "@/components/ui/CVComponents/cvClickableCard";
import Definitions from "@/lib/definitions";
import { getRandomizedCvs } from "@/server/api/cvs";

/**
 * This component fetchs and displays recommended CVs based on the current CV and or current user ID.
 * @param {filteredCategories} param0 The categories to filter for.
 * @param {currentUserId} param0 The current user ID to exclude their CVs.
 * @param {currentCvId} param0 The current CV ID to exclude it.
 * @param {amountToRecommend} param0 The amount of CVs to recommend.
 * @returns {JSX.Element} The recommended section.
 */
export async function RecommendedCvsSection({
  filteredCategories,
  currentUserId,
  currentCvId,
  amountToRecommend = Definitions.DEFAULT_RANDOM_CVS,
}: {
  filteredCategories: number[];
  amountToRecommend?: number;
  currentCvId?: string;
  currentUserId?: string;
}) {
  const recommendedRaw = await getRandomizedCvs(true, amountToRecommend, {
    searchValue: "",
    categoryIds: filteredCategories,
  });

  let recommendedCVs: CvModel[] = [];
  if (currentUserId) {
    recommendedCVs = (recommendedRaw || []).filter((rec: CvModel) => {
      let authorId: string | undefined;
      if (typeof rec.user_id === "object" && rec.user_id !== null) {
        authorId = (rec.user_id as { id?: string }).id;
      } else {
        authorId = String(rec.user_id);
      }
      return authorId !== currentUserId;
    });
    if (recommendedCVs.length >= 5) {
      recommendedCVs = recommendedCVs.slice(0, 5);
    }
  } else if (currentCvId) {
    recommendedCVs = (recommendedRaw || []).filter(
      (rec: CvModel) => rec.id !== currentCvId
    );
    if (recommendedCVs.length >= 5) {
      recommendedCVs = recommendedCVs.slice(0, 5);
    }
  } else {
    return <></>;
  }

  return (
    <>
      {recommendedCVs.length > 0 && (
        <div className="bg-gradient mt-8 rounded-xl py-8">
          <h2 className="mb-4 text-center text-3xl font-bold">Relevant CVs</h2>
          <h3 className="mb-4 text-center text-base font-bold text-gray-700 dark:text-gray-300">
            {`Based on the categories of this page`}
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
    </>
  );
}
