import 'server-only'

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Firestore,
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  DocumentData,
  QuerySnapshot,
  Query,
} from "firebase/firestore";
import Definitions from "@/server/base/definitions";
import OperationBucket from "@/server/api/operationBucket";
import MyLogger from "@/server/base/logger";
import { RateLimitError, enumToStringMap, ErrorReasons } from "./utils";

export default class FirebaseHelper {
    private static firebaseAppInstance?: FirebaseApp;
    private static firestoreInstance?: Firestore;
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
        FirebaseHelper.firebaseAppInstance = initializeApp(
          Definitions.FIREBASE_CONFIG
        );
      }
      return FirebaseHelper.firebaseAppInstance;
    }
  
    /**
     * Method initiates the firestore if not initiated yet
     * @returns Firestore instance
     */
    public static getFirestoreInstance(): Firestore {
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
   * Adds data to the proper collection
   * @param data the model serialized to data
   * @param collectionName the collection name
   * @returns true if succeeded.
   */
  public static async addData(
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
        MyLogger.logInfo("Error @ FirebaseHelper::addData", error);
      }
    } else {
      throw new RateLimitError();
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
  public static async updateData(
    id: string,
    data: any,
    collectionName: string,
    retries = 5
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
        MyLogger.logInfo("Error @ FirebaseHelper::updateData", error);
      }
    } else {
      if (retries >= 0) {
        //reasonable sleep time for rate limit
        await this.sleep(1500);
        return this.updateData(id, data, collectionName, retries - 1);
      } else {
        throw new RateLimitError();
      }
    }
    return false;
  }

  private static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * returns the query snapshot with results(documents)
   * @param query the query
   * @param retries force retry on the request when rate limit reaches.
   *                Defaults to 5
   * @returns QuerySnapshot or undefined upon error
   */
  public static async myGetDocs(
    query: Query<DocumentData>,
    retries = 5
  ): Promise<QuerySnapshot<DocumentData>> {
    if (FirebaseHelper.getOperationBucketInstance().tryConsumeToken()) {
      try {
        return await getDocs(query);
      } catch (error) {
        let err = error;
        MyLogger.logInfo("Error @ FirebaseHelper::myGetDocs", error);
        throw Error(enumToStringMap[ErrorReasons.undefinedErr]);
      }
    } else {
      if (retries >= 0) {
        //reasonable sleep time for rate limit
        await this.sleep(1500);
        return this.myGetDocs(query, retries - 1);
      } else {
        throw new RateLimitError();
      }
    }
  }
}
