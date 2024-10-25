"use client";
import { useState } from "react";

type DropdownProps = {
  title: string;
  children: React.ReactNode;
};

const DropdownCover: React.FC<DropdownProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-3 w-full rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800">
      <button
        onClick={toggleDropdown}
        className="flex w-full cursor-pointer items-center justify-center border-none bg-inherit p-2 text-xl font-semibold text-gray-900 dark:text-white"
      >
        {title}
        <span
          className={`ml-2 transform transition-transform duration-300 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          ➤
        </span>
      </button>
      <div
        className={`transition-max-height overflow-hidden duration-300 ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};

export default DropdownCover;
