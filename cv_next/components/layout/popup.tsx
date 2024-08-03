"use client"

import Image from "next/image";
import settignsIcon from "../../public/images/closeIcon.png"
import Link from "next/link";
import { routes } from "@/lib/definitions";
import { uiLocation } from "@/lib/definitions";

interface PopupProps {
  closeCb: () => void;
}

export default function Popup({ closeCb }: PopupProps) {
  return <div className="fixed top-0 w-full left-0 h-full flex justify-center items-center">
    <div className="absolute w-full h-full bg-black opacity-20"></div>
    <div className="relative w-[400px] h-[500px] border-black border-2 backdrop-blur-2xl rounded-xl">
      <div className="absolute top-5 left-5 h-7 w-7 cursor-pointer" onClick={closeCb}>
        <Image alt="closeIcon" src={settignsIcon}></Image>
      </div>
      <ul className="flex flex-col items-center w-full mt-10">
        {routes.filter(link => link.UILocation === uiLocation.profile).map((link) => (
          <li key={link.route}>
            <Link className="text-lg text-white font-medium hover:underline" href={link.path} onClick={closeCb} >
              {link.route}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
}
