import { PostgrestError } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Categories from "@/types/models/categories";
import { Link_Definitions } from "./definitions";

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
 * Get a valid google docs/drive link and switch to the /preview version to handle permissions better
 *
 * @param {string} link - the original link
 * @return {string} the link as a preview instead of edit or view
 */
export function transformToPreviewLink(link: string): string {
  try {
    const url = new URL(link);
    // Regular expression to match '/view', '/edit', etc.
    url.pathname = url.pathname.replace(/\/(view|edit)/, "/preview");
    return url.toString();
  } catch (error) {
    return "";
  }
}

export const generateCategoryLink = (categoryNumber: number) =>
  `/feed?category=${Categories.category[categoryNumber].toLowerCase()}`;

export function getAllNumbersFromArr(arr: string[]) {
  return arr
    .filter((value) => !isNaN(parseInt(value)))
    .map((value) => parseInt(value));
}

/**
 * The function will check if the redirectPath provided is within our website
 * @param redirectPath The path the user wants to redirect to
 * @returns true if can redirect to it, false otherwise
 */
export function checkRedirect(redirectPath: string): boolean {
  return (
    redirectPath === "" ||
    Link_Definitions.ALLOWED_REDIRECTS.some((prefix) =>
      redirectPath.startsWith("/" + prefix)
    )
  );
}
