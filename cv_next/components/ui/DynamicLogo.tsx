"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { ThemeManager } from "@/app/themeManager/themeManager";

export default function DynamicLogo({
  width = 40,
  height = 40,
  className = "",
  alt = "Logo",
}: {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}) {
  const { theme } = useTheme();
  const themeManagerRef = useRef<ThemeManager>();
  const [logo, setLogo] = useState<any>(null);

  useEffect(() => {
    if (!themeManagerRef.current) {
      themeManagerRef.current = new ThemeManager("dark");
    }

    if (theme) {
      const currentTheme = theme === "light" ? "light" : "dark";
      themeManagerRef.current.setTheme(currentTheme);
      const currentLogo = themeManagerRef.current.getIcons().logo;
      setLogo(currentLogo);
    }
  }, [theme]);

  if (!logo) return null;

  return (
    <Image
      src={logo}
      width={width}
      height={height}
      className={className}
      alt={alt}
      priority
    />
  );
}
