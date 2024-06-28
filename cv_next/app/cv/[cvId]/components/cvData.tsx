"use client";
import { getUser } from "@/app/actions/users/getUser";
import useSWR from "swr";
import Categories from "@/types/models/categories";
import Image from "next/image";
import profileIcon from "@/public/images/profile.png";
import Link from "next/link";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";

export default function CvData({ cv }: { cv: CvModel }) {
  const { data: user } = useSWR(cv.user_id, getUser);
  if (user && user.ok) {
    return (
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-[65%_35%] md:gap-x-4">
        <article
          key={cv.id}
          className={`mb-3 h-fit flex-col rounded-lg rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800`}
        >
          <footer className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <DynamicProfileImage
                isPlaceholder={user.val.avatar_url ? false : true}
                placeHolderSize={35}
              >
                <Image
                  alt="profile"
                  src={user.val.avatar_url || profileIcon}
                  width={50}
                  height={30 * 1.4142}
                  className="rounded-lg p-2"
                />
              </DynamicProfileImage>
              <div className="flex items-center" style={{ marginLeft: "10px" }}>
                <p className="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                  <Link
                    className="text-lg font-medium hover:underline"
                    href={`/profile/${user.val.id}`}
                  >
                    {user.val.username || user.val.full_name}
                  </Link>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Categories.category[cv.category_id]}
                </p>
              </div>
            </div>
          </footer>
          <p className="text-gray-500 dark:text-gray-400">{cv.description}</p>
          <span> </span>
        </article>
      </div>
    );
  } else {
    // TODO: Show error
    return null;
  }
}
