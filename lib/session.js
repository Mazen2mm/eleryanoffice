// =====================================================================
// جلسة تسجيل الدخول: توكن موقّع بـ HMAC-SHA256، بدون مكتبات خارجية.
// مبني على Web Crypto API عشان يشتغل في الاتنين:
// - API Routes (Node.js runtime)
// - middleware.js (Edge runtime، مش بيدعم مكتبة "crypto" بتاعة Node)
// =====================================================================

const COOKIE_NAME = "eleryan_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 ساعات

function utf8ToBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUtf8(b64url) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function bufferToBase64Url(buf) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET غير موجود في .env.local - لازم تضيفه (نص عشوائي طويل).");
  }
  return secret;
}

async function hmacSign(payloadB64) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return bufferToBase64Url(sig);
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

// بيبني توكن الجلسة: payload.signature
export async function createSessionToken(data) {
  const payload = { ...data, exp: Date.now() + SESSION_TTL_MS };
  const payloadB64 = utf8ToBase64Url(JSON.stringify(payload));
  const signature = await hmacSign(payloadB64);
  return `${payloadB64}.${signature}`;
}

// بيتحقق من التوكن ويرجع البيانات، أو null لو باطل/منتهي/متلاعب فيه
export async function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedSignature = await hmacSign(payloadB64);
  if (!constantTimeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(base64UrlToUtf8(payloadB64));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);

// دالة هاش كلمة المرور - نفس طريقة SHA-256 المستخدمة سابقًا في المتصفح
// عشان الحسابات الحالية المخزنة في Firestore تفضل شغالة من غير ما نطلب من
// الموظفين تغيير كلمة المرور. (توصية: الترقية لـ bcrypt/scrypt لاحقًا)
export async function hashPasswordServer(password) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
