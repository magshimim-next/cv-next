"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CategoriesDisplay from "@/app/feed/components/CV/categoryDisplay";
import { encodeValue } from "@/lib/utils";

/**
 * CV card clickable component the show some key things about a given CV.
 * Used in the recommendations carousels.
 * @param {CvModel} param0 The CV to display.
 * @returns {JSX.Element} The clickable card component.
 */
export function CVClickableCard({ cv }: { cv: CvModel }) {
  const descRef = useRef<HTMLDivElement>(null);
  const [truncatedDesc, setTruncatedDesc] = useState(cv.description);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    // Reset text first
    el.textContent = cv.description;

    // Check if it overflows
    if (el.scrollHeight > el.clientHeight) {
      // Simple truncation algorithm
      let text = cv.description;
      let low = 0;
      let high = text.length;
      let mid;
      while (low < high) {
        mid = Math.floor((low + high) / 2);
        el.textContent = text.slice(0, mid) + "…";
        if (el.scrollHeight > el.clientHeight) {
          high = mid;
        } else {
          low = mid + 1;
        }
      }
      el.textContent = text.slice(0, high - 1) + "…";
      setTruncatedDesc(el.textContent);
    }
  }, [cv.description]);

  return (
    <Link
      href={`/cv/${encodeValue(cv.id)}`}
      className="block h-full no-underline hover:no-underline"
    >
      <div className="flex h-72 min-w-[400px] max-w-md cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-gray-200 bg-white py-6 shadow-lg transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex w-full flex-shrink-0 flex-col items-center justify-center gap-1">
          <div className="w-full text-center text-2xl font-bold">
            {typeof cv.user_id === "object" && cv.user_id !== null
              ? (cv.user_id as { display_name?: string }).display_name
              : String(cv.user_id)}
          </div>
          <p className="w-full text-center text-base text-neutral-400">
            {new Date(cv.created_at).toLocaleDateString("en-US")}
          </p>
        </div>
        <div className="flex w-full flex-shrink-0 justify-center">
          <CategoriesDisplay categories={cv.cv_categories} />
        </div>
        <div
          ref={descRef}
          className="line-clamp-4 w-full flex-grow-0 px-2 text-center text-lg text-neutral-700 dark:text-white"
          style={{ height: "4.5em", overflow: "hidden" }}
        >
          {truncatedDesc}
        </div>
      </div>
    </Link>
  );
}
