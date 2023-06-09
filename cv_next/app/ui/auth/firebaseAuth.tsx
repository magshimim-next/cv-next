"use client";
import MyLogger from "@/app/base/logger";
import FirebaseAuthHelper from "@/app/services/firebaseAuthHelper";
import React, { useState, useEffect, useRef } from "react";
var firebaseui = require("firebaseui");

function getAuthUI() {
  const auth = FirebaseAuthHelper.getFirebaseAuthInstance();
  return new firebaseui.auth.AuthUI(auth);
}

export default function FirebaseAuthComp() {
  const [isLoginLoaded, setLoginLoaded] = useState(false);

  const adjustSignInOptionsHeight = () => {
    const signInOptionsContainer = document.querySelector(
      ".firebaseui-idp-list"
    ) as HTMLElement;
    const signInOptions = signInOptionsContainer?.querySelectorAll(
      ".firebaseui-idp-button"
    ) as NodeListOf<HTMLElement>;

    const icons = signInOptionsContainer?.querySelectorAll(
      ".firebaseui-idp-icon"
    ) as NodeListOf<HTMLElement>;

    if (signInOptionsContainer && signInOptions) {
      let height = `${signInOptions.length}%`;
      signInOptionsContainer.style.height = height; // Set your desired height here

      signInOptions.forEach((option) => {
        option.style.height = "50px"; // Set your desired height here
      });

      icons.forEach((option) => {
        option.style.height = "40px"; // Set your desired height here
      });
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoginLoaded) {
      console.log(isLoginLoaded);
      setLoginLoaded(true);
      FirebaseAuthHelper.getFirebaseAuthInstance().onAuthStateChanged(
        (user) => {
          MyLogger.logInfo("login change", user);
          if (user) {
            // User is logged in
            console.log("User is logged in:", user);
            // Perform any necessary actions for logged-in user
          } else {
            // User is not logged in
            console.log("User is not logged in");
            // Perform any necessary actions for non-logged-in user
          }
        }
      );
      let ui = getAuthUI();
      ui.start(
        "#firebaseui-auth-container",
        FirebaseAuthHelper.getAuthUiConfig()
      );
    }

    adjustSignInOptionsHeight();
    window.addEventListener("resize", adjustSignInOptionsHeight);
    return () => {
      window.removeEventListener("resize", adjustSignInOptionsHeight);
    };
  }, []);

  return (
    <div style={{ margin: "10px" }}>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </div>
  );
}
