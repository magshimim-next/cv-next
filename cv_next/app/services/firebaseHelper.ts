"use client"; //TODO: check if this is needed
import Helper from "../base/helper";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Firestore,
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  getDoc,
  where,
  getDocs,
  query,
  DocumentData,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
} from "firebase/firestore";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import CommentModel from "../models/comment";
var firebaseui = require("firebaseui");

// TODO: Add SDKs for Firebase products that you want to use
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

export default class FirebaseHelper {
  private static firebaseAppInstance?: FirebaseApp;
  private static firestoreInstance?: Firestore;
  private static firebaseAuthInstance?: Auth;

  /**
   * Method initiates the firebase app if not initiated yet
   * @returns FirebaseApp instance
   */
  public static getFirebaseInstance(): FirebaseApp {
    if (
      FirebaseHelper.firebaseAppInstance === null ||
      FirebaseHelper.firebaseAppInstance === undefined
    ) {
      FirebaseHelper.firebaseAppInstance = initializeApp(firebaseConfig);
    }
    return FirebaseHelper.firebaseAppInstance;
  }

  /**
   * Method initiates the firebase app if not initiated yet
   * @returns FirebaseApp instance
   */
  private static getFirestoreInstance(): Firestore {
    if (
      FirebaseHelper.firestoreInstance === null ||
      FirebaseHelper.firestoreInstance === undefined
    ) {
      FirebaseHelper.firestoreInstance = getFirestore(
        FirebaseHelper.getFirebaseInstance()
      );
    }
    return FirebaseHelper.firestoreInstance;
  }

  /**
   * Method initiates the firebase app if not initiated yet
   * @returns FirebaseApp instance
   */
  public static getFirebaseAuthInstance(): Auth {
    if (
      FirebaseHelper.firebaseAuthInstance === null ||
      FirebaseHelper.firebaseAuthInstance === undefined
    ) {
      FirebaseHelper.firebaseAuthInstance = getAuth(this.getFirebaseInstance());
    }
    return FirebaseHelper.firebaseAuthInstance;
  }

  public static getAuthUI() {
    const auth = FirebaseHelper.getFirebaseAuthInstance();
    var ui = new firebaseui.auth.AuthUI(auth);
    ui.start("#firebaseui-auth-container", {
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
    });
  }

  public static async addNewComment(comment: CommentModel): Promise<boolean> {
    try {
      let data = Helper.serializeObject(comment.removeBaseData());
      let collectionRef = collection(
        FirebaseHelper.getFirestoreInstance(),
        comment.collectionName
      );

      let res = await addDoc(collectionRef, data);
      return true;
    } catch (error) {
      let err = error;
      //TODO: add console log
    }
    return false;
  }

  private static documentSnapshotToComment(
    documentSnapshot: QueryDocumentSnapshot
  ): CommentModel {
    const documentData = documentSnapshot.data() as DocumentData;
    return new CommentModel(
      documentSnapshot.id,
      documentData.userID,
      documentData.data,
      documentData.resolved,
      documentData.deleted,
      documentData.documentID,
      documentData.parentCommentID,
      documentData.upvotes,
      documentData.downvotes
    );
  }

  public static async getAllCommentsByQueryFilter(
    w: QueryFieldFilterConstraint,
    filterOutDeleted: boolean = true
  ): Promise<CommentModel[] | null> {
    try {
      let collectionRef = collection(
        FirebaseHelper.getFirestoreInstance(),
        CommentModel.CollectionName
      );
      const q = query(
        collectionRef,
        w,
        where("deleted", "==", !filterOutDeleted)
      );
      const querySnapshot = await getDocs(q);
      const matchingDocuments: CommentModel[] = [];

      querySnapshot.forEach((documentSnapshot) => {
        matchingDocuments.push(
          FirebaseHelper.documentSnapshotToComment(documentSnapshot)
        );
      });
      return matchingDocuments;
    } catch (error) {
      let err = error;
      //TODO: add console log
    }
    return null;
  }

  public static async getAllCommentsByUserId(
    userId: string,
    filterOutDeleted: boolean = true
  ): Promise<CommentModel[] | null> {
    return FirebaseHelper.getAllCommentsByQueryFilter(
      where("userID", "==", userId),
      filterOutDeleted
    );
  }

  /**
   *
   * @param documentID is the ID of the specific CV document.
   * @returns all the top level comments of the CV
   */
  public static async getAllCommentsByDocumentId(
    documentID: string
  ): Promise<CommentModel[] | null> {
    return FirebaseHelper.getAllCommentsByQueryFilter(
      where("documentID", "==", documentID)
    );
  }

  /**
   *
   * @param parentCommentID is the ID of the specific Parent Comment.
   * @returns all the top level comments of the specific parent comment
   */
  public static async getAllCommentsByParentCommentID(
    parentCommentID: string
  ): Promise<CommentModel[] | null> {
    return FirebaseHelper.getAllCommentsByQueryFilter(
      where("parentCommentID", "==", parentCommentID)
    );
  }
}
