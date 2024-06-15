/*
 * Calculate hash of a blob
 * @Params: blob
 * @Returns: a promised string containing the calculated hash
 */
async function calculateHash(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

/*
 * Comparse 2 blobs using their hash
 * @Params: 2 blob
 * @Returns: a promised boolean that says if the hashes are the same or not
 */
export async function compareHashes(
  blob1: Blob,
  blob2: Blob
): Promise<boolean> {
  const hash1 = await calculateHash(blob1);
  const hash2 = await calculateHash(blob2);
  return hash1 === hash2;
}
