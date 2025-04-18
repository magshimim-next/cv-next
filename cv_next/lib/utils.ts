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
export function Err<E>(where: E, errors: ErrorDetails = {}): Result<never, E> {
  return { ok: false, where, errors };
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

export const categoryString = (categoryNumber: number) =>
  `${Categories.category[categoryNumber].toLowerCase()}`;

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
