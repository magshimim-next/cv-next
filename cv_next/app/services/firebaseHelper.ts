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
  QuerySnapshot,
  orderBy,
  limit,
  DocumentSnapshot,
  endBefore,
  startAfter,
  Query,
} from "firebase/firestore";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import CommentModel from "../models/comment";
import UserModel from "../models/user";
import CvModel from "../models/cv";
import { Categories } from "../models/categories";
import Definitions from "../base/definitions";
import OperationBucket from "./operationBucket";
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

enum ErrorReasons {
  noErr,
  undefinedErr,
  emailExists,
  rateLimitPerSecondReached,
}

const enumToStringMap: Record<ErrorReasons, string> = {
  [ErrorReasons.noErr]: "No Error",
  [ErrorReasons.undefinedErr]: "Undefined Error",
  [ErrorReasons.emailExists]: "Email already exists!",
  [ErrorReasons.rateLimitPerSecondReached]: "Rate limit per second reached",
};

export class DbOperationResult {
  public success: boolean;
  public data: any;
  public reason: ErrorReasons;
  public reasonString: string;

  constructor(success: boolean, reason: ErrorReasons, data: any) {
    this.success = success;
    this.reason = reason;
    this.reasonString = enumToStringMap[reason];
    this.data = data;
  }
}

export default class FirebaseHelper {
  private static firebaseAppInstance?: FirebaseApp;
  private static firestoreInstance?: Firestore;
  private static firebaseAuthInstance?: Auth;
  private static operationBucketInstance?: OperationBucket;

