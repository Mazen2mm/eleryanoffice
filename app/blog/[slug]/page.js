import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileSidebar from "@/components/MobileSidebar";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts.filter((p) => p.slug && !p.link).map((p) => ({ slug: p.slug }));
  } catch (e) {
    console.error("generateStaticParams(blog) failed:", e);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return { title: "المقال غير موجود" };
  }

  const title = post.metaTitle || post.name;
  const description = post.metaDescription || post.description || undefined;
  const keywords = post.keywords
    ? post.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.name,
    description: post.description || undefined,
    ...(post.coverImage ? { image: post.coverImage } : {}),
    author: {
      "@type": "Organization",
      name: "مكتب هاني العريان",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <SiteHeader />

      <section className="hero" style={{ height: "45vh" }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animate-drop">{post.name}</h1>
          {post.description && <p>{post.description}</p>}
        </div>
      </section>

      <section className="section-padding">
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
          }}
        >
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.name}
              style={{
                width: "100%",
                maxHeight: "380px",
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />
          )}

          {post.body && (
            <div
              style={{
                lineHeight: 2,
                fontSize: "1.05rem",
                color: "#444",
                whiteSpace: "pre-line",
              }}
            >
              {post.body}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <a
              href="/blog"
              style={{
                display: "inline-block",
                padding: "12px 30px",
                borderRadius: "50px",
                border: "2px solid var(--main-color, #b8860b)",
                color: "var(--main-color, #b8860b)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              الرجوع لكل المقالات
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />

      <MobileSidebar />

      <script src="/admin.js"></script>
      <script src="/translate.js"></script>
      <script src="/script.js"></script>
    </>
  );
}
