import { NextResponse } from "next/server";
import { verifyExtensionToken, createExtensionToken, EXT_TOKEN_TTL_SECONDS } from "@/lib/session";
import { getAdminDb } from "@/lib/firebaseAdmin";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, allowed: false, message: "طلب غير صالح" }, { status: 400 });
  }

  const payload = await verifyExtensionToken(body?.token);
  if (!payload) {
    return NextResponse.json({ ok: true, allowed: false, message: "الجلسة منتهية أو غير صالحة" });
  }

  if (payload.role === "admin") {
    const newToken = await createExtensionToken({
      uid: payload.uid,
      username: payload.username,
      role: payload.role,
    });
    return NextResponse.json({ ok: true, allowed: true, token: newToken, expiresInSeconds: EXT_TOKEN_TTL_SECONDS });
  }

  if (!payload.uid) {
    return NextResponse.json({ ok: true, allowed: false, message: "جلسة غير صالحة" });
  }

  try {
    const db = getAdminDb();
    const doc = await db.collection("admin_users").doc(payload.uid).get();

    if (!doc.exists) {
      return NextResponse.json({ ok: true, allowed: false, message: "الحساب اتشال" });
    }

    const permissions = doc.data().permissions || [];
    if (!permissions.includes("einvoice")) {
      return NextResponse.json({ ok: true, allowed: false, message: "الصلاحية اتلغت" });
    }

    const newToken = await createExtensionToken({
      uid: payload.uid,
      username: payload.username,
      role: payload.role,
    });
    return NextResponse.json({ ok: true, allowed: true, token: newToken, expiresInSeconds: EXT_TOKEN_TTL_SECONDS });
  } catch (err) {
    console.error("Extension verify error:", err);
    return NextResponse.json({ ok: false, allowed: false, message: "تعذر التحقق - حاول تاني" }, { status: 500 });
  }
}
