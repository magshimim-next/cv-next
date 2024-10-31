"use client";
import { useState } from "react";

export default function Tooltip({
  message,
  id,
  children,
}: {
  message: string;
  id: any;
  children: JSX.Element;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          {children}
        </div>

        <div
          id={id}
          role="tooltip"
          className={`tooltip absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-opacity duration-300 dark:bg-gray-700 ${
            visible ? "opacity-100" : "opacity-0"
          } left-1/2 -translate-x-1/2 transform`}
        >
          {message}
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
    </>
  );
}
