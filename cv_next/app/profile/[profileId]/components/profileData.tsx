"use server";

import Image from "next/image";
import profileIcon from "@/public/images/profile.png";
import CategoryCounter from "./categoryCounter";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import EditableUsername from "./editableUsername";

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
      <div className="flex justify-center">
        <EditableUsername user={user} />
      </div>
      <div className="flex justify-center">
        <CategoryCounter user={user} />
      </div>
    </div>
  );
}
