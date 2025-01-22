"use client";
import Image from "next/image";
import { useState } from "react";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { useUser } from "@/hooks/useUser";
import Popup from "./popup";

interface PopupToggleProps {
  closeHamburger?: () => void;
}

export function PopupToggle({ closeHamburger }: PopupToggleProps) {
  const { userData } = useUser();

  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  return (
    <div>
      <div className="cursor-pointer rounded-full hover:bg-[#27374e]">
        <div onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}>
          <DynamicProfileImage
            isPlaceholder={userData?.avatar_url ? false : true}
            placeHolderStyle={{ fontSize: "40px", color: "#FFF" }}
          >
            <Image
              alt="profile"
              height={40}
              width={40}
              src={userData?.avatar_url || ""}
              onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
            />
          </DynamicProfileImage>
        </div>
      </div>
      {isProfilePopupOpen && (
        <Popup
          closeCb={() => {
            setIsProfilePopupOpen(false);
            if (closeHamburger) {
              closeHamburger();
            }
          }}
        ></Popup>
      )}
    </div>
  );
}
