"use server";

import CarouselStructure from "@/components/ui/Carousel/carouselStructure";
import { CVClickableCard } from "@/components/ui/CVComponents/cvClickableCard";
import Definitions from "@/lib/definitions";
import { getRandomizedCvs } from "@/server/api/cvs";

/**
 * This component fetchs and displays recommended CVs based on the current CV.
 * @param {CvModel} param0 The current CV.
 * @returns {JSX.Element} The recommended section.
 */
export async function RecommendedCvsSection({
  currentCv,
}: {
  currentCv: CvModel;
}) {
  const authorData = JSON.parse(JSON.stringify(currentCv.user_id));
  const recommendedRaw = await getRandomizedCvs(
    true,
    Definitions.DEFAULT_RANDOM_CVS,
    {
      searchValue: "",
      categoryIds: currentCv.cv_categories,
    }
  );

  let recommendedCVs = (recommendedRaw || []).filter(
    (rec: CvModel) => rec.id !== currentCv.id
  );
  if (recommendedCVs.length >= 5) {
    recommendedCVs = recommendedCVs.slice(0, 5);
  }

  return (
    <>
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
    </>
  );
}
