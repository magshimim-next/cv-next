"use client";
import React from "react";

export default function Tooltip({ message, id }: { message: string; id: any }) {
  return (
    <div
      id={id}
      role="tooltip"
      className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
    >
      {message}
      <div className="tooltip-arrow" data-popper-arrow></div>
    </div>
  );
}
