"use server";
import { getCvsByUserId } from "@/server/api/cvs";
import logger from "@/server/base/logger";
import Categories from "@/types/models/categories";

export default async function CategoryCounter({ user }: { user: UserModel }) {
  const cvs = await getCvsByUserId(user.id);

  if (cvs === null) {
    logger.error("Couldn't get CVs by user");
    return <div>Error Fetching user&apos;s CVs</div>;
  }

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
          <div className="mb-2 flex justify-center text-base">
            Most CVs are categorized under
          </div>
          <div className="flex justify-center text-base">
            {categoryElements}
          </div>
        </div>
      ) : (
        <div className="mb-2 flex justify-center text-base">No CVs found</div>
      )}
    </div>
  );
}
