"use client"; //TODO: check if this is needed
import Helper from "../base/helper";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Firestore,
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  where,
  getDocs,
  query,
  DocumentData,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
} from "firebase/firestore";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import CommentModel from "../models/comment";
import UserModel from "../models/user";
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

  /**
   * Adds data to the proper collection
   * @param data the model serialized to data
   * @param collectionName the collection name
   * @returns true if succeeded.
   */
  private static async addData(
    data: any,
    collectionName: string
  ): Promise<boolean> {
    try {
      let collectionRef = collection(
        FirebaseHelper.getFirestoreInstance(),
        collectionName
      );

      let res = await addDoc(collectionRef, data);
      return true;
    } catch (error) {
      let err = error;
      //TODO: add console log
    }
    return false;
  }

  /**
   * Updates data of the proper collection
   * @param id the id of the data to update
   * @param data the model serialized to data
   * @param collectionName the collection name
   * @returns true if succeeded.
   */
  private static async updateData(
    id: string,
    data: any,
    collectionName: string
  ): Promise<boolean> {
    try {
      let collectionRef = collection(
        FirebaseHelper.getFirestoreInstance(),
        collectionName
      );
      const documentRef = doc(collectionRef, id);
      await updateDoc(documentRef, data);
      return true;
    } catch (error) {
      let err = error;
      //TODO: add console log
    }
    return false;
  }

  /*-------------------------COMMENT SECTION------------------------------*/

  /**
   * Adds a new comment to the db, excludes the model ID (created automatically)
   * @param comment the comment model to add
   * @returns true if succeeded.
   */
  public static async addNewComment(comment: CommentModel): Promise<boolean> {
    let data = Helper.serializeObject(comment.removeBaseData());
    return FirebaseHelper.addData(data, comment.collectionName);
  }

  /**
   * Updates a specific comment using the given model
   * @param comment should hold the proper ID in order to update the correct document
   * @returns true upon success
   */
  public static async updateComment(comment: CommentModel): Promise<boolean> {
    let data = Helper.serializeObject(comment.removeBaseData());
    return FirebaseHelper.updateData(comment.id, data, comment.collectionName);
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

  /**
   *
   * @param userId the userID to filter by
   * @param filterOutDeleted whether or not we'd like to filter out the deleted comments - true by default
   * @returns the comments
   */
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

  /*-------------------------USERS SECTION------------------------------*/

  /**
   * Adds a new user to the db, excludes the model ID (created automatically)
   * @param user the user model to add
   * @returns true if succeeded.
   */
  public static async addNewUser(user: UserModel): Promise<boolean> {
    let data = Helper.serializeObject(user.removeBaseData());
    return FirebaseHelper.addData(data, user.collectionName);
  }

  /**
   * Updates a specific user using the given model
   * @param user should hold the proper ID in order to update the correct document
   * @returns true upon success
   */
  public static async updateuser(user: UserModel): Promise<boolean> {
    let data = Helper.serializeObject(user.removeBaseData());
    return FirebaseHelper.updateData(user.id, data, user.collectionName);
  }
}
