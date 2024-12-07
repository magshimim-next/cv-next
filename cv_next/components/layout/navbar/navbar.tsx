"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/layout/navbar/modeToggle";
import { PopupToggle } from "./popupToggle";
import logo from "@/public/images/logo.png";

const navLinks = [
  {
    route: "Home",
    path: "/about",
  },
  {
    route: "Feed",
    path: "/feed",
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.relatedTarget as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

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
                  <Image
                    src={logo}
                    alt="Logo"
                    layout="fill"
                    objectFit="contain"
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

            <div className="hidden items-center space-x-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.route}
                  className="py-2 text-lg font-medium text-white hover:underline"
                  href={link.path}
                  style={{ lineHeight: "1.5" }}
                >
                  {link.route}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="z-50 hidden space-x-4 md:flex">
                <Link
                  className="py-2 text-lg"
                  href="/upload"
                  style={{ lineHeight: "1.5" }}
                >
                  <Upload />
                </Link>
                <PopupToggle />
              </div>
              <button
                ref={buttonRef}
                className="text-white focus:outline-none md:hidden"
                onClick={handleClick}
                onBlur={handleBlur}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
          </nav>
        </div>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="fixed left-0 right-0 top-[4.5rem] z-40 bg-slate-500 bg-opacity-75 p-4 opacity-95 backdrop-blur-2xl dark:bg-theme-800 md:hidden"
            tabIndex={-1}
          >
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.route}>
                  <Link
                    className="text-lg font-medium text-white hover:underline"
                    href={link.path}
                    onClick={handleClick}
                  >
                    {link.route}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between">
              <PopupToggle closeHamburger={handleClick} />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
