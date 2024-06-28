"use client";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

interface ThemeImageProps {
  children?: React.ReactNode;
  placeHolderSize?: number;
  isPlaceholder: boolean;
}

const DynamicProfileImage: React.FC<ThemeImageProps> = ({
  children,
  isPlaceholder,
  placeHolderSize,
}) => {
  const defaultProfileIcon = <FaUserCircle size={placeHolderSize || 70} />;

  if (isPlaceholder) {
    return <div>{defaultProfileIcon}</div>;
  } else {
    return <div>{children}</div>;
  }
};

export default DynamicProfileImage;
