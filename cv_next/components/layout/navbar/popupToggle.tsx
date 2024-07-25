"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Popup from "./popup";
import DynamicProfileImage from "@/components/ui/DynamicProfileImage";
import { getUserModel } from "@/app/actions/users/getUser";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";

export function PopupToggle() {
  const [profileImage, setProfileImage] = useState<string>("");
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [signedIn, setSignIn] = useState(false);
  const supabase = createClientComponent();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: connectedUser, error } = await supabase.auth.getUser();
      if (error || !connectedUser?.user) {
        setUserData(null);
        setProfileImage("");
      } else {
        const currentUserObject = await getUserModel(connectedUser.user.id);
        if (currentUserObject.ok) {
          setUserData(currentUserObject.val);
          setProfileImage(currentUserObject.val.avatar_url || "");
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
        <div onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}>
          <DynamicProfileImage
            isPlaceholder={profileImage ? false : true}
            placeHolderStyle={{ fontSize: "40px", color: "#FFF" }}
          >
            <Image
              alt="profile"
              height={40}
              width={40}
              src={profileImage}
              onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
            />
          </DynamicProfileImage>
        </div>
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
