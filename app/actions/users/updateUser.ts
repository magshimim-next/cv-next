"use server";

import {
  setUserName,
  setWorkStatus,
  setWorkCategories,
  setDisplayName,
  updateUser,
} from "@/server/api/users";
import { Err } from "@/lib/utils";
import { logErrorWithTrace } from "@/server/base/logger";

/**
 * Partial update to a user.
 *
 * @param {Partial<UserModel>} user - partial user data to update
 * @returns {Promise<Result<void, string>>} A Promise with the result of the operation.
 */
export const updateUserAction = async (
  user: Partial<UserModel>
): Promise<Result<void, string>> => {
  const result = await updateUser(user);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err("Couldn't update the user", result.errors);
  }
};

/**
 * Updates a user's username.
 *
 * @param {string} userId - The ID of the user to update
 * @param {string} newUserName - The new username
 * @return {Promise<Result<void, string>>} A Promise with the result of the operation.
 */
export const setNewUsername = async (
  userId: string,
  newUserName: string
): Promise<Result<void, string>> => {
  const result = await setUserName(userId, newUserName);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err("Couldn't update the name", result.errors);
  }
};

/**
 * Updates a user's work status.
 *
 * @param {string} userId - The ID of the user to update
 * @param {string} newWorkStatus - The new work status
 * @return {Promise<Result<void, string>>} A Promise with the result of the operation.
 */
export const setNewWorkStatus = async (
  userId: string,
  newWorkStatus: string
): Promise<Result<void, string>> => {
  const result = await setWorkStatus(userId, newWorkStatus);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err("Couldn't update the status", result.errors);
  }
};

/**
 * Updates a user's work categories.
 *
 * @param {string} userId - The ID of the user to update
 * @param {number[] | null | undefined} newWorkCategories - The new work categories
 * @return {Promise<Result<void, string>>} A Promise with the result of the operation.
 */
export const setNewWorkCategories = async (
  userId: string,
  newWorkCategories: number[] | null | undefined
): Promise<Result<void, string>> => {
  const result = await setWorkCategories(userId, newWorkCategories);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err("Couldn't update the categories", result.errors);
  }
};

/**
 * Updates a user's display name
 *
 * @param {string} userId - The ID of the user to update
 * @param {string} newDisplayName - The new display name
 * @return {Promise<Result<void, string>>} A Promise with the result of the operation.
 */
export const setNewDisplayName = async (
  userId: string,
  newDisplayName: string
): Promise<Result<void, string>> => {
  const result = await setDisplayName(userId, newDisplayName);
  if (result.ok) {
    return result;
  } else {
    logErrorWithTrace(result);
    return Err("Couldn't update the display name", result.errors);
  }
};
