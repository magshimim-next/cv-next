import logo from "@/public/images/whiteLogo.png";
import { Theme } from "../themeManager";

export const darkTheme: Theme = {
  styleVariables: {
    "background": "var(--theme-100)",
    "text-color": "white",
    "card-background": "rgb(30 41 59)",
    "card-border": "white",

    "btn-background": "var(--theme-700)",
    "btn-hover-background": "var(--theme-400)",

    "input-background": "black",
    "input-border": "white",
  },
  icons: {
    logo,
  },
};
