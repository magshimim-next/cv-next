"use client";

import Link from "next/link";
import CategoriesDisplay from "@/app/feed/components/CV/categoryDisplay";
import { encodeValue, getJointDisplayName } from "@/lib/utils";

/**
 * CV card clickable component the show some key things about a given CV.
 * Used in the recommendations carousels.
 * @param {CvModel} param0 The CV to display.
 * @returns {JSX.Element} The clickable card component.
 */
export function CVClickableCard({ cv }: { cv: CvModel }) {
  return (
    <Link
      href={`/cv/${encodeValue(cv.unique_cv_id)}`}
      className="block h-full no-underline hover:no-underline"
    >
      <div className="flex h-72 min-w-[400px] max-w-md cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-gray-200 bg-white py-6 shadow-lg transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex w-full flex-shrink-0 flex-col items-center justify-center gap-1">
          <div className="w-full text-center text-2xl font-bold">
            {getJointDisplayName(cv.unique_profile_id)}
          </div>
          <p className="w-full text-center text-base text-neutral-400">
            {new Date(cv.updated_at).toLocaleDateString("en-US")}
          </p>
        </div>
        <div className="flex w-full flex-shrink-0 justify-center">
          <CategoriesDisplay categories={cv.cv_categories} />
        </div>
        <div
          className="line-clamp-4 w-full flex-grow-0 px-2 text-center text-lg text-neutral-700 dark:text-white"
          style={{
            overflow: "hidden",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {cv.description}
        </div>
      </div>
    </Link>
  );
}
