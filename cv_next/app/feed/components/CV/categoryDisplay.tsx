"use client";

import { useCallback, useEffect, useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import Categories from "@/types/models/categories";
import { CvCategory } from "@/components/ui/cvCategory";

interface CategoriesDisplayProps {
  categories: number[];
}

export default function CategoriesDisplay({
  categories,
}: CategoriesDisplayProps) {
  const [thisElement, setThisElement] = useState<HTMLDivElement | null>();

  const [displayedCategories, setDisplayedCategories] =
    useState<number[]>(categories);
  const [overFlowingCategories, setOverFlowingCategories] = useState<number[]>(
    []
  );
  const [savedWidth, setSavedWidth] = useState<number>();

  const windowSize = useWindowSize();

  const resetCategoriesArray = useCallback(() => {
    setDisplayedCategories(categories);
    setOverFlowingCategories([]);
  }, [categories]);

  useEffect(() => {
    if (thisElement && thisElement.clientWidth < thisElement.scrollWidth) {
      const overflowCategory =
        displayedCategories[displayedCategories.length - 1];

      setOverFlowingCategories([overflowCategory, ...overFlowingCategories]);
      setDisplayedCategories(displayedCategories.slice(0, -1));
    }
  }, [thisElement, categories, displayedCategories, overFlowingCategories]);

  useEffect(() => {
    if (windowSize && savedWidth !== windowSize.width) {
      resetCategoriesArray();
      setSavedWidth(windowSize.width);
    }
  }, [
    windowSize,
    displayedCategories,
    overFlowingCategories,
    savedWidth,
    resetCategoriesArray,
  ]);

  const shiftTheCategories = () => {
    const overflowCategory =
      overFlowingCategories[overFlowingCategories.length - 1];
    const displayedCategory =
      displayedCategories[displayedCategories.length - 1];

    setOverFlowingCategories([
      displayedCategory,
      ...overFlowingCategories.slice(0, -1),
    ]);
    setDisplayedCategories([
      overflowCategory,
      ...displayedCategories.slice(0, -1),
    ]);
  };

  return (
    <>
      <div
        className="mt-2 flex flex-row justify-between space-x-2"
        ref={(el) => setThisElement(el)}
      >
        <div className="flex space-x-2">
          {displayedCategories.map((categoryId, index) => (
            <CvCategory
              key={index}
              categoryId={categoryId}
              onClick={(e) => e.stopPropagation()}
            />
          ))}
        </div>
        {overFlowingCategories.length !== 0 && (
          <OverflowNumber
            categories={overFlowingCategories}
            onClick={shiftTheCategories}
          />
        )}
      </div>
    </>
  );
}

function OverflowNumber({
  categories,
  onClick,
}: {
  categories: number[];
  onClick: () => void;
}) {
  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="right-0 flex items-center justify-center rounded-full bg-gray-700 px-2 py-1 text-sm font-semibold text-white hover:bg-gray-400"
        title={categories.map(getCategoryText).join(", ")}
      >
        +{categories.length}
      </div>
    </>
  );
}

function getCategoryText(id: number) {
  return `#${Categories.category[id]}`;
}
