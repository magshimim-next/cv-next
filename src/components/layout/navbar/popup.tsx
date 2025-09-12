"use client";
import Image from "next/image";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { IoCloseSharp } from "react-icons/io5";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { useUser } from "@/hooks/useUser";

const navLinks = [
  {
    route: "Login",
    path: "/login",
    req_login: false,
    req_admin: false,
  },
  {
    route: "Upload",
    path: "/upload",
    req_login: true,
    req_admin: false,
  },
  {
    route: "Admin",
    path: "/admin",
    req_login: true,
    req_admin: true,
  },
  {
    route: "Signout",
    path: "/signout",
    req_login: true,
    req_admin: false,
  },
];

interface PopupProps {
  closeCb: () => void;
}

const UserDataComponent: React.FC<{
  closeCb: () => void;
}> = ({ closeCb }) => {
  const { userData } = useUser();
  return (
    <div className="mt-10 flex w-full flex-col items-center">
      {userData ? (
        <div className="flex w-full flex-col items-center">
          <div className="mb-4">
            <DynamicProfileImage
              isPlaceholder={userData.avatar_url ? false : true}
            >
              <Image
                alt="profile"
                src={userData?.avatar_url || ""}
                width={30}
                height={30 * 1.4142}
                className="w-20"
              ></Image>
            </DynamicProfileImage>
          </div>

          <Link
            className="text-lg font-medium hover:underline"
            href={`/profile/${userData?.username}`}
            onClick={closeCb}
          >
            {userData.display_name || userData.username}
          </Link>
        </div>
      ) : (
        <div style={{ marginBottom: "10px" }}>
          <DynamicProfileImage isPlaceholder={true} />
        </div>
      )}
    </div>
  );
};

export default function Popup({ closeCb }: PopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { userData, userIsAdmin, mutateUser: _mutateUser } = useUser();

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.show();
    }
  }, []);

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
          <IoCloseSharp size={30} />
        </div>
        <ul className="mt-20 flex w-full flex-col items-center">
          <div className="mt-10 flex w-full flex-col items-center">
            <UserDataComponent closeCb={closeCb} />
            {navLinks
              .filter((link) => {
                if (link.req_admin) return userIsAdmin;
                if (link.req_login) return userData;
                return !userData;
              })
              .map((link) => (
                <li key={link.route}>
                  <Link
                    className="text-lg font-medium hover:underline"
                    href={link.path}
                    onClick={closeCb}
                  >
                    {link.route}
                  </Link>
                </li>
              ))}
          </div>
        </ul>
      </dialog>
    </div>
  );
}
