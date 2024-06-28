"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Popup from "./popup";
import { getUserFromId } from "@/app/actions/user/fetchUserInfo";
import { FaUserCircle } from "react-icons/fa";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";

export function PopupToggle() {
  const [profileImage, setProfileImage] = useState<string>("");
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [signedIn, setSignIn] = useState(false);
  const supabase = createClientComponent();
  const defaultProfileIcon = (
    <FaUserCircle size={40} style={{ color: "#FFF" }} />
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data: connectedUser, error } = await supabase.auth.getUser();
      if (error || !connectedUser?.user) {
        setUserData(null);
        setProfileImage("");
      } else {
        const currentUserObject = await getUserFromId(connectedUser.user.id);
        if (currentUserObject) {
          setUserData(currentUserObject);
          setProfileImage(currentUserObject.avatar_url || "");
          setSignIn(true);
        } else {
          setUserData(null);
          setProfileImage("");
        }
      }
    };
    fetchUser();
  }, [signedIn, supabase.auth]);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  return (
    <div>
      <div className="cursor-pointer rounded-full hover:bg-[#27374e]">
        {profileImage ? (
          <Image
            alt="profile"
            height={40}
            width={40}
            src={profileImage}
            onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
          ></Image>
        ) : (
          <div onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}>
            {defaultProfileIcon}
          </div>
        )}
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
