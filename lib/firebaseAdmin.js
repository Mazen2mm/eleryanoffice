// =====================================================================
// تهيئة Firebase Admin SDK - يعمل على السيرفر فقط، أبدًا في المتصفح.
// لازم تضيف متغيرات البيئة دي في .env.local (شوف .env.local.example)
// =====================================================================
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // في متغيرات البيئة بتتخزن الأسطر الجديدة كـ \n نصية، فلازم نرجعها أسطر حقيقية
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin غير مهيأ: تأكد من ضبط FIREBASE_PROJECT_ID و FIREBASE_CLIENT_EMAIL و FIREBASE_PRIVATE_KEY في .env.local"
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
