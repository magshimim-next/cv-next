"use client";

import { useCallback, useEffect, useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import Categories from "@/types/models/categories";
import { CvCategory } from "@/components/ui/cvCategory";

interface CategoriesDisplayProps {
  categories: number[];
}

/**
 * This component handles showing multiple categories with overflow handling
 * @param {CategoriesDisplayProps} categories The categories to show
 * @returns {Element} A component that displays categories with overflow handling
 */
export default function CategoriesDisplay({
  categories,
}: CategoriesDisplayProps) {
  const [isClient, setIsClient] = useState(false);
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

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

/**
 * The OverflowNumber component displays the number of overflowing categories
 * @param {number[]} categories The array of overflowing category IDs
 * @param {() => void} onClick The function to call when the overflow number is clicked
 * @returns {Element} A div displaying the number of overflowing categories with a tooltip
 */
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

/**
 * The function will get the category string based on the ID
 * @param {number} id The ID of the category
 * @returns {string} The category string with a hashtag prefix
 */
function getCategoryText(id: number) {
  return `#${Categories.category[id]}`;
}
