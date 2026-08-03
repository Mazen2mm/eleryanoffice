import { getAllServices } from "@/lib/services";
import { getAllBlogPosts } from "@/lib/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eleryan-office.vercel.app";

export default async function sitemap() {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/clients",
    "/blog",
    "/contact",
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  let serviceEntries = [];
  try {
    const services = await getAllServices();
    serviceEntries = services
      .filter((s) => s.slug)
      .map((s) => ({
        url: `${siteUrl}/services/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      }));
  } catch (e) {
    console.error("sitemap: failed to load services", e);
  }

  let blogEntries = [];
  try {
    const posts = await getAllBlogPosts();
    blogEntries = posts
      .filter((p) => p.slug && !p.link) // بوستات بروابط خارجية (link) مالهاش صفحة داخلية
      .map((p) => ({
        url: `${siteUrl}/blog/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      }));
  } catch (e) {
    console.error("sitemap: failed to load blog posts", e);
  }

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
