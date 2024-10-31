"use client";
import React, { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import Tooltip from "@/components/ui/tooltip";

export default function FirstTimeSignIn() {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  //const [isHovering, setIsHovering] = useState<boolean>(false);
  const superbase = createClientComponent();

  useEffect(() => {
    async function checkFirstLogin() {
      const user = (await superbase.auth.getUser()).data.user;
      if (!user) return; //TODO: maybe push to inactive page
      setIsFirstLogin(user.last_sign_in_at != user.created_at); //TODO: change to == (!= for debuging)
    }

    checkFirstLogin();
  }, [superbase.auth]);

  // const onHover = () => {
  //     setIsHovering(true);
  // };

  // const onLeave = () => {
  //     setIsHovering(false);
  // };

  return (
    <>
      {
        isFirstLogin && (
          // <div
          // onMouseEnter={onHover}
          // onMouseLeave={onLeave}>
          <Tooltip
            message="First time sign in? Change your username"
            id="firstTime"
          >
            <FaQuestionCircle />
          </Tooltip>
        )
        //</div>
      }
    </>
  );
}
