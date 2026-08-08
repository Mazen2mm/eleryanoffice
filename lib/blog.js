import { cache } from "react";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const getAllBlogPosts = cache(async function getAllBlogPosts() {
  const db = getAdminDb();
  const snap = await db.collection("blog_posts").orderBy("order", "asc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
});

export const getBlogPostBySlug = cache(async function getBlogPostBySlug(slug) {
  if (!slug) return null;
  const db = getAdminDb();
  const snap = await db
    .collection("blog_posts")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
});
