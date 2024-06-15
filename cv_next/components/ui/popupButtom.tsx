"use client";

import Image from "next/image";
import { ReactNode, useState } from "react";

interface PopupProps {
    children: ReactNode;
    clickable: ReactNode;
    disableButton?: boolean;
}

export default function PopupWrapper({ children, clickable, disableButton }: PopupProps, ) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div>
      <div className="cursor-pointer rounded-full hover:bg-[#27374e]" onClick={() => {if(!disableButton) setIsPopupOpen(true)}}>
        {clickable}
      </div>
      {isPopupOpen && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
            <div
                className="absolute h-full w-full bg-black opacity-50 backdrop-blur-md z-popup-bg"
                onClick={() => setIsPopupOpen(false)}
            ></div>
            <div className="z-popup">
                {children}
            </div>
        </div>
      )}
    </div>
  );
}
