"use client";
import CommentModel from "@/app/models/comment";
import UserModel from "@/app/models/user";
import FirebaseHelper from "@/app/services/firebaseHelper";
import React, { useState, useEffect } from "react";

export default function LogIn() {
  const [isLoginLoaded, setLoginLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      /*let comment = new CommentModel("654321", "111", "test", false, false, undefined, undefined);
      await FirebaseHelper.addNewComment(comment);
      let comments = await FirebaseHelper.getAllCommentsByUserId("111");
      if(comments !== null){
        let comment = comments.at(0);
        if(comment !== undefined){
        comment?.updateData("my new data");
        await FirebaseHelper.updateComment(comment);
        }
      }*/
      let res = await FirebaseHelper.getUserByName("ethan");
      let res1 = await FirebaseHelper.getUserByName("EthanKr");
      let res3 = await FirebaseHelper.getAllUsers();

      let res2 = await FirebaseHelper.getUserByEmail("eitankr1@cyber.org.il");
      if(res2 !== null && res2.length > 0){
        res2.at(0)?.updateName("test!!!");
        let resres = await FirebaseHelper.updateUser(res2.at(0)!);
        console.log(resres);
      }

      let user = new UserModel("1234","EthanKr", "eitankr1@cyber.org.il", true);
      let res4 = await FirebaseHelper.addNewUser(user);
      
      console.log(res4);
    }

    if (!isLoginLoaded) {
      console.log(isLoginLoaded);
      setLoginLoaded(true);
      FirebaseHelper.getAuthUI();

      fetchData();
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
