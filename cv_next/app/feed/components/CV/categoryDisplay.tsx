"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { CvCategory } from "@/components/ui/cvCategory";

interface CategoriesDisplayProps {
  categories: string[];
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
    useState<string[]>(categories);
  const [overFlowingCategories, setOverFlowingCategories] = useState<string[]>(
    []
  );
  const [savedWidth, setSavedWidth] = useState<number>();

  const resetCategoriesArray = useCallback(() => {
    setDisplayedCategories(categories);
    setOverFlowingCategories([]);
  }, [categories]);

  // Handle overflow calculation
  useLayoutEffect(() => {
    if (!thisElement.current) return;

    const container = thisElement.current.parentElement;
    if (!container) return;

    const { clientWidth: containerWidth } = container;
    const { scrollWidth } = thisElement.current;

    const availableWidth =
      overFlowingCategories.length > 0 ? containerWidth - 60 : containerWidth;

    const hasOverflow = scrollWidth > availableWidth;

    if (hasOverflow && displayedCategories.length > 1) {
      const newDisplayed = [...displayedCategories];
      const overflowCategory = newDisplayed.pop()!;

      setDisplayedCategories(newDisplayed);
      setOverFlowingCategories([overflowCategory, ...overFlowingCategories]);
    }
  }, [displayedCategories, overFlowingCategories]);

  // Handle container resize
  useEffect(() => {
    if (!isClient || !thisElement.current) return;

    const container = thisElement.current.parentElement;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        setSavedWidth((prev) => {
          if (prev !== newWidth) {
            return newWidth;
          }
          return prev;
        });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isClient]);

  useEffect(() => {
    if (savedWidth) {
      resetCategoriesArray();
    }
  }, [savedWidth, resetCategoriesArray]);

  // Handle category prop changes
  useEffect(() => {
    resetCategoriesArray();
  }, [categories, resetCategoriesArray]);

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
      <div className="mt-2 flex flex-row items-center justify-between gap-2 overflow-hidden">
        <div
          className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden"
          ref={thisElement}
        >
          {displayedCategories.map((categoryId, index) => (
            <CvCategory
              key={`${categoryId}-${index}`}
              categoryId={categoryId}
              className="rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400 hover:underline"
            />
          ))}
        </div>
        {overFlowingCategories.length !== 0 && (
          <div className="flex flex-shrink-0 items-center">
            <OverflowNumber
              categories={overFlowingCategories}
              onClick={shiftTheCategories}
            />
          </div>
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
  categories: string[];
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex h-7 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-700 text-sm font-semibold text-white hover:bg-gray-400"
      title={categories.map(getCategoryText).join(", ")}
    >
      +{categories.length}
    </div>
  );
}

/**
 * The function will get the category string based on the ID
 * @param {number} id The ID of the category
 * @returns {string} The category string with a hashtag prefix
 */
function getCategoryText(id: string) {
  return `#${id}`;
}
