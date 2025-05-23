"use server";

import { cache } from "react";
import { CvCategory } from "@/components/ui/cvCategory";

const getTopCategories = async (cvs: CvModel[]) => {
  const categoryCount: { [key: number]: number } = {};
  cvs.forEach((cv) => {
    cv.cv_categories.forEach((category_id) => {
      categoryCount[category_id] = (categoryCount[category_id] || 0) + 1;
    });
  });

  const categoryCountArray = Object.entries(categoryCount).map(
    ([categoryId, count]) => ({
      categoryId: parseInt(categoryId),
      count,
    })
  );

  categoryCountArray.sort((a, b) => b.count - a.count);

  const top3CategoryIds = categoryCountArray
    .slice(0, 3)
    .map((item) => item.categoryId);

  return top3CategoryIds;
};

const cachedTopCategories = cache(getTopCategories);

export default async function CategoryCounter({
  cvs,
  title,
  error,
}: {
  cvs: CvModel[];
  title: string;
  error: string;
}) {
  const top3CategoryIds = await cachedTopCategories(cvs);

  const categoryElements = top3CategoryIds.map((categoryId, index) => (
    <CvCategory key={index} categoryId={categoryId} />
  ));

  return (
    <div>
      {cvs.length ? (
        <div>
          <div className="mb-2 flex justify-center text-center">{title}</div>
          <div className="flex flex-col flex-wrap items-center lg:flex-row lg:justify-center">
            {categoryElements}
          </div>
        </div>
      ) : (
        <div className="mb-2 flex justify-center text-base">{error}</div>
      )}
    </div>
  );
}
