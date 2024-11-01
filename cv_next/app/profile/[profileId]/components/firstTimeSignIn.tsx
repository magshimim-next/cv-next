"use client";
import React, { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import Tooltip from "@/components/ui/tooltip";
import { getUser } from "@/app/actions/users/getUser";

export default function FirstTimeSignIn() {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const superbase = createClientComponent();

  useEffect(() => {
    async function checkFirstLogin() {
      const user = await getUser();
      if (!user.ok) return; //TODO: maybe push to inactive page

      const username = user.val.username;
      setIsFirstLogin(
        username !== undefined && username !== null && username.includes(".")
      );

      // const user = (await superbase.auth.getUser()).data.user;
      // if (!user) return; //TODO: maybe push to inactive page
      // setIsFirstLogin(user.last_sign_in_at != user.created_at); //TODO: change to == (!= for debuging)
    }

    checkFirstLogin();
  }, [superbase.auth]);

  return (
    <>
      {isFirstLogin && (
        <Tooltip
          message="First time sign in? Change your username"
          id="firstTime"
        >
          <FaQuestionCircle />
        </Tooltip>
      )}
    </>
  );
}
