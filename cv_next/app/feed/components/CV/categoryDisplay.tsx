"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const thisElement = useRef<HTMLDivElement | null>(null);

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
    if (!thisElement.current) return;

    const { clientWidth, scrollWidth } = thisElement.current;

    if (clientWidth < scrollWidth && displayedCategories.length > 0) {
      const newDisplayed = [...displayedCategories];
      const overflowCategory = newDisplayed.pop()!;

      setDisplayedCategories(newDisplayed);
      setOverFlowingCategories([overflowCategory, ...overFlowingCategories]);
    }
  }, [categories, displayedCategories, overFlowingCategories]);

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
    if (
      overFlowingCategories.length === 0 ||
      displayedCategories.length === 0
    ) {
      return;
    }

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
        ref={thisElement}
      >
        <div className="flex space-x-2">
          {displayedCategories.map((categoryId, index) => (
            <CvCategory key={index} categoryId={categoryId} />
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
 * @param {{categories: number[], onClick: () => void}} props
 *   - categories: The array of overflowing category IDs
 *   - onClick: The function to call when the overflow number is clicked
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
          onClick();
        }}
        className="right-0 flex cursor-pointer items-center justify-center rounded-full bg-gray-700 px-2 py-1 text-sm font-semibold text-white hover:bg-gray-400"
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
