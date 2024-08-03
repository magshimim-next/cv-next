"use client";
import Link from "next/link";
import { ModeToggle } from "@/components/layout/navbar/modeToggle";
import { PopupToggle } from "./popupToggle";
import { useState, useRef } from "react";

const navLinks = [
  {
    route: "Home",
    path: "/",
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
      <header className="relative top-0 h-[72px] w-full select-none">
        <div className="fixed top-0 -z-50 h-[36px] w-full translate-y-2/4 bg-white" />
        <div className="fixed top-0 z-40 h-[72px] w-full bg-black bg-opacity-75 backdrop-blur-2xl" />
        <div className="fixed top-0 z-50 h-[72px] w-full">
          <nav className="mx-auto flex items-center justify-between px-4 py-3 md:px-8 lg:max-w-7xl">
            <Link href="/">
              <h1 className="text-2xl font-bold text-white duration-200 lg:hover:scale-[1.10]">
                CV-NEXT
              </h1>
            </Link>

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
              <div className="hidden space-x-4 md:flex">
                <ModeToggle />
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
            className="fixed left-0 right-0 top-[72px] bg-slate-500 bg-opacity-75 p-4 backdrop-blur-2xl dark:bg-black md:hidden"
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
              <ModeToggle />
              <PopupToggle closeHamburger={handleClick} />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
