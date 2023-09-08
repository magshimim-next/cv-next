"use client";
import LandingLayout from "@/app/ui/landing/landingLayout";
import App from "next/app";
import { Router } from "next/router";
import FirebaseAuthHelper from "./services/firebaseAuthHelper";
import MyLogger from "./base/logger";
import UserModel from "./models/user";
import FirebaseHelper from "./services/firebaseHelper";

const _firebaseAuthHelper = new FirebaseAuthHelper();

export default class MyApp extends App {
  static firebaseAuthHelper = _firebaseAuthHelper;
  
  componentDidMount() {
    // Attach onAuthStateChanged listener
    MyApp.firebaseAuthHelper.getFirebaseAuthInstance().onAuthStateChanged(async (user) => {
      MyLogger.logInfo("login change", user);
      if (user) {
        // User is logged in
        console.log("Gmail user authenticated with Firebase");

        let loggedUser = new UserModel(user.uid, user.displayName || '{}', user.email || '{}', 0, false);
        let res = await FirebaseHelper.addNewUser(loggedUser);
        if(res.success)
        {
          console.log("New user was created but by default is inactive");
        }
        else if(res.reason == 2)
        {
          let existingUser = await FirebaseHelper.getUserByEmail(loggedUser.email, true);
          if(existingUser !== null && existingUser.length > 0)
          {
            console.log("Existing user is active");
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

    // Listen for route changes
    Router.events.on("routeChangeComplete", this.handleRouteChange);
  }

  componentWillUnmount() {
    // Remove the listener when the component is unmounted
    Router.events.off("routeChangeComplete", this.handleRouteChange);
  }

  handleRouteChange = () => {
    // Perform any necessary actions on route change
    console.log("Route changed");
  };

  render() {
    return (
      <main>
        <LandingLayout />
      </main>
    );
  }
}
