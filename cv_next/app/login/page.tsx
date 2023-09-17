"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import FirebaseAuthHelper from "../../server/api/firebaseAuthHelper";
import MyLogger from "../../server/base/logger";
import UserModel from "../../types/models/user";
import UsersApi from "../../server/api/users";
import { ErrorReasons } from "../../server/api/utils"

const DynamicAuthUIComponent = dynamic(
  () => import("../../components/ui/auth"),
  { ssr: false }
);

export default function LoginPage()
{
  const router = useRouter();

  FirebaseAuthHelper.getFirebaseAuthInstance().onAuthStateChanged(async (user) => {
  MyLogger.logInfo("login change", user);
    if (user) {
      // User is logged in
      console.log("Gmail user authenticated with Firebase");

      let loggedUser = new UserModel(user.uid, user.displayName || '{}', user.email || '{}', 0, false);
      let res = await UsersApi.addNewUser(loggedUser);
      if(res.success)
      {
        console.log("New user was created but by default is inactive");
      }
      else if(res.reason == ErrorReasons.emailExists)
      {
        let existingUser = await UsersApi.getUserByEmail(loggedUser.email, true);
        if(existingUser !== null && existingUser.length > 0)
        {
          console.log("Existing user is active");
          loggedUser.updateActiveValue(true);
          FirebaseAuthHelper.setLoggedUser(loggedUser);
          router.push("/activated");
        }
        else
        {
          console.log("Existing user is inactive");
        }
      }
      else
      {
        console.log("An unexpected error");
      }
    } else {
      // User is not logged in
      console.log("Gmail user not authenticated with Firebase");
    } 
  });
  return (
    <div>
      <h1>LogIn</h1>
      <DynamicAuthUIComponent />
    </div>
  );
}
