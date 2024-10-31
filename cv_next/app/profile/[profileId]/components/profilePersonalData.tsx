"use client";

import Image from "next/image";
import { ImagePlusIcon, PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { useUser } from "@/hooks/useUser";
import ProfileForm from "./profileForm";
import { ProfileDisplay } from "./profileDisplay";

export const ProfilePersonalData = ({
  user,
  revalidationFn,
}: {
  user: UserModel;
  revalidationFn: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { userData } = useUser();
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    if (userData && user.id === userData.id) {
      setIsCurrentUser(true);
    } else {
      setIsCurrentUser(false);
    }
  }, [user.id, userData]);

  const changePfp = () => {
    //To be implemented
  };

  return (
    <div
      className="fill-available mb-3 w-full rounded-lg border-b
            border-gray-200 bg-white p-6 text-base dark:bg-theme-800"
    >
      <div className="m-auto mb-[10px] flex w-full justify-between">
        <div className="flex w-full justify-center">
          <DynamicProfileImage
            isPlaceholder={user.avatar_url ? false : true}
            className="relative"
          >
            {isEditing && (
              <ImagePlusIcon
                size={20}
                className="absolute left-0 top-0 z-10 ml-2 mt-2 cursor-pointer opacity-85"
                onClick={changePfp}
              />
            )}
            <Image
              alt="profile"
              src={user.avatar_url || ""}
              width={90}
              height={60 * 1.4142}
              className="rounded-lg p-2"
              priority={true}
            ></Image>
          </DynamicProfileImage>
        </div>
        {isCurrentUser && (
          <PencilIcon
            className="cursor-pointer"
            size={20}
            onClick={() => setIsEditing(!isEditing)}
            fill={isEditing ? "currentColor" : undefined}
          />
        )}
      </div>
      <div className="m-auto w-full">
        {isCurrentUser && isEditing ? (
          <ProfileForm
            user={userData ?? user}
            revalidationFn={revalidationFn}
            exitEditMode={() => setIsEditing(false)}
          />
        ) : (
          <ProfileDisplay user={userData ?? user} />
        )}
      </div>
    </div>
  );
};
