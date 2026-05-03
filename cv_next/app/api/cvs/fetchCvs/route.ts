"use server";

import { NextRequest, NextResponse } from "next/server";
import { filterValues } from "@/types/models/filters";
import { getPaginatedCvs } from "@/server/api/cvs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { nextPage, filters }: { nextPage?: number; filters: filterValues } =
      data;

    const cvs = await getPaginatedCvs(true, nextPage, filters);
    return NextResponse.json(cvs);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching CVs" },
      { status: 500 }
    );
  }
}
