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
      }
    }

    checkFirstLogin();
  }, [superbase.auth]);

  return (
    <>
      {isFirstLogin && (
        <Tooltip
          message={"First time signing in?\nChange your username"}
          id="firstTime"
          styleCSS="whitespace-pre"
        >
          <FaQuestionCircle />
        </Tooltip>
      )}
    </>
  );
}
