"use client";
//import Image from "next/image";
import { useRef, useEffect } from "react";
//import Link from "next/link";
import { IoCloseSharp } from "react-icons/io5";
//import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { useUser } from "@/hooks/useUser";
// import { NewUsernameForm } from "@/app/first_login/[profileUsername]/components/newUsernameForm";
import UploadSelector from "./UploadSelector";

/* const navLinks = [
  {
    route: "Login",
    path: "/login",
    req_login: false,
  },
  {
    route: "Upload",
    path: "/upload",
    req_login: true,
  },
  {
    route: "Hall of Fame",
    path: "/hall",
    req_login: true,
  },
  {
    route: "Signout",
    path: "/signout",
    req_login: true,
  },
];

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
}; */

interface PopupProps {
  closeCb: () => void;
}

export default function Popup({ closeCb }: PopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { userData, mutateUser } = useUser();

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.show();
    }
  }, []);

  const handleUploadComplete = () => {
    mutateUser();
    closeCb();
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        className="absolute h-full w-full bg-black opacity-50"
        onClick={closeCb}
      ></div>

      <dialog
        ref={dialogRef}
        className="relative h-[500px] w-[800px] rounded-xl border-2 border-black backdrop-blur-2xl"
      >
        <div
          className="absolute left-5 top-5 h-7 w-7 cursor-pointer"
          onClick={closeCb}
        >
          <IoCloseSharp size={30} />
        </div>
        <div className="mt-20 flex w-full flex-col items-center">
          {userData && (
            <div className="mt-10 flex w-full flex-col items-center">
              <UploadSelector
                user={userData}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
