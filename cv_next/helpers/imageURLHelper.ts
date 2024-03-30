const GOOGLE_URL = "https://lh5.googleusercontent.com/d/"
const errorUrl = "/public/error.jgp" // TODO: replace with real URL here

/**
 * Extracts the ID from a Google Drive share link.
 *
 * @param {string} link - The Google Drive share link from which to extract the ID.
 * @return {string | null} The extracted ID or null if no ID is found.
 */
export function getIdFromLink(link: string): string | null {
  const idPattern = /\/d\/([a-zA-Z0-9_-]+)/
  const match = link.match(idPattern)
  return match?.[1] ?? null ?? null
}

/**
 * Generates a URL suffix based on the provided width, height, and forceRatio parameters.
 *
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
  const ratioSuffix = forceRatio ? "-p" : ""
  return `=w${width}-h${height}${ratioSuffix}`
}

/**
 * Generates a URL with or without parameters.
 *
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
  const id = getIdFromLink(link)
  if (!id) {
    return errorUrl
  }

  let url = GOOGLE_URL + id

  if (width && height) {
    const urlSuffix = generateUrlSuffix(width, height, forceRatio || false)
    return url + urlSuffix
  }

  return url
}
