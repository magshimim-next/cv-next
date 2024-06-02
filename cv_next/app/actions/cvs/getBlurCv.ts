"use server";
import { getPlaiceholder } from "plaiceholder";

export async function getBlurredCv(cvLink: string): Promise<string> {
  const resp = await fetch(cvLink);
  const arrayBuffer = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { base64 } = await getPlaiceholder(buffer, { size: 10 });
  return base64;
}
