"use client";
import CommentModel from "@/app/models/comment";
import FirebaseHelper from "@/app/services/firebaseHelper";
import React, { useState, useEffect } from "react";

export default function LogIn() {
  const [isLoginLoaded, setLoginLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let comment = new CommentModel("654321", "111", "test", false, false, undefined, undefined);
      await FirebaseHelper.addNewComment(comment);
      let comments = await FirebaseHelper.getAllCommentsByUserId("111");
      if(comments !== null){
        let comment = comments.at(0);
        if(comment !== undefined){
        comment?.updateData("my new data");
        await FirebaseHelper.updateComment(comment);
        }
      }
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
