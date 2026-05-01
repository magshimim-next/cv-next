import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
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
 * @param {string | undefined} value The value to base64 decode
 * @returns {string | null} The decoded value or none if failed.
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
export const generateCategoryLink = (category: string) =>
  `/feed?category=${category}`;

/**
 * Returns the category string as-is (categories are now plain strings).
 */
export const categoryString = (category: string) => category;

/**
 * Returns the category name as-is (categories are now plain strings, not numbers).
 */
export function toCategoryNumber(name: string): string {
  return name ?? "";
}

/**
 * The function will check if the redirectPath provided is within our website
 * @param {string} redirectPath The path the user wants to redirect to
 * @returns {boolean} true if can redirect to it, false otherwise
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

/**
 * The function will extract the display name from an object that contains user data afte a table join.
 * @param {string | null} jointIdStr The string the is recieved from queries that use joins to get user's data
 * @returns {string} The display name of the user or the entire object as a string
 */
export function getJointDisplayName(jointIdStr: string | null) {
  return typeof jointIdStr === "object" && jointIdStr !== null
    ? (jointIdStr as { display_name?: string }).display_name
    : String(jointIdStr);
}

/**
 * The function will extract the id from an object that contains user data afte a table join.
 * @param {string | null} jointIdStr The string the is recieved from queries that use joins to get user's data
 * @returns {string} The id of the user or the entire object as a string
 */
export function getJointAuthorId(jointIdStr: string | null) {
  return typeof jointIdStr === "object" && jointIdStr !== null
    ? (jointIdStr as { id?: string }).id
    : String(jointIdStr);
}

/**
 * The function will return random values from a given enum.
 * @template {object} T The enum types
 * @param {T} anEnum The enum object to return random value from
 * @param {number} count How many random values to return
 * @returns {any[]} An array of random values from the given enum
 */
export function getRandomEnumValues<T extends object>(
  anEnum: T,
  count: number
): T[keyof T][] {
  const allEntries = Object.values(anEnum);
  const isNumeric = allEntries.some((v) => typeof v === "number");

  const filteredValues = isNumeric
    ? allEntries.filter((v) => typeof v === "number")
    : allEntries;

  const shuffled = [...filteredValues].sort(() => 0.5 - Math.random());
  return shuffled.slice(
    0,
    Math.min(count, filteredValues.length)
  ) as T[keyof T][];
}
