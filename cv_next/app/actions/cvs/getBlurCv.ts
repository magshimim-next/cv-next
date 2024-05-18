"use server";
import { getPlaiceholder } from "plaiceholder";
import MyLogger from "@/server/base/logger";

export async function getBlurredCv(cvLink: string): Promise<string> {
  try {
    const resp = await fetch(cvLink);
    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64;
  } catch (error: any) {
    MyLogger.logInfo(error);
    return "data:iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs7p5fDwAFlAI2LB7hbAAAAABJRU5ErkJggg==";
  }
}
