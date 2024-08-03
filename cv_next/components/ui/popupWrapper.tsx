"use client";

import Image from "next/image";
import { ReactNode, useState } from "react";

interface PopupProps {
    children: ReactNode;
    clickable?: ReactNode;
    disableButton?: boolean;
    onClose?: () => void;
}

export default function PopupWrapper({ children, clickable, disableButton, onClose }: PopupProps, ) {
  const [isPopupOpen, setIsPopupOpen] = useState(!!onClose);

  return (
    <div>
      { clickable && <div className="cursor-pointer rounded-full" onClick={() => {if(!disableButton) setIsPopupOpen(true)}}>
        {clickable}
      </div>}
      {isPopupOpen && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
            <div
                className="absolute h-full w-full bg-black opacity-50 backdrop-blur-md z-popup-bg"
                onClick={() => {
                  onClose ? onClose() : setIsPopupOpen(false)
                }}
            ></div>
            <div className="z-popup">
                {children}
            </div>
        </div>
      )}
    </div>
  );
}
