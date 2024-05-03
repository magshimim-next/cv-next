"use client";

import Image from "next/image";
import closeIcon from "@/public/images/closeIcon.png";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { useSupabase } from "@/hooks/supabase";

const navLinks = [
  {
    route: "Login",
    path: "/login",
  },
  {
    route: "Signout",
    path: "/",
  },
];

interface PopupProps {
  closeCb: () => void;
}

export default function Popup({ closeCb }: PopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.show();
    }
  }, []);
  const supabase = useSupabase();

  const handleSelection = (route: string) => {
    if (route === "Signout") {
      supabase.auth.signOut();
    }
    closeCb();
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        className="absolute h-full w-full bg-black opacity-20"
        onClick={closeCb}
      ></div>

      <dialog
        ref={dialogRef}
        className="relative h-[500px] w-[400px] rounded-xl border-2 border-black backdrop-blur-2xl"
      >
        <div
          className="absolute left-5 top-5 h-7 w-7 cursor-pointer"
          onClick={closeCb}
        >
          <Image alt="closeIcon" src={closeIcon}></Image>
        </div>
        <ul className="mt-10 flex w-full flex-col items-center">
          {navLinks.map((link) => (
            <li key={link.route}>
              <Link
                className="text-lg font-medium hover:underline"
                href={link.path}
                onClick={() => handleSelection(link.route)}
              >
                {link.route}
              </Link>
            </li>
          ))}
        </ul>
      </dialog>
    </div>
    /*
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div className="absolute h-full w-full bg-black opacity-20"></div>
      <div className="relative h-[500px] w-[400px] rounded-xl border-2 border-black backdrop-blur-2xl">
        <div
          className="absolute left-5 top-5 h-7 w-7 cursor-pointer"
          onClick={closeCb}
        >
          <Image alt="closeIcon" src={closeIcon}></Image>
        </div>
        <ul className="mt-10 flex w-full flex-col items-center">
          {navLinks.map((link) => (
            <li key={link.route}>
              <Link
                className="text-lg font-medium text-white hover:underline"
                href={link.path}
                onClick={() => handleSelection(link.route)}
              >
                {link.route}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>*/
  );
}
