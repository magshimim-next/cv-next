"use client";

import { ThemeManager } from "@/app/themeManager/themeManager";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { createContext } from "react";

// export const themeContext = createContext({themeManager: new ThemeManager('dark')})

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // const app = <div>
  //   <NextThemesProvider {...props}>{children}</NextThemesProvider>;
  // </div>
  // // const themeManager = new ThemeManager('dark', app)
  return  <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
