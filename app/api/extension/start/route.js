import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifySessionToken,
  createExtensionToken,
  SESSION_COOKIE_NAME,
  EXT_TOKEN_TTL_SECONDS,
} from "@/lib/session";
import { hasAccess } from "@/lib/permissions";

export async function POST() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ ok: false, message: "سجّل دخول الأول" }, { status: 401 });
  }

  if (!hasAccess(session, "e-invoice")) {
    return NextResponse.json({ ok: false, message: "معندكش صلاحية استخدام الإكستنشن" }, { status: 403 });
  }

  const extToken = await createExtensionToken({
    uid: session.uid || null,
    username: session.username,
    role: session.role,
  });

  return NextResponse.json({ ok: true, token: extToken, expiresInSeconds: EXT_TOKEN_TTL_SECONDS });
}
