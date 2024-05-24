"use client";
import profileIcon from "@/public/images/profile.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import Popup from "./popup";
import { useSupabase } from "@/hooks/supabase";
import { getUser } from "@/app/actions/users/getUser";
import { StaticImageData } from "next/image";

export function PopupToggle() {
  const [profileImage, setProfileImage] = useState<string | StaticImageData>(
    profileIcon
  );
  const [userData, setUserData] = useState<any>(null);
  const [signedOut, setSignout] = useState(true);
  const supabase = useSupabase();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: connectedUser, error } = await supabase.auth.getUser();
      if (error || !connectedUser?.user) {
        setUserData(null);
        setProfileImage(profileIcon);
      } else {
        const result = await getUser(connectedUser.user.id);
        if (result.ok) {
          setUserData(result.val);
          setProfileImage(result.val.avatar_url || profileIcon);
        }
      }
    };
    fetchUser();
  }, [signedOut, supabase.auth]);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  return (
    <div>
      <div className="cursor-pointer rounded-full hover:bg-[#27374e]">
        <Image
          alt="profile"
          height={40}
          width={40}
          src={profileImage}
          onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
        ></Image>
      </div>
      {isProfilePopupOpen && (
        <Popup
          closeCb={() => setIsProfilePopupOpen(false)}
          userData={userData}
          updateSignOut={() => setSignout(!signedOut)}
        ></Popup>
      )}
    </div>
  );
}
