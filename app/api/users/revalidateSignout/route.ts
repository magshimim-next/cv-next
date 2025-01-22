"use server";

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  revalidatePath("/");

  return NextResponse.json({ status: 200 });
}
