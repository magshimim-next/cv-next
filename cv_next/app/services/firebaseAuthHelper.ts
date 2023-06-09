"use client";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
var firebaseui = require("firebaseui");

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXgXEklKuIjzHAb2LJn8fkEgj_GLBL64A",
  authDomain: "cv-next.firebaseapp.com",
  projectId: "cv-next",
  storageBucket: "cv-next.appspot.com",
  messagingSenderId: "447291460762",
  appId: "1:447291460762:web:7e8c9cf3726ef31e372323",
};

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
      FirebaseAuthHelper.firebaseAppInstance = initializeApp(firebaseConfig);
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
          console.log(authResult);
          console.log(authResult.user);
          console.log(authResult.credential);
          console.log(authResult.additionalUserInfo);
          return true;
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
      signInSuccessUrl: "<url-to-redirect-to-on-success>",

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

  public static getAuthUI() {
    const auth = FirebaseAuthHelper.getFirebaseAuthInstance();
    return new firebaseui.auth.AuthUI(auth);
  }
}
