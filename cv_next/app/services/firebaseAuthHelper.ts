"use client";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import Definitions from "../base/definitions";
import MyLogger from "../base/logger";

// https://firebase.google.com/docs/web/setup#available-libraries

export default class FirebaseAuthHelper {
  private static firebaseAppInstance?: FirebaseApp;
  private static firebaseAuthInstance?: Auth;

  /**
   * Method initiates the firebase app if not initiated yet
   * @returns FirebaseApp instance
   */
  public static getFirebaseInstance(): FirebaseApp {
    if (
      FirebaseAuthHelper.firebaseAppInstance === null ||
      FirebaseAuthHelper.firebaseAppInstance === undefined
    ) {
      FirebaseAuthHelper.firebaseAppInstance = initializeApp(
        Definitions.FIREBASE_CONFIG
      );
    }
    return FirebaseAuthHelper.firebaseAppInstance;
  }

  /**
   * Method initiates the firebase app if not initiated yet
   * @returns FirebaseApp instance
   */
  public static getFirebaseAuthInstance(): Auth {
    if (
      FirebaseAuthHelper.firebaseAuthInstance === null ||
      FirebaseAuthHelper.firebaseAuthInstance === undefined
    ) {
      FirebaseAuthHelper.firebaseAuthInstance = getAuth(
        this.getFirebaseInstance()
      );
    }
    return FirebaseAuthHelper.firebaseAuthInstance;
  }

  public static getAuthUiConfig() {
    let config = {
      callbacks: {
        signInSuccessWithAuthResult: function (
          authResult: any,
          redirectUrl: any
        ) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          //MyLogger.logInfo("sign in", authResult);
          MyLogger.logInfo("sign in", authResult.user.email); //V
          MyLogger.logInfo("sign in", authResult.user.displayName); //V
          MyLogger.logInfo("sign in", authResult.additionalUserInfo.isNewUser); //V
          MyLogger.logInfo("sign in", authResult.credential); //V
          return false;
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          if (
            document.getElementById("loader") !== null &&
            document.getElementById("loader") !== undefined
          ) {
            document.getElementById("loader")!.style.display = "none";
          }
        },
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: "popup",
      //signInSuccessUrl: "<url-to-redirect-to-on-success>",

      signInOptions: [
        // List of OAuth providers supported.
        GoogleAuthProvider.PROVIDER_ID,
      ],
      tosUrl: "<your-tos-url>",
      // Privacy policy url.
      privacyPolicyUrl: "<your-privacy-policy-url>",
    };
    return config;
  }
}
