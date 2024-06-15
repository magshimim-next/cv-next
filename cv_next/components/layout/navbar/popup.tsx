"use client";

import Image from "next/image";
import closeIcon from "@/public/images/closeIcon.png";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { useSupabase } from "@/hooks/supabase";
import profileIcon from "@/public/images/profile.png";
import { useTheme } from "next-themes";

const navLinks = [
  {
    route: "Login",
    path: "/login",
    req_login: false,
  },
  {
    route: "Feed",
    path: "/feed",
    req_login: true,
  },
  {
    route: "Signout",
    path: "/",
    req_login: true,
  },
];

interface PopupProps {
  closeCb: () => void;
  userData: UserModel | null;
  updateSignOut: () => void;
}

export default function Popup({
  closeCb,
  userData,
  updateSignOut,
}: PopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const supabase = useSupabase();
  const { theme } = useTheme();

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.show();
    }
  }, []);

  const handleSelection = (route: string) => {
    if (route === "Signout") {
      supabase.auth.signOut();
      updateSignOut();
    }
    closeCb();
  };

  const matchThemePlaceholderImage =
    theme == "dark" ? { filter: "invert(0)" } : { filter: "invert(1)" };

  const userDataComponent = userData ? (
    <div className="mt-10 flex w-full flex-col items-center">
      <Image
        alt="profile"
        src={userData.avatar_url ?? profileIcon}
        width={30}
        height={30 * 1.4142}
        className="w-20 rounded-lg p-2"
      ></Image>

      <Link
        className="text-lg font-medium hover:underline"
        href="/profile" // TODO: redirect to actual user's profile
        onClick={closeCb}
      >
        {userData.username || userData.full_name}
      </Link>
    </div>
  ) : (
    <div style={matchThemePlaceholderImage}>
      <Image
        alt="profile"
        src={profileIcon}
        width={10}
        height={10 * 1.4142}
        className="w-20 rounded-lg p-2"
      ></Image>
    </div>
  );

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
          {userData ? (
            <div className="mt-10 flex w-full flex-col items-center">
              {userDataComponent}
              {navLinks.map(
                (link) =>
                  link.req_login && (
                    <li key={link.route}>
                      <Link
                        className="text-lg font-medium hover:underline"
                        href={link.path}
                        onClick={() => {
                          handleSelection(link.route);
                        }}
                      >
                        {link.route}
                      </Link>
                    </li>
                  )
              )}
            </div>
          ) : (
            <div className="mt-10 flex w-full flex-col items-center">
              {userDataComponent}
              {navLinks.map(
                (link) =>
                  !link.req_login && (
                    <li key={link.route}>
                      <Link
                        className="text-lg font-medium hover:underline"
                        href={link.path}
                        onClick={() => {
                          handleSelection(link.route);
                        }}
                      >
                        {link.route}
                      </Link>
                    </li>
                  )
              )}
            </div>
          )}
        </ul>
      </dialog>
    </div>
  );
}
