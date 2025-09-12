import Definitions from "@/lib/definitions";

export function checkUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9][a-zA-Z0-9_.]*$/;
  return regex.test(username) && checkUsernameLength(username.length);
}

export function checkUsernameLength(len: number): boolean {
  return len <= Definitions.MAX_CHAR_NAME && len >= Definitions.MIN_CHAR_NAME;
}
