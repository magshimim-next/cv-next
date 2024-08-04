"use client";

import { ReactNode, useState } from "react";

interface PopupProps {
  children: ReactNode;
  clickable?: ReactNode;
  disableButton?: boolean;
  onClose?: () => void;
}

export default function PopupWrapper({
  children,
  clickable,
  disableButton,
  onClose,
}: PopupProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(!!onClose);

  return (
    <div>
      {clickable && (
        <button
          className="cursor-pointer rounded-full"
          disabled={disableButton}
          onClick={() => {
            setIsPopupOpen(true);
          }}
        >
          {clickable}
        </button>
      )}
      {isPopupOpen && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <div
            className="absolute z-popup-bg h-full w-full bg-black opacity-50 backdrop-blur-md"
            onClick={() => {
              onClose ? onClose() : setIsPopupOpen(false);
            }}
          ></div>
          <div className="z-popup">{children}</div>
        </div>
      )}
    </div>
  );
}
