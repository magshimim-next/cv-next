"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/ui/mode-toggle"
import settignsIcon from "../../public/images/settigns.png"
import Image from "next/image"
import Popup from "./popup"

const navLinks = [
  {
    route: "Home",
    path: "/",
  },
  {
    route: "Feed",
    path: "/feed",
  }
]

export default function Navbar() {
  const [isNavbarMenuOpen, setIsNavbarMenuOpen] = useState(false)
  const [isSettignsOpen, setIsSettignsOpen] = useState(false)


  const handleClick = async () => {
    setIsNavbarMenuOpen(false)
  }

  useEffect(() => {
    if (isSettignsOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [isSettignsOpen])

  return <>
    <header className="select-none top-0 w-full h-[72px] relative">
      <div className="h-[36px] top-0 w-full fixed translate-y-2/4 bg-white -z-50" />
      <div className="fixed h-[72px] top-0 w-full z-40 backdrop-blur-2xl bg-black bg-opacity-75">      </div>
      <div className="fixed h-[72px] top-0 w-full z-50">
        <nav className="mx-auto justify-between px-4 md:flex md:items-center md:px-8 lg:max-w-7xl">
          <div>
            <div className="flex items-center justify-between py-3 md:block md:py-5">
              <Link href="/" onClick={handleClick}>
                <h1 className="text-2xl font-bold duration-200 lg:hover:scale-[1.10] text-white">
                  CV-NEXT
                </h1>
              </Link>
              <div className="flex gap-1 md:hidden">
                <button
                  className="rounded-md p-2 text-primary outline-none focus:border focus:border-primary"
                  aria-label="Hamburger Menu"
                  onClick={() => setIsNavbarMenuOpen(!isNavbarMenuOpen)}
                >
                  {isNavbarMenuOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 "
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
                <ModeToggle />
              </div>
            </div>
          </div>
          <div className="reletive">
            <div
              className={`absolute left-0 right-0 z-10 m-auto justify-self-center rounded-md border-2 p-4 md:static md:mt-0 md:block md:border-none md:p-0 backdrop-blur-xl ${
                isNavbarMenuOpen ? "block" : "hidden"
              }`}
              style={{ width: "100%", maxWidth: "20rem" }}
            >
              <div className={`absolute bg-black ${isNavbarMenuOpen ? "block" : "hidden"} w-full h-full top-0 left-0 -z-10 opacity-60 rounded-md md:w-0`}></div>
              <ul className="flex flex-col items-center space-y-4 text-primary md:flex-row md:space-x-6 md:space-y-0">
                {navLinks.map((link) => (
                  <li key={link.route}>
                    <Link
                      className="text-lg text-white font-medium hover:underline"
                      href={link.path}
                      onClick={handleClick}
                    >
                      {link.route}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="hidden md:flex flex-row align-middle justify-evenly h-[40px] space-x-5">
            <ModeToggle />
            <div className="cursor-pointer hover:bg-[#27374e] rounded-full">
              <Image alt="settings" height={40} width={40} src={settignsIcon} onClick={() => setIsSettignsOpen(!isSettignsOpen)}></Image>
            </div>
          </div>
          {
            isSettignsOpen && <Popup closeCb={()=> setIsSettignsOpen(false)}></Popup>
          }
        </nav>
      </div>
    </header>
  </> 
}
