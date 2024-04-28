"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/layout/navbar/mode-toggle";
import { PopupToggle } from "./popup-toggle";

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
  return (
    <>
      <header className="relative top-0 h-[72px] w-full select-none">
        <div className="fixed top-0 -z-50 h-[36px] w-full translate-y-2/4 bg-white" />
        <div className="fixed top-0 z-40 h-[72px] w-full bg-black bg-opacity-75 backdrop-blur-2xl">
          {" "}
        </div>
        <div className="fixed top-0 z-50 h-[72px] w-full">
          <nav className="mx-auto justify-between px-4 md:flex md:items-center md:px-8 lg:max-w-7xl">
            <div className="flex items-center justify-between py-3 md:block md:py-5">
              <Link href="/">
                <h1 className="text-2xl font-bold text-white duration-200 lg:hover:scale-[1.10]">
                  CV-NEXT
                </h1>
              </Link>
            </div>
            <div className="reletive">
              <div
                className={`absolute left-0 right-0 z-10 m-auto hidden justify-self-center rounded-md border-2 p-4 backdrop-blur-xl md:static md:mt-0 md:block md:border-none md:p-0`}
                style={{ width: "100%", maxWidth: "20rem" }}
              >
                <div
                  className={`absolute left-0 top-0 -z-10 hidden h-full w-full rounded-md bg-black opacity-60 md:w-0`}
                ></div>
                <ul className="flex flex-col items-center space-y-4 text-primary md:flex-row md:space-x-6 md:space-y-0">
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
              </div>
            </div>

            <div className="hidden h-[40px] flex-row justify-evenly space-x-5 align-middle md:flex">
              <ModeToggle />
              <PopupToggle />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
