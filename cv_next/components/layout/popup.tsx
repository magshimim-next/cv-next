"use client"

import Image from "next/image"
import settignsIcon from "../../public/images/closeIcon.png"
import Link from "next/link"

const navLinks = [
  {
    route: "Login",
    path: "/login",
  },
  {
    route: "Signout",
    path: "/logout",
  },
]

interface PopupProps {
  closeCb: () => void
}

export default function Popup({ closeCb }: PopupProps) {
  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div className="absolute h-full w-full bg-black opacity-20"></div>
      <div className="relative h-[500px] w-[400px] rounded-xl border-2 border-black backdrop-blur-2xl">
        <div
          className="absolute left-5 top-5 h-7 w-7 cursor-pointer"
          onClick={closeCb}
        >
          <Image alt="closeIcon" src={settignsIcon}></Image>
        </div>
        <ul className="mt-10 flex w-full flex-col items-center">
          {navLinks.map((link) => (
            <li key={link.route}>
              <Link
                className="text-lg font-medium text-white hover:underline"
                href={link.path}
                onClick={closeCb}
              >
                {link.route}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
