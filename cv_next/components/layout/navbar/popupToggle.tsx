"use client";
import profileIcon from "@/public/images/profile.png";
import Image, { StaticImageData } from "next/image";
import { useState, useEffect } from "react";
import Popup from "./popup";
import { useSupabase } from "@/hooks/supabase";
import { getUserFromId } from "@/app/actions/user/fetchUserInfo";

export function PopupToggle() {
  const [profileImage, setProfileImage] = useState<StaticImageData | string>(
    profileIcon
  );
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [signedIn, setSignIn] = useState(false);
  const supabase = useSupabase();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: connectedUser, error } = await supabase.auth.getUser();
      if (error || !connectedUser?.user) {
        setUserData(null);
        setProfileImage(profileIcon);
      } else {
        const currentUserObject = await getUserFromId(connectedUser.user.id);
        if (currentUserObject) {
          setUserData(currentUserObject);
          setProfileImage(currentUserObject.avatar_url || profileIcon);
          setSignIn(true);
        } else {
          setUserData(null);
          setProfileImage(profileIcon);
        }
      }
    };
    fetchUser();
  }, [signedIn, supabase.auth]);
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
          updateSignIn={() => setSignIn(!signedIn)}
        ></Popup>
      )}
    </div>
  );
}
