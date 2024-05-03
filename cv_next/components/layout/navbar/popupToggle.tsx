"use client";
import settignsIcon from "@/public/images/settigns.png";
import Image from "next/image";
import { useState } from "react";
import Popup from "./popup";

export function PopupToggle() {
  const [isSettignsOpen, setIsSettignsOpen] = useState(false);

  return (
    <div>
      <div className="cursor-pointer rounded-full hover:bg-[#27374e]">
        <Image
          alt="settings"
          height={40}
          width={40}
          src={settignsIcon}
          onClick={() => setIsSettignsOpen(!isSettignsOpen)}
        ></Image>
      </div>
      {isSettignsOpen && (
        <Popup closeCb={() => setIsSettignsOpen(false)}></Popup>
      )}
    </div>
  );
}
