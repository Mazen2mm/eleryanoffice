import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

async function requireUsersAccess() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session) return null;
  if (session.role === "admin") return session;
  if (Array.isArray(session.permissions) && session.permissions.includes("users")) return session;
  return null;
}

export async function PATCH(request, { params }) {
  const session = await requireUsersAccess();
  if (!session) return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });

  const { permissions } = await request.json();
  const db = getAdminDb();
  await db
    .collection("admin_users")
    .doc(params.id)
    .update({ permissions: Array.isArray(permissions) ? permissions : [] });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const session = await requireUsersAccess();
  if (!session) return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });

  const db = getAdminDb();
  await db.collection("admin_users").doc(params.id).delete();

  return NextResponse.json({ ok: true });
}
