"use server";

import Image from "next/image";
import profileIcon from "@/public/images/profile.png";
import CategoryCounter from "./categoryCounter";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";

export default async function ProfileData({ user }: { user: UserModel }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center">
        <DynamicProfileImage isPlaceholder={user.avatar_url ? false : true}>
          <Image
            alt="profile"
            src={user.avatar_url || profileIcon}
            width={90}
            height={60 * 1.4142}
            className="rounded-lg p-2"
            priority={true}
          ></Image>
        </DynamicProfileImage>
      </div>
      <div className="mb-3 flex justify-center">
        <p className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white">
          {user.full_name || user.username}
        </p>
      </div>
      <div className="flex justify-center">
        <CategoryCounter profileId={user.id} />
      </div>
    </div>
  );
}
