const GOOGLE_URL = "https://lh5.googleusercontent.com/d/";
const ERROR_URL = "/images/error.webp";

/**
 * Extracts the ID from a Google Drive share link.
 * @param {string} link - The Google Drive share link from which to extract the ID.
 * @returns {string | null} The extracted ID or null if no ID is found.
 */
export function getIdFromLink(link: string): string | null {
  const idPattern = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = link.match(idPattern);
  return match?.[1] ?? null;
}

/**
 * Generates a URL suffix based on the provided width, height, and forceRatio parameters.
 * @param {number} width - The width of the image.
 * @param {number} height - The height of the image.
 * @param {boolean} forceRatio - Indicates if the image should maintain its aspect ratio.
 * @returns {string} The generated URL suffix.
 */
function generateUrlSuffix(
  width: number,
  height: number,
  forceRatio: boolean
): string {
  const ratioSuffix = forceRatio ? "-p" : "";
  return `=w${width}-h${height}${ratioSuffix}`;
}

/**
 * Generates a URL with or without parameters.
 * @param {string} link - The base URL of the image.
 * @param {number} [width] - The width of the image.
 * @param {number} [height] - The height of the image.
 * @param {boolean} [forceRatio] - Indicates if the image should maintain its aspect ratio.
 * @returns {string} The generated URL.
 */
export function getGoogleImageUrl(
  link: string,
  width?: number,
  height?: number,
  forceRatio?: boolean
): string {
  const id = getIdFromLink(link);
  if (!id) {
    return ERROR_URL;
  }

  let url = GOOGLE_URL + id;

  if (width && height) {
    const urlSuffix = generateUrlSuffix(width, height, forceRatio || false);
    return url + urlSuffix;
  }

  return url;
}

/**
 * The function will extract export links for Google Docs or Drive files.
 * @param {string} url - The Google Docs or Drive URL to extract export links from.
 * @returns {{ pdfUrl: string; docxUrl: string } | null } PDF and DOCX export urls if the url is valid, otherwise null.
 */
export function getExportLinks(
  url: string
): { pdfUrl: string; docxUrl: string } | null {
  const fileId = getIdFromLink(url);
  if (!fileId) return null;

  const isDocs =
    url.startsWith("docs.google.com") ||
    url.startsWith("https://docs.google.com");
  const isDrive =
    url.startsWith("drive.google.com") ||
    url.startsWith("https://drive.google.com");

  if (isDocs) {
    return {
      pdfUrl: `https://docs.google.com/document/d/${fileId}/export?format=pdf`,
      docxUrl: `https://docs.google.com/document/d/${fileId}/export?format=docx`,
    };
  }

  if (isDrive) {
    return {
      pdfUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      docxUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    };
  }

  return null;
}
