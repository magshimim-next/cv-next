"use client";
import { useTheme } from "next-themes";
import React from "react";

interface ThemeImageProps {
  children?: React.ReactNode;
  isPlaceholder: boolean;
}

const DynamicProfileImage: React.FC<ThemeImageProps> = ({
  children,
  isPlaceholder,
}) => {
  const { theme } = useTheme();
  const matchThemePlaceholderImage =
    theme == "dark" || theme == undefined
      ? { filter: "invert(0)" }
      : { filter: "invert(1)" };

  if (isPlaceholder) {
    return <div style={matchThemePlaceholderImage}>{children}</div>;
  } else {
    return <div>{children}</div>;
  }
};

export default DynamicProfileImage;
