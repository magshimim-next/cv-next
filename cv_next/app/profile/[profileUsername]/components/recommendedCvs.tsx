"use server";

import CarouselStructure from "@/components/ui/Carousel/carouselStructure";
import { CVClickableCard } from "@/components/ui/CVComponents/cvClickableCard";
import { getRandomizedCvs } from "@/server/api/cvs";

/**
 * This component fetchs and displays recommended CVs based on the current CV.
 * @param {CvModel} param0 The current CV.
 * @returns {JSX.Element} The recommended section.
 */
export async function RecommendedCvsSection({
  categories,
  currentUserId,
}: {
  categories: number[];
  currentUserId: string;
}) {
  const recommendedRaw = await getRandomizedCvs(true, 8, {
    searchValue: "",
    categoryIds: categories,
  });
  console.log(recommendedRaw, currentUserId);
  let recommendedCVs = (recommendedRaw || []).filter((rec: CvModel) => {
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

  return (
    <>
      {recommendedCVs.length > 0 && (
        <div className="bg-gradient mt-8 rounded-xl py-8">
          <h2 className="mb-4 text-center text-3xl font-bold">Relevant CVs</h2>
          <h3 className="mb-4 text-center text-base font-bold text-gray-700 dark:text-gray-300">
            {`Based on the categories of this profile`}
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
