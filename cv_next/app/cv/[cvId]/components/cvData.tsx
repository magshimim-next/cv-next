"use client";

import Categories from "@/types/models/categories";
import Image from "next/image";
import profileIcon from "@/public/images/profile.png";

export default function CvData({ cv }: { cv: CvModel }) {
  const uploader = JSON.parse(JSON.stringify(cv.user_id));
  const userName =
    uploader.username && uploader.username.length > 0
      ? uploader.username
      : uploader.full_name;
  return (
    <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[65%_35%] md:gap-x-4">
      <article
        key={cv.id}
        className={`mb-3 h-fit flex-col rounded-lg rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800`}
      >
        <footer className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            {/* TODO: update so it uses the dynamic profile image from the profile page*/}
            <Image
              alt="profile"
              src={uploader.avatar_url || profileIcon}
              width={30}
              height={30 * 1.4142}
              className="w-10 rounded-lg p-2"
            ></Image>
            <div className="flex items-center">
              <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                {userName}
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
