"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Categories from "@/types/models/categories";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { useError } from "@/providers/error-provider";
import { Visible_Error_Messages } from "@/lib/definitions";

export default function CvData({
  cv,
  validCV,
  currentUserIsAuthor,
}: {
  cv: CvModel;
  validCV: boolean;
  currentUserIsAuthor: boolean;
}) {
  const uploader = JSON.parse(JSON.stringify(cv.user_id));
  const displayName = uploader.display_name || uploader.username;
  const { showError } = useError();
  const router = useRouter();

  if (currentUserIsAuthor) {
    showError(
      Visible_Error_Messages.CurrentUserPrivateCV.title,
      Visible_Error_Messages.CurrentUserPrivateCV.description,
      () => router.push("/feed")
    );
  } else {
    showError(
      Visible_Error_Messages.PrivateCV.title,
      Visible_Error_Messages.PrivateCV.description,
      () => router.push("/feed")
    );
  }

  const showData = validCV ? "md:grid-cols-[70%_30%]" : "";

  return (
    <div className={`grid grid-cols-1 gap-y-4 ${showData} md:gap-x-4`}>
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
                  href={`/profile/${uploader.username}`}
                >
                  {displayName}
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
