import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/navbar/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { CvsProvider } from "@/providers/cvsProvider";
import SupabaseProvider from "@/providers/supabase-provider";
import { Viewport } from "next/dist/lib/metadata/types/metadata-interface";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gradient flex min-h-screen flex-col bg-background text-primary`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CvsProvider>
            <SupabaseProvider>
              <Navbar />
              <div className="container mx-auto space-y-8 p-6">{children}</div>
            </SupabaseProvider>
          </CvsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
