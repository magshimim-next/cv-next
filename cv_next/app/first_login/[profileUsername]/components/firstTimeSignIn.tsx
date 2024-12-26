"use client";
import React, { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { createClientComponent } from "@/helpers/supabaseBrowserHelper";
import Tooltip from "@/components/ui/tooltip";
import { getFirstTimeLogin } from "@/app/actions/users/getUser";

export default function FirstTimeSignIn() {
  const [isFirstLogin, setIsFirstLogin] = useState<Boolean>(false);
  const superbase = createClientComponent();

  useEffect(() => {
    async function checkFirstLogin() {
      const res = await getFirstTimeLogin();
      if (res.ok) {
        setIsFirstLogin(res.val);
      } else {
        //TODO: push to inactive page
      }
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
