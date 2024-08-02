"use client";
import Link from "next/link";
import { ModeToggle } from "@/components/layout/navbar/modeToggle";
import { PopupToggle } from "./popupToggle";
import { useState } from "react";

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

  return (
    <header className="fixed top-0 z-50 w-full select-none bg-black bg-opacity-75 backdrop-blur-2xl">
      <nav className="mx-auto flex items-center justify-between px-4 py-3 md:px-8 lg:max-w-7xl">
        <Link href="/">
          <h1 className="text-2xl font-bold text-white duration-200 md:text-3xl lg:text-4xl lg:hover:scale-110">
            CV-NEXT
          </h1>
        </Link>
        <div className="flex items-center space-x-4 md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
        <div className="hidden items-center space-x-4 md:flex">
          <ul className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <li key={link.route}>
                <Link
                  className="text-lg font-medium text-white hover:underline md:text-xl lg:text-2xl"
                  href={link.path}
                >
                  {link.route}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex space-x-5">
            <ModeToggle />
            <PopupToggle />
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="bg-black bg-opacity-75 p-4 md:hidden">
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.route}>
                <Link
                  className="text-lg font-medium text-white hover:underline"
                  href={link.path}
                >
                  {link.route}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <ModeToggle />
            <PopupToggle />
          </div>
        </div>
      )}
    </header>
  );
}
