import { PostgrestError } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Categories from "@/types/models/categories";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBrowser() {
  return typeof window !== "undefined";
}

export function decodeValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const valueToString = value.toString();

  if (isBrowser()) {
    return atob(valueToString);
  }

  const buff = Buffer.from(valueToString, "base64");
  return buff.toString("ascii");
}

/*
 * Encode string, returns base64 value
 * @Params: string
 */
export function encodeValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const valueToString = value.toString();

  if (isBrowser()) {
    return btoa(valueToString);
  }

  const buff = Buffer.from(valueToString, "ascii");
  return buff.toString("base64");
}

/**
 * Creates an Ok Result object with the specified value.
 *
 * @param {T} val - the value to be wrapped in the Result object
 * @return {Result<T, never>} the Result object containing the specified value
 */
export function Ok<T>(val: T): Result<T, never> {
  return { ok: true, val };
}

export namespace Ok {
  export const EMPTY = Ok<undefined>(undefined);
}

/**
 * Creates an Error Result object with the specified error value.
 *
 * @param {E} val - the error value
 * @return {Result<never, E>} the Result object with ok set to false and containing the specified error value
 */
export function Err<E>(
  where: E,
  postgrestError?: PostgrestError,
  err?: Error
): Result<never, E> {
  return { ok: false, where, postgrestError, err };
}

/**
 * Checks if 2 arrays have the same values in them
 *
 * @param {number[]} arr1 - the first array
 * @param {number[]} arr2 - the second array
 * @return {boolean} true if arrays have the same values, false otherwise
 */
export function arraysHaveSameContent(arr1: number[], arr2: number[]) {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort the arrays to ensure the elements are in the same order
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // Compare each element in the sorted arrays
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  // If all elements are the same, return true
  return true;
}

export const generateCategoryLink = (categoryNumber: number) =>
  `/feed?category=${Categories.category[categoryNumber].toLowerCase()}`;
