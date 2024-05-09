"use client";
import settignsIcon from "@/public/images/settigns.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import Popup from "./popup";
import { useSupabase } from "@/hooks/supabase";

export function PopupToggle() {
  const [isSettignsOpen, setIsSettignsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(settignsIcon);
  const [userData, setUserData] = useState<UserModel>(null);
  const [signedOut, setSignout] = useState(true);
  const supabase = useSupabase();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: connectedUser, error } = await supabase.auth.getUser();
      if (error || !connectedUser?.user) {
        setUserData(null);
        setProfileImage(settignsIcon);
      } else {
        setUserData(connectedUser);
        setProfileImage(connectedUser.user.user_metadata.avatar_url);
      }
    };
    fetchUser();
  }, [signedOut, supabase.auth]);

  return (
    <div>
      <div className="cursor-pointer rounded-full hover:bg-[#27374e]">
        <Image
          alt="settings"
          height={40}
          width={40}
          src={profileImage}
          onClick={() => setIsSettignsOpen(!isSettignsOpen)}
        ></Image>
      </div>
      {isSettignsOpen && (
        <Popup
          closeCb={() => setIsSettignsOpen(false)}
          userData={userData}
          updateSignOut={() => setSignout(!signedOut)}
        ></Popup>
      )}
    </div>
  );
}
