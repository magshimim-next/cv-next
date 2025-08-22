/*
The function will make sure that the Google URL is a preview and shareable
*/
/**
 *
 * @param link
 */
export function transformGoogleViewOnlyUrl(link: string): string {
  if (!validateGoogleViewOnlyUrl(link)) return "";

  try {
    const url = new URL(link);
    url.pathname = url.pathname.replace(/\/(view|edit|preview)/, "/preview");
    if (!url.searchParams.has("usp")) {
      url.searchParams.set("usp", "sharing");
    }
    return url.toString();
  } catch (error) {
    return "";
  }
}

//vibe codded parts of it not gonna lie
/**
 *
 * @param value
 */
export function sanitizeLink(value?: string) {
  if (!value) return null;
  let input = value.trim();
  if (!input) return null;

  // decodes
  if (/%[0-9A-Fa-f]{2}/.test(input)) {
    try {
      input = decodeURIComponent(input);
    } catch {}
  }

  //removing quotes
  if (
    (input.startsWith('"') && input.endsWith('"')) ||
    (input.startsWith("'") && input.endsWith("'"))
  ) {
    input = input.slice(1, -1).trim();
  }

  // html tags
  if (/[<>]/.test(input)) return null;
  if (/\s/.test(input)) return null;

  // Disallow dangerous schemes
  if (/^(javascript|data|vbscript):/i.test(input)) return null;

  //checks protocol
  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(input);
  if (!hasScheme) {
    // Validate basic domain-like input before prepending
    const domainLike =
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d+)?(?:\/.*)?$/i;
    const localhostLike = /^localhost(?::\d+)?(?:\/.*)?$/i;
    if (!domainLike.test(input) && !localhostLike.test(input)) {
      return null;
    }
    input = `https://${input.replace(/^\/+/, "")}`;
  }

  //only https
  const schemeMatch = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(input);
  if (schemeMatch && !/^https?$/i.test(schemeMatch[1])) {
    return null;
  }

  try {
    const url = new URL(input);
    url.hostname = url.hostname.toLowerCase();
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Validates if a Google Drive link is a "view only" link.
 * @param link The link to validate.
 * @returns True if the link is valid, false otherwise.
 */
export function validateGoogleViewOnlyUrl(link: string): boolean {
  const regex =
    /https?:\/\/(?:docs|drive)\.google\.com\/(?:document|file)\/d\/([a-zA-Z0-9_-]+)\/(?:view|preview|edit)(?:\?(?:.*&)?usp=[a-zA-Z0-9_-]+(?:&.*)?)?/;
  return regex.test(link);
}
