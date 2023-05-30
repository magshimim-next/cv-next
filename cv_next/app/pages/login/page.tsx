"use client";
import FirebaseHelper from "@/app/services/firebaseHelper";
import React, { useState, useEffect } from "react";

export default function LogIn() {
  const [isLoginLoaded, setLoginLoaded] = useState(false);

  useEffect(() => {
    if (!isLoginLoaded) {
      console.log(isLoginLoaded);
      setLoginLoaded(true);
      FirebaseHelper.getAuthUI();
    }
  }, [isLoginLoaded]);

  return (
    <div>
      <h1>LogIn</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </div>
  );
}
