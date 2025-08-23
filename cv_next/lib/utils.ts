import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Categories from "@/types/models/categories";
import { Link_Definitions } from "./definitions";

/**
 * Combines multiple class names into a single string.
 * @param {ClassValue[]} inputs The class names to combine.
 * @returns {string} The combined class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if the code is running in a browser environment.
 * @returns {boolean} true if the code is running in a browser environment, false otherwise
 */
export function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Decodes a base64-encoded string.
 * @param {string | undefined} value
 * @returns {string | null}
 */
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

/**
 * Encodes a string to base64.
 * @param {string | undefined} value The string to encode.
 * @returns {string | null} The base64-encoded string or null if the input is invalid.
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
 * @param {T} val - the value to be wrapped in the Result object
 * @returns {Result<T, never>} the Result object containing the specified value
 */
export function Ok<T>(val: T): Result<T, never> {
  return { ok: true, val };
}

export namespace Ok {
  export const EMPTY = Ok<undefined>(undefined);
}

/**
 * Creates an Error Result object with the specified error value.
 * @param {E} val - the error value
 * @param  {E} where - the location of the error
 * @param {ErrorDetails} errors - additional error details
 * @returns {Result<never, E>} the Result object with ok set to false and containing the specified error value
 */
export function Err<E>(where: E, errors: ErrorDetails = {}): Result<never, E> {
  return { ok: false, where, errors };
}

/**
 * Get a valid google docs/drive link and switch to the /preview version to handle permissions better
 * @param {string} link - the original link
 * @returns {string} the link as a preview instead of edit or view
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

/**
 * Generates a category link based on the provided category number.
 * @param {number} categoryNumber - The category number.
 * @returns {string} The generated category link.
 */
export const generateCategoryLink = (categoryNumber: number) =>
  `/feed?category=${Categories.category[categoryNumber].toLowerCase()}`;

/**
 * Extracts all numbers from an array of strings.
 * @param {string[]} arr - The array of strings to extract numbers from.
 * @returns {number[]} An array of numbers found in the input array.
 */
export function getAllNumbersFromArr(arr: string[]) {
  return arr
    .filter((value) => !isNaN(parseInt(value)))
    .map((value) => parseInt(value));
}

/**
 * Generates a category string based on the provided category number.
 * @param {number} categoryNumber - The category number.
 * @returns {string} The generated category string.
 */
export const categoryString = (categoryNumber: number) =>
  `${Categories.category[categoryNumber].toLowerCase()}`;

/**
 * Converts a category name to its corresponding category number.
 * @param {string} name - The name of the category.
 * @returns {number} The category number or -1 if not found.
 */
export function toCategoryNumber(name: string): number {
  let fixedName = name[0].charAt(0).toUpperCase() + name.slice(1);
  return Categories.category[fixedName as keyof typeof Categories.category];
}

/**
 * The function will check if the redirectPath provided is within our website
 * @param redirectPath The path the user wants to redirect to
 * @returns true if can redirect to it, false otherwise
 */
export function checkRedirect(redirectPath: string): boolean {
  return (
    redirectPath === "" ||
    redirectPath === "/" ||
    Link_Definitions.ALLOWED_REDIRECTS.some((prefix) =>
      redirectPath.startsWith("/" + prefix)
    )
  );
}

/**
 * Capitalizes the first letter of each word in a sentence.
 * @param {string} sentence - The sentence to capitalize.
 * @returns {string} The capitalized sentence.
 */
export function capitalizeWords(sentence: string) {
  return sentence
    .trim()
    .split(/[\s_]+/)
    .map((word) =>
      word.length === 0 ? "" : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
<linearGradient id="g">
<stop stop-color="#f6f7f8" offset="0%" />
<stop stop-color="#edeef1" offset="20%" />
<stop stop-color="#f6f7f8" offset="40%" />
<stop stop-color="#f6f7f8" offset="100%" />
</linearGradient>
</defs>
<rect width="${w}" height="${h}" fill="#f6f7f8" />
<rect id="r" width="${w}" height="${h}" fill="url(#g)" />
<animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`;
export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
