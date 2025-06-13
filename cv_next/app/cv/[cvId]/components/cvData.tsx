"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { useError } from "@/providers/error-provider";
import { Visible_Error_Messages } from "@/lib/definitions";
import { CvCategory } from "@/components/ui/cvCategory";
import { encodeValue } from "@/lib/utils";
import Tooltip from "@/components/ui/tooltip";

export default function CvData({
  cv,
  validCV,
  currentUserIsAuthorOrAdmin: currentUserIsAuthorOrAdmin,
}: {
  cv: CvModel;
  validCV: boolean;
  currentUserIsAuthorOrAdmin: boolean;
}) {
  const uploader = JSON.parse(JSON.stringify(cv.user_id));
  const displayName = uploader.display_name || uploader.username;
  const { showError } = useError();
  const router = useRouter();

  if (!validCV) {
    if (currentUserIsAuthorOrAdmin) {
      showError(
        Visible_Error_Messages.CurrentUserPrivateCV.title,
        Visible_Error_Messages.CurrentUserPrivateCV.description
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
      <article className="relative mb-3 flex flex-col rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800">
        {currentUserIsAuthorOrAdmin && (
          <div className="absolute right-4 top-4 rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-theme-700">
            <Tooltip id="Settings Icon" message="Edit CV">
              <FiSettings
                size={22}
                style={{ fontSize: "5vh", cursor: "pointer" }}
                onClick={() => router.push(`/cv/${encodeValue(cv.id)}/edit`)}
              />
            </Tooltip>
          </div>
        )}
        <div className="mb-3 flex items-center">
          <div className="mr-3">
            <DynamicProfileImage
              isPlaceholder={uploader.avatar_url ? false : true}
              placeHolderStyle={{ fontSize: "35px" }}
            >
              <Image
                alt="profile"
                src={uploader.avatar_url || ""}
                width={40}
                height={30 * 1.4142}
              />
            </DynamicProfileImage>
          </div>
          <Link href={`/profile/${uploader.username}`}>
            <p className="text-xl font-medium hover:underline">{displayName}</p>
          </Link>
        </div>
        <div className="mb-3 flex flex-wrap items-center space-x-2">
          {cv.cv_categories && (
            <div className="flex flex-wrap items-center">
              {cv.cv_categories.map((category, index) => (
                <CvCategory
                  key={index}
                  categoryId={category}
                  onClick={(e) => e.stopPropagation()}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 sm:text-lg">
          {cv.description}
        </p>
      </article>
    </div>
  );
}
