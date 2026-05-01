"use server";

import CarouselStructure from "@/components/ui/Carousel/carouselStructure";
import { CVClickableCard } from "@/components/ui/CVComponents/cvClickableCard";
import Definitions from "@/lib/definitions";
import { getRandomizedCvs } from "@/server/api/cvs";

/**
 * This component fetchs and displays recommended CVs based on the current CV and or current user ID.
 * @param {object} param0 The component props.
 * @param {number[]} param0.filteredCategories The categories to filter for.
 * @param {string} param0.currentUserId The viewd user ID to exclude their CVs.
 * @param {string} param0.currentCvId The current CV ID to exclude it.
 * @param {number} param0.amountToFetch The amount of CVs to attempt and get from the DB.
 * @param {number} param0.amountToRecommend The amount of CVs to actually show and recommend.
 * @param {string} param0.title A title to shows at the top of the recommended section.
 *    Defaults to 'Relevant CVs'
 * @param {string} param0.subtitle A subtitle to show below the main title of the section.
 *    Defaults to 'Based on the categories of this page'
 * @returns {JSX.Element} The recommended section.
 */
export async function RecommendedCvsSection({
  filteredCategories,
  currentUserId,
  currentCvId,
  amountToFetch = Definitions.DEFAULT_RANDOM_CVS,
  amountToRecommend = Definitions.DEFAULT_RANDOM_CVS,
  title = "Relevant CVs",
  subtitle = "Based on the categories of this page",
}: {
  filteredCategories: string[];
  currentUserId?: string;
  currentCvId?: string;
  amountToFetch?: number;
  amountToRecommend?: number;
  title?: string;
  subtitle?: string;
}) {
  const recommendedRaw = await getRandomizedCvs(true, amountToFetch, {
    searchValue: "",
    categoryIds: filteredCategories,
  });

  let recommendedCVs: CvModel[] = [];
  if (!currentUserId && !currentCvId) {
    return <></>;
  }
  if (currentUserId) {
    // TODO: use filtering that is based on name recieved using the DB query.
    recommendedCVs = (recommendedRaw || []).filter((rec: CvModel) => {
      const authorData = rec.unique_profile_id as any;
      const authorId = typeof authorData === "object" && authorData !== null
        ? authorData.unique_profile_id
        : String(authorData);
      return authorId !== currentUserId;
    });
    if (recommendedCVs.length >= amountToRecommend) {
      recommendedCVs = recommendedCVs.slice(0, amountToRecommend);
    }
  } else if (currentCvId) {
    recommendedCVs = (recommendedRaw || []).filter(
      (rec: CvModel) => rec.unique_cv_id !== currentCvId
    );
    if (recommendedCVs.length >= amountToRecommend) {
      recommendedCVs = recommendedCVs.slice(0, amountToRecommend);
    }
  }

  return (
    <>
      {recommendedCVs.length > 0 && (
        <div className="bg-gradient mt-8 rounded-xl py-8">
          <h2 className="mb-4 text-center text-3xl font-bold">{`${title}`}</h2>
          <h3 className="mb-4 text-center text-base font-bold text-gray-700 dark:text-gray-300">
            {`${subtitle}`}
          </h3>
          <CarouselStructure options={{ loop: true }}>
            {recommendedCVs.map((recCv: CvModel) => (
              <div className="p-4" key={recCv.unique_cv_id}>
                <CVClickableCard cv={recCv} />
              </div>
            ))}
          </CarouselStructure>
        </div>
      )}
    </>
  );
}
