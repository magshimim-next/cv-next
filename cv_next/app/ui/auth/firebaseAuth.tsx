"use client";
import FirebaseAuthHelper from "@/app/services/firebaseAuthHelper";
import React, { useState, useEffect } from "react";

export default function FirebaseAuthComp() {
  const [isLoginLoaded, setLoginLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoginLoaded) {
      console.log(isLoginLoaded);
      setLoginLoaded(true);
      let ui = FirebaseAuthHelper.getAuthUI();
      ui.start(
        "#firebaseui-auth-container",
        FirebaseAuthHelper.getAuthUiConfig()
      );
    }
  }, []);

  return (
    <div>
      <div id="firebaseui-auth-container" style={{height:"10"}}></div>
      <div id="loader">Loading...</div>
    </div>
  );
}
