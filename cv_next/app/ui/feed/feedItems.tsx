"use client";
import CvModel from "@/app/models/cv";
import { useInfiniteQuery } from "@tanstack/react-query";

const CVS_PER_PAGE = 2;

const mockcvs: CvModel[] = [
  new CvModel("1", "1", "https://site.com/1", 1),
  new CvModel("2", "2", "https://site.com/2", 1),
  new CvModel("3", "3", "https://site.com/3", 1),
  new CvModel("4", "4", "https://site.com/4", 1),
  new CvModel("5", "5", "https://site.com/5", 1),
  new CvModel("6", "6", "https://site.com/6", 1),
  new CvModel("7", "7", "https://site.com/7", 1),
  new CvModel("8", "8", "https://site.com/8", 1),
];

// mock database fetch
const fetchCVs = async (page: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockcvs.slice((page - 1) * CVS_PER_PAGE, page * CVS_PER_PAGE);
};

function FeedItems() {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["query"],
    async ({ pageParam = 1 }) => {
      const response = await fetchCVs(pageParam);
      return response;
    },
    {
      getNextPageParam: (_, mockcvs) => {
        return mockcvs.length + 1;
      },
      initialData: {
        pages: [mockcvs.slice(0, CVS_PER_PAGE)],
        pageParams: [1],
      },
    }
  );

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.map((cv) => (
            <div key={cv.id}>{cv.documentLink}</div>
          ))}
        </div>
      ))}
      <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        {isFetchingNextPage ? "Loading more... " : "Load More"}
      </button>
    </div>
  );
}

export default FeedItems;
