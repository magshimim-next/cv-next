"use client";
import profileIcon from "@/public/images/profile.png";
import Image from "next/image";
import { useState } from "react";
import Popup from "./popup";

export function PopupToggle() {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  return (
    <div>
      <div className="cursor-pointer rounded-full hover:bg-[#27374e]">
        <Image
          alt="profile"
          height={40}
          width={40}
          src={profileIcon}
          onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
        ></Image>
      </div>
      {isProfilePopupOpen && (
        <Popup closeCb={() => setIsProfilePopupOpen(false)}></Popup>
      )}
    </div>
  );
}
