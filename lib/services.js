import { cache } from "react";
import { getAdminDb } from "@/lib/firebaseAdmin";

// جلب كل الخدمات (مرتبة بنفس ترتيب العرض في صفحة "خدماتنا")
export const getAllServices = cache(async function getAllServices() {
  const db = getAdminDb();
  const snap = await db.collection("office_services").orderBy("order", "asc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
});

// جلب خدمة واحدة بالـ slug بتاعها - بيتعمله cache عشان لو
// generateMetadata والصفحة نفسها طلبوا نفس الخدمة، السيرفر ميعملش نداءين لقاعدة البيانات
export const getServiceBySlug = cache(async function getServiceBySlug(slug) {
  if (!slug) return null;
  const db = getAdminDb();
  const snap = await db
    .collection("office_services")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
});
