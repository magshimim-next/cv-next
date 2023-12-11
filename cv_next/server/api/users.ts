import 'server-only'

import Helper from "@/server/base/helper";
import {
  collection,
  where,
  query,
  DocumentData,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  QuerySnapshot,
  documentId,
} from "firebase/firestore";
import UserModel from "@/types/models/user";
import MyLogger from "@/server/base/logger";
import { DbOperationResult, ErrorReasons, RateLimitError } from "./utils";
import FirebaseHelper from './firebaseHelper'

/**
 * Adds a new user to the db, excludes the model ID (created automatically)
 * Will not allow to add a user with an already existing email in the system.
 * @param user the user model to add
 * @returns true if succeeded.
 */
export async function addNewUser(user: UserModel): Promise<DbOperationResult> {
  try {
    let userByEmail = await getUsersByEmail(user.email);
    if (userByEmail !== null && userByEmail.length > 0) {
      return new DbOperationResult(
        false,
        ErrorReasons.emailExists,
        undefined
      );
    }
    let data = Helper.serializeObjectToFirebaseUsage(user.removeBaseData());
    let res = await FirebaseHelper.addData(data, user.collectionName);
    return new DbOperationResult(
      typeof res === "string",
      res ? ErrorReasons.noErr : ErrorReasons.undefinedErr,
      res
    );
  } catch (err) {
    MyLogger.logInfo("Error @ FirebaseHelper::addNewUser", err);
    return new DbOperationResult(
      false,
      typeof err === typeof RateLimitError
        ? ErrorReasons.rateLimitPerSecondReached
        : ErrorReasons.undefinedErr,
      err
    );
  }
}

/**
 * Updates a specific user using the given model
 * @param user should hold the proper ID in order to update the correct document
 * @returns true upon success
 */
export async function updateUser(user: UserModel): Promise<DbOperationResult> {
  try {
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
  } catch (err) {
    MyLogger.logInfo("Error @ FirebaseHelper::updateUser", err);
    return new DbOperationResult(
      false,
      typeof err === typeof RateLimitError
        ? ErrorReasons.rateLimitPerSecondReached
        : ErrorReasons.undefinedErr,
      err
    );
  }
}

function documentSnapshotToUser(
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

async function getAllUsersByQueryFilter(
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
        documentSnapshotToUser(documentSnapshot)
      );
    });
    return matchingDocuments;
  } catch (error) {
    MyLogger.logInfo(
      "Error @ FirebaseHelper::getAllUsersByQueryFilter",
      error
    );
  }
  return null;
}

/**
 *
 * @param name the name to filter by
 * @param filterOutInactive whether or not we'd like to filter out the inactive users - false by default
 * @returns the user
 */
export async function getUsersByName(
  name: string,
  filterOutInactive: boolean = false
): Promise<UserModel[] | null> {
  return getAllUsersByQueryFilter(
    where("name", "==", name),
    filterOutInactive
  );
}

/**
 *
 * @param email the email to filter by
 * @param filterOutInactive whether or not we'd like to filter out the inactive users - false by default
 * @returns the user
 */
export async function getUsersByEmail(
  email: string,
  filterOutInactive: boolean = false
): Promise<UserModel[] | null> {
  return getAllUsersByQueryFilter(
    where("email", "==", email),
    filterOutInactive
  );
}

/**
 *
 * @param id unique user id
 * @param filterOutInactive whether or not we'd like to filter out the inactive users - false by default
 * @returns the user
 */
export async function getUserById(
  id: string,
  filterOutInactive: boolean = false
): Promise<UserModel| null> {
  try {
    const collectionRef = collection(
      FirebaseHelper.getFirestoreInstance(),
      UserModel.CollectionName
    );
    let querySnapshot: QuerySnapshot;
    const activeWhere = where("active", "==", true);
    const byIdWhere = where(documentId(), "==", id);
    const q = filterOutInactive
      ? query(collectionRef, byIdWhere, activeWhere)
      : query(collectionRef, byIdWhere);
    querySnapshot = await FirebaseHelper.myGetDocs(q);
    if (querySnapshot.size != 1) {
      throw new Error("Expected only one match for query; documents found: " + querySnapshot.docs);
    }
    return documentSnapshotToUser(querySnapshot.docs[0]);
  } catch (error) {
    MyLogger.logInfo(
      "Error @ FirebaseHelper::getAllUsersByQueryFilter",
      error
    );
  }
  return null;
}

/**
 *
 * @param filterOutInactive whether or not we'd like to filter out the inactive users - false by default
 * @returns the users
 */
export async function getAllUsers(
  filterOutInactive: boolean = false
): Promise<UserModel[] | null> {
  return getAllUsersByQueryFilter(
    undefined,
    filterOutInactive
  );
}