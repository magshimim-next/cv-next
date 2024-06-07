"use server";
import { getPlaiceholder } from "plaiceholder";
import Definitions from "@/lib/definitions";

export async function getBlurredCv(cvLink: string): Promise<string> {
  const resp = await fetch(cvLink, {
    next: { revalidate: Definitions.FETCH_WAIT_TIME },
  });
  const arrayBuffer = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { base64 } = await getPlaiceholder(buffer, { size: 15 });
  return base64;
}
