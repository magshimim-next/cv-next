"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Categories from "@/types/models/categories";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { useError } from "@/providers/error-provider";
import { Visible_Error_Messages } from "@/lib/definitions";
import { generateCategoryLink } from "@/lib/utils";

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

  if (!validCV) {
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
  }

  const showData = validCV ? "md:grid-cols-[70%_30%]" : "";

  return (
    <div className={`grid grid-cols-1 gap-y-4 ${showData} md:gap-x-4`}>
      <article className="mb-3 flex flex-col rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800">
        <div className="mb-3 flex items-center">
          <div className="mr-3">
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
          </div>
          <Link href={`/profile/${uploader.username}`}>
            <p className="text-xl font-medium hover:underline">{displayName}</p>
          </Link>
        </div>
        <div className="mb-3 flex flex-wrap items-center space-x-2">
          {cv.cv_categories.map((category, index) => (
            <Link key={index} href={generateCategoryLink(category)}>
              <div
                onClick={(e) => e.stopPropagation()}
                className="rounded-full bg-gray-700 px-3 py-1 text-sm font-semibold text-white hover:bg-gray-400 hover:underline"
              >
                #{Categories.category[category]}
              </div>
            </Link>
          ))}
        </div>
        <p className="text-gray-500 dark:text-gray-400">{cv.description}</p>
      </article>
    </div>
  );
}
