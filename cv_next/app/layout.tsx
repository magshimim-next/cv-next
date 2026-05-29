import "./globals.css";
import { Inter } from "next/font/google";
import { Viewport } from "next/dist/lib/metadata/types/metadata-interface";
import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/pageFooter";
import { ThemeProvider } from "@/providers/theme-provider";
import { CvsProvider } from "@/providers/cvs-provider";
import { ErrorProvider } from "@/providers/error-provider";
import { InactivityProvider } from "@/providers/inactivity-provider";
import { AccessibilityWidget } from "@/components/ui/accessibility-widget";

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

/**
 * Root layout wrapping every page. Mounts global providers (error handling,
 * theming, CV state, inactivity timeout) and renders the shared navbar and footer.
 * @param {RootLayoutProps} root0 - Component props.
 * @param {React.ReactNode} root0.children - The active page content.
 * @returns {JSX.Element} The layout component wrapping the page content and shared UI.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gradient flex min-h-screen flex-col bg-background text-primary`}
      >
        <ErrorProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CvsProvider>
              <InactivityProvider>
                <Navbar />
                <div className="container mx-auto w-full space-y-8 p-6 lg:max-w-[85%]">
                  {children}
                </div>
                <Footer />
                <AccessibilityWidget />
              </InactivityProvider>
            </CvsProvider>
          </ThemeProvider>
        </ErrorProvider>
      </body>
    </html>
  );
}
