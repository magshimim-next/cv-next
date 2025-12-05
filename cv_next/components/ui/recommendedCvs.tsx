"use server";

import CarouselStructure from "@/components/ui/Carousel/carouselStructure";
import { CVClickableCard } from "@/components/ui/CVComponents/cvClickableCard";
import Definitions from "@/lib/definitions";
import { getRandomizedCvs } from "@/server/api/cvs";

/**
 * This component fetchs and displays recommended CVs based on the current CV and or current user ID.
 * @param {object} param0 The component props.
 * @param {number[]} param0.filteredCategories The categories to filter for.
 * @param {string} param0.currentUsername The viewd username to exclude their CVs.
 * @param {string} param0.currentCvId The current CV ID to exclude it.
 * @param {number} param0.amountToFetch The amount of CVs to attempt and get from the DB.
 * @param {number} param0.amountToRecommend The amount of CVs to actually show and recommend.
 * @returns {JSX.Element} The recommended section.
 */
export async function RecommendedCvsSection({
  filteredCategories,
  currentUsername,
  currentCvId,
  amountToFetch = Definitions.DEFAULT_RANDOM_CVS,
  amountToRecommend = Definitions.DEFAULT_RANDOM_CVS,
}: {
  filteredCategories: number[];
  currentUsername?: string;
  currentCvId?: string;
  amountToFetch?: number;
  amountToRecommend?: number;
}) {
  const recommendedRaw = await getRandomizedCvs(true, amountToFetch, {
    searchValue: currentUsername || "",
    categoryIds: filteredCategories,
  });

  let recommendedCVs: CvModel[] = [];
  if (!currentUsername && !currentCvId) {
    return <></>;
  }
  if (currentUsername) {
    recommendedCVs = recommendedRaw || [];
    if (recommendedCVs.length >= amountToRecommend) {
      recommendedCVs = recommendedCVs.slice(0, amountToRecommend);
    }
  } else if (currentCvId) {
    recommendedCVs = (recommendedRaw || []).filter(
      (rec: CvModel) => rec.id !== currentCvId
    );
    if (recommendedCVs.length >= amountToRecommend) {
      recommendedCVs = recommendedCVs.slice(0, amountToRecommend);
    }
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
