"use client";

import Categories from "@/types/models/categories";
import Image from "next/image";
import Link from "next/link";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";

export default function CvData({ cv }: { cv: CvModel }) {
  const uploader = JSON.parse(JSON.stringify(cv.user_id));
  const userName = uploader.username?.length
    ? uploader.username
    : uploader.full_name;
  return (
    <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[65%_35%] md:gap-x-4">
      <article
        key={cv.id}
        className={`mb-3 h-fit flex-col rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800`}
      >
        <footer className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <DynamicProfileImage
              isPlaceholder={uploader.avatar_url ? false : true}
              placeHolderStyle={{ fontSize: "35px" }}
            >
              <Image
                alt="profile"
                src={uploader.avatar_url || ""}
                width={50}
                height={30 * 1.4142}
                className="rounded-lg p-2"
              />
            </DynamicProfileImage>
            <div className="ml-3 flex items-center">
              <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                <Link
                  className="text-lg font-medium hover:underline"
                  href={`/profile/${uploader.id}`}
                >
                  {userName}
                </Link>
              </p>
              <div className="flex flex-wrap space-x-2">
                {cv.cv_categories.map((category, index) => (
                  <div key={index}>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Categories.category[category]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </footer>
        <p className="text-gray-500 dark:text-gray-400">{cv.description}</p>
        <span> </span>
      </article>
    </div>
  );
}
