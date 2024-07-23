"use server";

import { cache } from "react";
import Categories from "@/types/models/categories";

const getTopCategories = async (cvs: CvModel[]) => {
  const categoryCount: { [key: number]: number } = {};
  cvs.forEach((cv) => {
    categoryCount[cv.category_id] = (categoryCount[cv.category_id] || 0) + 1;
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
    <span
      key={index}
      className="right-0 mx-4 mb-2 justify-center rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400"
    >
      {Categories.category[categoryId]}
      {index < top3CategoryIds.length - 1}
    </span>
  ));

  return (
    <div>
      {cvs.length ? (
        <div>
          <div className="mb-2 flex justify-center text-base">{title}</div>
          <div className="flex justify-center text-base">
            {categoryElements}
          </div>
        </div>
      ) : (
        <div className="mb-2 flex justify-center text-base">{error}</div>
      )}
    </div>
  );
}
