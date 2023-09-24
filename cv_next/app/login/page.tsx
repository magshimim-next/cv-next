"use client";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';
import FirebaseAuthHelper from "../../server/api/firebaseAuthHelper";
import MyLogger from "../../server/base/logger";
import UserModel from "../../types/models/user";
import UsersApi from "../../server/api/users";
import { ErrorReasons } from "../../server/api/utils"
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserActiveContext = createContext(0);

export function useUserActive() {
  return useContext(UserActiveContext);
}

const DynamicAuthUIComponent = dynamic(
  () => import("../../components/ui/auth"),
  { ssr: false }
);

export default function LoginPage()
{
  const router = useRouter();
  const [userActive, setUserActive] = useState(0);

  FirebaseAuthHelper.getFirebaseAuthInstance().onAuthStateChanged(async (user) => {
  MyLogger.logInfo("login change", user);
    if (user) {
      // User is logged in
      console.log("Gmail user authenticated with Firebase");

      let loggedUser = new UserModel(user.uid, user.displayName || '{}', user.email || '{}', 0);
      let res = await UsersApi.addNewUser(loggedUser);
      if(res.success)
      {
        setUserActive(0);
        console.log("New user was created but by default is inactive");
      }
      else if(res.reason == ErrorReasons.emailExists)
      {
        let existingUser = await UsersApi.getUserByEmail(loggedUser.email, true);
        if(existingUser !== null && existingUser.length > 0)
        {
          setUserActive(existingUser[0].getUserType());
          console.log("Existing user is active - %d %d", userActive, existingUser[0].getUserType());
          router.push("/activated");
        }
        else
        {
          setUserActive(0);
          console.log("Existing user is inactive");
        }
      }
      else
      {
        setUserActive(0);
        console.log("An unexpected error");
      }
    } else {
      // User is not logged in
      setUserActive(0);
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
