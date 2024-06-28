"use client";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

interface ThemeImageProps {
  children?: React.ReactNode;
  placeHolderStyle?: React.CSSProperties;
  isPlaceholder: boolean;
}

const DynamicProfileImage: React.FC<ThemeImageProps> = ({
  children,
  isPlaceholder,
  placeHolderStyle,
}) => {
  const defaultProfileIcon = (
    <FaUserCircle style={placeHolderStyle || { fontSize: "70px" }} />
  );

  if (isPlaceholder) {
    return <div>{defaultProfileIcon}</div>;
  } else {
    return <div>{children}</div>;
  }
};

export default DynamicProfileImage;
