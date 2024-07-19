"use server";

import SupabaseHelper from "@/server/api/supabaseHelper";
import logger from "@/server/base/logger";
import { Tables, ProfileKeys } from "@/lib/supabase-definitions";
import { NextRequest, NextResponse } from "next/server";

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
  const { data: user, error } = await SupabaseHelper.getSupabaseInstance()
    .from(Tables.profiles)
    .select("*")
    .eq(ProfileKeys.id, userId)
    .single();
  if (error) {
    logger.error(error, "Error getting username");
  }
  return NextResponse.json({
    fullName: user?.full_name ?? user?.username ?? null,
  });
}
