import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { verifySessionToken, SESSION_COOKIE_NAME, hashPasswordServer } from "@/lib/session";

async function requireUsersAccess() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session) return null;
  if (session.role === "admin") return session;
  if (Array.isArray(session.permissions) && session.permissions.includes("users")) return session;
  return null;
}

export async function GET() {
  const session = await requireUsersAccess();
  if (!session) return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });

  const db = getAdminDb();
  const snap = await db.collection("admin_users").orderBy("createdAt", "asc").get();
  const users = snap.docs.map((doc) => ({
    id: doc.id,
    username: doc.data().username,
    permissions: doc.data().permissions || [],
  }));
  return NextResponse.json({ ok: true, users });
}

export async function POST(request) {
  const session = await requireUsersAccess();
  if (!session) return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });

  const { username, password, permissions } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ ok: false, message: "يجب إدخال اسم المستخدم وكلمة المرور" }, { status: 400 });
  }
  if (username === process.env.MASTER_ADMIN_USERNAME) {
    return NextResponse.json({ ok: false, message: "اسم المستخدم محجوز" }, { status: 400 });
  }

  const db = getAdminDb();
  const existing = await db.collection("admin_users").where("username", "==", username).limit(1).get();
  if (!existing.empty) {
    return NextResponse.json({ ok: false, message: "اسم المستخدم مستخدم بالفعل" }, { status: 400 });
  }

  await db.collection("admin_users").add({
    username,
    passwordHash: await hashPasswordServer(password),
    permissions: Array.isArray(permissions) ? permissions : [],
    createdAt: Date.now(),
  });

  return NextResponse.json({ ok: true });
}
