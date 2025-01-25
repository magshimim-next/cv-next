import logo from "@/public/images/logo.png";
import { Theme } from "../themeManager";

export const lightTheme: Theme = {
  styleVariables: {
    "background": "white",
    "text-color": "blue",
    "card-background": "white",
    "card-border": "white",

    "btn-background": "white",
    "btn-hover-background": "white",

    "input-background": "white",
    "input-border": "white",
  },
  icons: {
    logo,
  },
};
