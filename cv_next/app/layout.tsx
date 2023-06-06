import "./globals.css";
import { Inter } from "next/font/google";

import ColorProvider from "./services/colorSchemeProvider";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "CV_NEXT",
  description: "A Resume peer-review platform",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en-US">
      <head />
      <body className={inter.className}>
        <ColorProvider>{children}</ColorProvider>
      </body>
    </html>
  );
}
