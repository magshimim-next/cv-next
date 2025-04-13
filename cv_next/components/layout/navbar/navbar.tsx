"use client";
import Link from "next/link";
import { Upload } from "lucide-react";
import { ModeToggle } from "@/components/layout/navbar/modeToggle";
import Tooltip from "@/components/ui/tooltip";
import DynamicLogo from "@/components/ui/DynamicLogo";
import { PopupToggle } from "./popupToggle";

export default function Navbar() {
  return (
    <>
      <header className="relative top-0 h-[4.5rem] w-full select-none">
        <div className="fixed top-0 -z-50 h-[2.25rem] w-full translate-y-2/4 bg-white" />
        <div className="fixed top-0 z-40 h-[4.5rem] w-full bg-black bg-opacity-75 backdrop-blur-2xl" />
        <div className="fixed top-0 z-50 h-[4.5rem] w-full">
          <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative mr-1 h-10 w-[60px]">
                  <DynamicLogo
                    width={70}
                    height={70}
                    className="h-full w-full object-contain"
                    alt="Logo"
                  />
                </div>
                <span className="text-2xl font-bold leading-none text-white">
                  NEXT
                </span>
              </Link>
              <div className="ml-4 flex items-center">
                <ModeToggle />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="z-50 hidden space-x-4 md:flex">
                <Link className="py-2 text-lg leading-6" href="/upload">
                  <Tooltip
                    id="Upload Icon"
                    message="Upload CV"
                    styleCSS="whitespace-nowrap"
                  >
                    <Upload />
                  </Tooltip>
                </Link>
                <PopupToggle />
              </div>

              <div className="flex md:hidden">
                <PopupToggle />
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
