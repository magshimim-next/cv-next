"use client";
import { Categories } from "@/app/models/categories";
import CommentModel from "@/app/models/comment";
import CvModel from "@/app/models/cv";
import UserModel from "@/app/models/user";
import { UserTypes } from "@/app/models/userTypes";
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

      let user = new UserModel(
        "1234",
        "EthanKr",
        "eitankr1@cyber.org.il",
        UserTypes.userType.admin,
        true
      );
      let res4 = await FirebaseHelper.addNewUser(user);
      let res3 = await FirebaseHelper.getAllUsers();
      let res2 = await FirebaseHelper.getUserByEmail("eitankr1@cyber.org.il");
      if (res2 !== null && res2.length > 0) {
        res2.at(0)?.updateName("test!!!");
        let resres = await FirebaseHelper.updateUser(res2.at(0)!);
        console.log(resres);
      }

      let cv = new CvModel(
        "112222",
        "bla",
        "Google.com",
        Categories.category.backEnd,
        "testing"
      );
      let res = await FirebaseHelper.addNewCV(cv);
      if (res.success) {
        FirebaseHelper.resetCvPeginationNumber();
        let resres = await FirebaseHelper.getAllCvs(true);
        let resres1 = await FirebaseHelper.getAllCvs(true);
        let resres2 = await FirebaseHelper.getAllCvs(true);
        let resres3 = await FirebaseHelper.getAllCvs(true);
        let val = FirebaseHelper.getCurrentPageNumber();
        let resres4 = await FirebaseHelper.getAllCvs(false);
        console.log(resres);
        /*
        cv.userID = res2?.at(0)?.id ?? "fail";
        cv.id = res.data;
        let resres = await FirebaseHelper.updateCV(cv);
        console.log(resres);

        let rootComment = new CommentModel(
          "1222",
          "tra",
          "Root Comment",
          false,
          false,
          cv.id
        );

        resres = await FirebaseHelper.addNewComment(rootComment);

        if (resres.success) {
          rootComment.id = resres.data;
          let comment = new CommentModel(
            "1222",
            "tra",
            "Child Comment",
            false,
            false,
            undefined,
            rootComment.id
          );
          resres = await FirebaseHelper.addNewComment(comment);
          if (resres) {
            comment.id = resres.data;

            rootComment.updateData("changedData");
            rootComment.userID = cv.userID;
            resres = await FirebaseHelper.updateComment(rootComment);
            console.log(resres);
          }
        }*/
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
