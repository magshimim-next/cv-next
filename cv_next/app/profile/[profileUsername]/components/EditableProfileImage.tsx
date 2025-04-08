"use client";
import Image from "next/image";
import { Upload } from "lucide-react";
import { useState } from "react";
import Popup from "./uploadPopup";

export default function EditableProfileImage({ user }: { user: UserModel }) {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  async function onProfileClick() {
    setIsProfilePopupOpen(!isProfilePopupOpen);
  }

  return (
    <div className="relative overflow-hidden rounded-full">
      <Image
        alt="profile"
        src={user.avatar_url || ""}
        width={90}
        height={60 * 1.4142}
        priority={true}
      />
      <div
        className="absolute bottom-0 left-0 right-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50 p-1"
        onClick={() => onProfileClick()}
      >
        <Upload className="h-5 w-5 text-white" />
      </div>

      {isProfilePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Popup
            closeCb={() => {
              setIsProfilePopupOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
