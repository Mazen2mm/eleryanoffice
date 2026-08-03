import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

export async function GET() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  return NextResponse.json({
    loggedIn: true,
    username: session.username,
    role: session.role,
    permissions: session.permissions || [],
  });
}
