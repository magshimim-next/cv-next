"use server";
import { getPlaiceholder } from "plaiceholder";
import Definitions from "@/lib/definitions";

/**
 * Get a blurred version of a cv
 *
 * @param {string} cvId - The cv to get a blurred version of
 * @return {Promise<string>} a promised string with the base64 of the blur
 */
export async function getBlurredCv(cvLink: string): Promise<string> {
  const resp = await fetch(cvLink, {
    next: { revalidate: Definitions.FETCH_WAIT_TIME },
  });
  const arrayBuffer = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { base64 } = await getPlaiceholder(buffer, {
    size: Definitions.PLAICEHOLDER_IMAGE_SIZE,
  });
  return base64;
}
