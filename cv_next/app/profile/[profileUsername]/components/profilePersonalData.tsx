"use client";

import Image from "next/image";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { useUser } from "@/hooks/useUser";
import Tooltip from "@/components/ui/tooltip";
import ProfileForm from "./profileForm";
import { ProfileDisplay } from "./profileDisplay";
import EditableProfileImage from "./upload_pfp/EditableProfileImage";
import { SocialLinksDisplay } from "./SocialLinksDisplay";

export const ProfilePersonalData = ({
  user,
  revalidationFn,
  isCurrentAdmin,
}: {
  user: UserModel;
  revalidationFn: () => void;
  isCurrentAdmin: boolean;
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

  return (
    <>
      <div
        className="fill-available mb-3 w-full rounded-lg border-b
              border-gray-200 bg-white p-6 text-base dark:bg-theme-800"
      >
        <div className="m-auto mb-[10px] flex w-full justify-between">
          <div className="flex w-full justify-center">
            {isCurrentUser && isEditing ? (
              <EditableProfileImage user={user} />
            ) : (
              <DynamicProfileImage
                isPlaceholder={user.avatar_url ? false : true}
                className="relative overflow-hidden rounded-full"
              >
                <Image
                  alt="profile"
                  src={user?.avatar_url || ""}
                  width={90}
                  height={60 * 1.4142}
                  priority={true}
                ></Image>
              </DynamicProfileImage>
            )}
          </div>
          {(isCurrentAdmin || isCurrentUser) && (
            <Tooltip id="Edit Icon" message={isEditing ? "Cancel" : "Edit"}>
              <PencilIcon
                className="cursor-pointer"
                size={20}
                onClick={() => setIsEditing(!isEditing)}
                fill={isEditing ? "currentColor" : undefined}
              />
            </Tooltip>
          )}
        </div>
        <div className="m-auto w-full">
          {(isCurrentAdmin || isCurrentUser) && isEditing ? (
            <ProfileForm
              user={user}
              revalidationFn={revalidationFn}
              exitEditMode={() => setIsEditing(false)}
            />
          ) : (
            <>
              <ProfileDisplay user={user} />
              <SocialLinksDisplay user={user}/> 
            </>
          )}
        </div>
      </div>

      {/* {
        ((isCurrentAdmin || isCurrentUser) && !isEditing) ? (
        <div className="fill-available mb-3 w-full rounded-lg border-b
          border-gray-200 bg-white p-2 text-base dark:bg-theme-800">
            <SocialLinksDisplay user={user}/> 
        </div>): undefined
      } */}
    </>
  );
};
