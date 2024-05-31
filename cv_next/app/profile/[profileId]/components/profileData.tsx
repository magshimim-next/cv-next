"use server";
import { getCvsByUserId } from "@/server/api/cvs";
import logger from "@/server/base/logger";
import Image from "next/image";
import profileIcon from "@/public/images/profile.png";
import CategoryCounter from "./categoryCounter";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import EditableUsername from "./editableUsername";

export default async function ProfileData({ user }: { user: UserModel }) {
  const cvs = await getCvsByUserId(user.id);

  if (cvs === null) {
    logger.error("Couldn't get CVs by user");
    return <div>Error Fetching user&apos;s CVs</div>;
  }

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
        <CategoryCounter cvs={cvs} />
      </div>
    </div>
  );
}
