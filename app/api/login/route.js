import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { createSessionToken, hashPasswordServer, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ ok: false, message: "من فضلك أدخل اسم المستخدم وكلمة المرور" }, { status: 400 });
    }

    const passwordHash = await hashPasswordServer(password);

    // 1) الحساب الرئيسي - بياناته دلوقتي في متغيرات البيئة، مش في كود ظاهر للمتصفح
    const masterUsername = process.env.MASTER_ADMIN_USERNAME;
    const masterPasswordHash = process.env.MASTER_ADMIN_PASSWORD_HASH;

    if (masterUsername && masterPasswordHash && username === masterUsername && passwordHash === masterPasswordHash) {
      const token = await createSessionToken({ username, role: "admin", permissions: [] });
      const res = NextResponse.json({ ok: true, username, role: "admin", permissions: [] });
      res.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
      });
      return res;
    }

    // 2) حسابات الموظفين - بتتقري دلوقتي من السيرفر (Admin SDK) مش من المتصفح
    const db = getAdminDb();
    const snap = await db
      .collection("admin_users")
      .where("username", "==", username)
      .where("passwordHash", "==", passwordHash)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ ok: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const userDoc = snap.docs[0];
    const permissions = userDoc.data().permissions || [];
    const token = await createSessionToken({ username, role: "user", permissions, uid: userDoc.id });

    const res = NextResponse.json({ ok: true, username, role: "user", permissions });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ ok: false, message: "حدث خطأ في السيرفر أثناء تسجيل الدخول" }, { status: 500 });
  }
}
