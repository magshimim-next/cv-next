"use server";

import logger, { logErrorWithTrace } from "@/server/base/logger";
import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/server/api/users";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (data.pathname.endsWith("getUserName")) {
    return await getUserNameHandler(data);
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

/**
 * Fetch the name of a user
 *
 * @param {string} userId - The user
 * @return {Promise<boolean>} a promised string with the full name of the user, it's username, or null
 */
async function getUserNameHandler(data: { userId: string }) {
  const userId = data.userId;
  const result = await getUserById(userId);
  if (!result.ok) {
    logger.error(result.err, "Error getting username");
    logErrorWithTrace(result);
    return NextResponse.json(
      {
        fullName: null,
      },
      { status: 500 }
    );
  } else {
    const userName = result.val.full_name ?? result.val.username;
    return NextResponse.json({
      fullName: userName ?? null,
    });
  }
}
