"use client";
import React, { useState } from "react";

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
    <div
      className={`mb-3 rounded-lg border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800`}
      style={{ width: "100%" }}
    >
      <button
        onClick={toggleDropdown}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "0.5rem",
          backgroundColor: "inherit",
          border: "none",
          cursor: "pointer",
          textAlign: "center",
        }}
        className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white"
      >
        {title}
        <span
          style={{
            marginLeft: "8px",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          ➤
        </span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? "500px" : "0",
          transition: "max-height 0.3s ease",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "0.5rem" }}>{children}</div>
      </div>
    </div>
  );
};

export default DropdownCover;
