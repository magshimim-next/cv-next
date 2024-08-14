"use client";
import Image from "next/image";
import { useRef, useEffect } from "react";
import Link from "next/link";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import { IoCloseSharp } from "react-icons/io5";
import { useApiFetch } from "@/hooks/useAPIFetch";
import { API_DEFINITIONS } from "@/lib/definitions";

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
    route: "Upload",
    path: "/upload",
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
  updateSignIn: () => void;
}

const UserDataComponent: React.FC<{
  userData: UserModel | null;
  closeCb: () => void;
}> = ({ userData, closeCb }) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center">
      {userData ? (
        <div className="flex w-full flex-col items-center">
          <div style={{ marginBottom: "10px" }}>
            <DynamicProfileImage
              isPlaceholder={userData.avatar_url ? false : true}
            >
              <Image
                alt="profile"
                src={userData?.avatar_url || ""}
                width={30}
                height={30 * 1.4142}
                className="w-20 rounded-lg p-2"
              ></Image>
            </DynamicProfileImage>
          </div>

          <Link
            className="text-lg font-medium hover:underline"
            href={`/profile/${userData?.id}`}
            onClick={closeCb}
          >
            {userData.username || userData.full_name}
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

export default function Popup({ closeCb, userData, updateSignIn }: PopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const supabase = createClientComponent();
  const fetchFromApi = useApiFetch();

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.show();
    }
  }, []);

  const handleSelection = async (route: string) => {
    if (route === "Signout") {
      await supabase.auth.signOut();
      await fetchFromApi(
        API_DEFINITIONS.USERS_API_BASE,
        API_DEFINITIONS.REVALIDATE_USERS_ENDPOINT,
        {}
      );
      updateSignIn();
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
          <IoCloseSharp size={30} />
        </div>
        <ul className="mt-20 flex w-full flex-col items-center">
          {userData ? (
            <div className="mt-10 flex w-full flex-col items-center">
              <UserDataComponent userData={userData} closeCb={closeCb} />
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
              <UserDataComponent userData={userData} closeCb={closeCb} />
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
