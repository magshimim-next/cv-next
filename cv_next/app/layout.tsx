import "./globals.css"
import { Inter } from "next/font/google"
import Navbar from "@/components/layout/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from '../components/authprovider/Authprovider'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-primary flex min-h-screen flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