  /**
   * Method initiates the firebase app if not initiated yet
   * @returns FirebaseApp instance
   */
  public static getOperationBucketInstance(): OperationBucket {
    if (
      FirebaseHelper.operationBucketInstance === null ||
      FirebaseHelper.operationBucketInstance === undefined
    ) {
      FirebaseHelper.operationBucketInstance = new OperationBucket(
        Definitions.MAX_OPERATIONS,
        Definitions.MAX_OPERATIONS_REFILL_PER_SECOND
      );
    }
    return FirebaseHelper.operationBucketInstance;
  }

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
  ): Promise<string | boolean> {
    let collectionRef = collection(
      FirebaseHelper.getFirestoreInstance(),
      collectionName
    );

    if (FirebaseHelper.getOperationBucketInstance().tryConsumeToken()) {
      try {
        let res = await addDoc(collectionRef, data);
        return res.id;
      } catch (error) {
        let err = error;
        //TODO: add console log
      }
    } else {
      throw Error(enumToStringMap[ErrorReasons.rateLimitPerSecondReached]);
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
    let collectionRef = collection(
      FirebaseHelper.getFirestoreInstance(),
      collectionName
    );
    if (FirebaseHelper.getOperationBucketInstance().tryConsumeToken()) {
      try {
        const documentRef = doc(collectionRef, id);
        await updateDoc(documentRef, data);
        return true;
      } catch (error) {
        let err = error;
        //TODO: add console log
      }
    } else {
      throw Error(enumToStringMap[ErrorReasons.rateLimitPerSecondReached]);
    }
    return false;
  }

  /**
   * returns the query snapshot with results(documents)
   * @param query the query
   * @returns QuerySnapshot or undefined upon error
   */
  private static async myGetDocs(
    query: Query<DocumentData>
  ): Promise<QuerySnapshot<DocumentData>> {
    if (FirebaseHelper.getOperationBucketInstance().tryConsumeToken()) {
      try {
        return await getDocs(query);
      } catch (error) {
        let err = error;
        //TODO: add console log
        throw Error(enumToStringMap[ErrorReasons.undefinedErr]);
      }
    } else {
      throw Error(enumToStringMap[ErrorReasons.rateLimitPerSecondReached]);
    }
  }

  /*-------------------------COMMENT SECTION------------------------------*/

  /**
   * Adds a new comment to the db, excludes the model ID (created automatically)
   * @param comment the comment model to add
   * @returns true if succeeded.
   */
  public static async addNewComment(
    comment: CommentModel
  ): Promise<DbOperationResult> {
    let data = Helper.serializeObjectToFirebaseUsage(comment.removeBaseData());
    let res = await FirebaseHelper.addData(data, comment.collectionName);
    return new DbOperationResult(
      typeof res === "string",
      res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
      res
    );
  }

  /**
   * Updates a specific comment using the given model
   * @param comment should hold the proper ID in order to update the correct document
   * @returns true upon success
   */
  public static async updateComment(
    comment: CommentModel
  ): Promise<DbOperationResult> {
    let data = Helper.serializeObjectToFirebaseUsage(comment.removeBaseData());
    let res = await FirebaseHelper.updateData(
      comment.id,
      data,
      comment.collectionName
    );
    return new DbOperationResult(
      res,
      res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
      res
    );
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
      documentData.downvotes,
      documentData.lastUpdate
    );
  }

  private static async getAllCommentsByQueryFilter(
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
      const querySnapshot = await FirebaseHelper.myGetDocs(q);
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
   * Will not allow to add a user with an already existing email in the system.
   * @param user the user model to add
   * @returns true if succeeded.
   */
  public static async addNewUser(user: UserModel): Promise<DbOperationResult> {
    let userByEmail = await FirebaseHelper.getUserByEmail(user.email);
    if (userByEmail !== null && userByEmail.length > 0) {
      return new DbOperationResult(false, ErrorReasons.emailExists, undefined);
    }
    let data = Helper.serializeObjectToFirebaseUsage(user.removeBaseData());
    let res = await FirebaseHelper.addData(data, user.collectionName);
    return new DbOperationResult(
      typeof res === "string",
      res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
      res
    );
  }

  /**
   * Updates a specific user using the given model
   * @param user should hold the proper ID in order to update the correct document
   * @returns true upon success
   */
  public static async updateUser(user: UserModel): Promise<DbOperationResult> {
    let data = Helper.serializeObjectToFirebaseUsage(user.removeBaseData());
    let res = await FirebaseHelper.updateData(
      user.id,
      data,
      user.collectionName
    );
    return new DbOperationResult(
      res,
      res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
      res
    );
  }

  private static documentSnapshotToUser(
    documentSnapshot: QueryDocumentSnapshot
  ): UserModel {
    const documentData = documentSnapshot.data() as DocumentData;
    return new UserModel(
      documentSnapshot.id,
      documentData.name,
      documentData.email,
      documentData.userTypeID,
      documentData.active,
      documentData.created,
      documentData.lastLogin
    );
  }

  private static async getAllUsersByQueryFilter(
    w?: QueryFieldFilterConstraint,
    filterOutInactive: boolean = true
  ): Promise<UserModel[] | null> {
    try {
      let collectionRef = collection(
        FirebaseHelper.getFirestoreInstance(),
        UserModel.CollectionName
      );
      let querySnapshot: QuerySnapshot;
      let activeWhere = where("active", "==", true);
      if (w !== undefined) {
        const q = filterOutInactive
          ? query(collectionRef, w, activeWhere)
          : query(collectionRef, w);
        querySnapshot = await FirebaseHelper.myGetDocs(q);
      } else {
        if (filterOutInactive) {
          const q = query(collectionRef, activeWhere);
          querySnapshot = await FirebaseHelper.myGetDocs(q);
        } else {
          querySnapshot = await FirebaseHelper.myGetDocs(collectionRef);
        }
      }
      const matchingDocuments: UserModel[] = [];

      querySnapshot.forEach((documentSnapshot) => {
        matchingDocuments.push(
          FirebaseHelper.documentSnapshotToUser(documentSnapshot)
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
   * @param name the name to filter by
   * @param filterOutInactive whether or not we'd like to filter out the inactive users - true by default
   * @returns the user
   */
  public static async getUserByName(
    name: string,
    filterOutInactive: boolean = true
  ): Promise<UserModel[] | null> {
    return FirebaseHelper.getAllUsersByQueryFilter(
      where("name", "==", name),
      filterOutInactive
    );
  }

  /**
   *
   * @param email the email to filter by
   * @param filterOutInactive whether or not we'd like to filter out the inactive users - true by default
   * @returns the user
   */
  public static async getUserByEmail(
    email: string,
    filterOutInactive: boolean = true
  ): Promise<UserModel[] | null> {
    return FirebaseHelper.getAllUsersByQueryFilter(
      where("email", "==", email),
      filterOutInactive
    );
  }

  /**
   *
   * @param filterOutInactive whether or not we'd like to filter out the inactive users - true by default
   * @returns the users
   */
  public static async getAllUsers(
    filterOutInactive: boolean = true
  ): Promise<UserModel[] | null> {
    return FirebaseHelper.getAllUsersByQueryFilter(
      undefined,
      filterOutInactive
    );
  }

  /*-------------------------CVs SECTION------------------------------*/

  /**
   * Adds a new cv to the db, excludes the model ID (created automatically)
   * @param cv the cv model to add
   * @returns DbOperationResult
   */
  public static async addNewCV(cv: CvModel): Promise<DbOperationResult> {
    let data = Helper.serializeObjectToFirebaseUsage(cv.removeBaseData());
    let res = await FirebaseHelper.addData(data, cv.collectionName);
    return new DbOperationResult(
      typeof res === "string",
      res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
      res
    );
  }

  /**
   * Updates a specific cv using the given model
   * @param cv should hold the proper ID in order to update the correct document
   * @returns DbOperationResult
   */
  public static async updateCV(cv: CvModel): Promise<DbOperationResult> {
    let data = Helper.serializeObjectToFirebaseUsage(cv.removeBaseData());
    let res = await FirebaseHelper.updateData(cv.id, data, cv.collectionName);
    return new DbOperationResult(
      res,
      res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
      res
    );
  }

  private static documentSnapshotToCV(
    documentSnapshot: QueryDocumentSnapshot
  ): CvModel {
    const documentData = documentSnapshot.data() as DocumentData;
    return new CvModel(
      documentSnapshot.id,
      documentData.userID,
      documentData.documentLink,
      documentData.categoryID,
      documentData.description,
      documentData.resolved,
      documentData.deleted,
      documentData.uploadDate
    );
  }

  private static startAfterSnapshot: QueryDocumentSnapshot<unknown> | undefined;
  private static endBeforeSnapshot: QueryDocumentSnapshot<unknown> | undefined;
  private static pageSize: number = Definitions.CVS_PER_PAGE;
  private static queryLimit: number = FirebaseHelper.pageSize;
  private static initialQueryDone: boolean = false;
  private static currentCvPaginatioPage: number =
    Definitions.DEFAULT_PAGINATION_FIRST_PAGE_NUMBER;

  private static async paginatedGetAllCvsByQueryFilter(
    w?: QueryFieldFilterConstraint,
    filterOutDeleted: boolean = true
  ): Promise<CvModel[] | null> {
    if (!FirebaseHelper.initialQueryDone) {
      FirebaseHelper.initialQueryDone = true;
    }
    let pageQuery: ReturnType<typeof query<DocumentData>>;
    let collectionRef = collection(
      FirebaseHelper.getFirestoreInstance(),
      CvModel.CollectionName
    );
    let deleteW = where("deleted", "==", !filterOutDeleted);

    if (FirebaseHelper.startAfterSnapshot) {
      // Create a new query starting after the last document of the previous page
      pageQuery =
        w !== undefined
          ? query(
              collectionRef,
              orderBy("uploadDate", "desc"),
              startAfter(FirebaseHelper.startAfterSnapshot),
              limit(FirebaseHelper.queryLimit),
              deleteW,
              w
            )
          : query(
              collectionRef,
              orderBy("uploadDate", "desc"),
              startAfter(FirebaseHelper.startAfterSnapshot),
              limit(FirebaseHelper.queryLimit),
              deleteW
            );
      FirebaseHelper.currentCvPaginatioPage++;
    } else {
      // Perform the initial query
      pageQuery =
        w !== undefined
          ? query(
              collectionRef,
              orderBy("uploadDate", "desc"),
              limit(FirebaseHelper.queryLimit),
              deleteW,
              w
            )
          : query(
              collectionRef,
              orderBy("uploadDate", "desc"),
              limit(FirebaseHelper.queryLimit),
              deleteW
            );
    }

    try {
      const querySnapshot = await FirebaseHelper.myGetDocs(pageQuery);
      const matchingDocuments: CvModel[] = [];

      querySnapshot.forEach((documentSnapshot) => {
        matchingDocuments.push(
          FirebaseHelper.documentSnapshotToCV(documentSnapshot)
        );
      });
      // Determine if there are more pages to fetch
      if (querySnapshot.size === FirebaseHelper.queryLimit) {
        // Get the first and last document from the current page
        const firstVisible = querySnapshot.docs[0];
        const lastVisible = querySnapshot.docs[querySnapshot.size - 1];

        FirebaseHelper.startAfterSnapshot = lastVisible;
        FirebaseHelper.endBeforeSnapshot = firstVisible;
      } else {
        // No more pages to fetch
        FirebaseHelper.startAfterSnapshot = undefined;
        FirebaseHelper.endBeforeSnapshot = undefined;
      }
      return matchingDocuments;
    } catch (error) {
      let err = error;
      console.log("Error getting documents:", error);
    }

    return null;
  }

  private static async _getAllCvsByQueryFilter(
    w?: QueryFieldFilterConstraint,
    filterOutDeleted: boolean = true
  ): Promise<CvModel[] | null> {
    try {
      let collectionRef = collection(
        FirebaseHelper.getFirestoreInstance(),
        CvModel.CollectionName
      );
      let deleteW = where("deleted", "==", !filterOutDeleted);
      const q =
        w !== undefined
          ? query(collectionRef, w, deleteW)
          : query(collectionRef, deleteW);
      const querySnapshot = await FirebaseHelper.myGetDocs(q);
      const matchingDocuments: CvModel[] = [];

      querySnapshot.forEach((documentSnapshot) => {
        matchingDocuments.push(
          FirebaseHelper.documentSnapshotToCV(documentSnapshot)
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
   * @param userId the userId to filter by
   * @param filterOutDeleted whether or not we'd like to filter out the deleted cvs - true by default
   * @returns the CVs
   */
  public static async getAllCvsByUserId(
    userId: string,
    filterOutDeleted: boolean = true
  ): Promise<CvModel[] | null> {
    return FirebaseHelper._getAllCvsByQueryFilter(
      where("userID", "==", userId),
      filterOutDeleted
    );
  }

  /**
   *
   * @param category the category to filter by
   * @param filterOutDeleted whether or not we'd like to filter out the deleted cvs - true by default
   * @returns the CVs
   */
  public static async getAllCvsByCategory(
    category: Categories.category,
    filterOutDeleted: boolean = true
  ): Promise<CvModel[] | null> {
    return FirebaseHelper._getAllCvsByQueryFilter(
      where("categoryID", "==", category),
      filterOutDeleted
    );
  }

  /**
   * @param forward - always true to get the next data
   * @param filterOutDeleted whether or not we'd like to filter out the deleted CVs - true by default
   * @returns the users
   */
  public static async getAllCvs(
    forward: boolean,
    filterOutDeleted: boolean = true
  ): Promise<CvModel[] | null> {
    return FirebaseHelper.paginatedGetAllCvsByQueryFilter(
      undefined,
      filterOutDeleted
    );
  }

  public static getCurrentPageNumber(): number {
    return FirebaseHelper.currentCvPaginatioPage;
  }

  public static resetCvPeginationNumber() {
    FirebaseHelper.currentCvPaginatioPage =
      Definitions.DEFAULT_PAGINATION_FIRST_PAGE_NUMBER;
  }
}
