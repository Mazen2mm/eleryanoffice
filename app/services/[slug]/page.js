import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileSidebar from "@/components/MobileSidebar";
import { getAllServices, getServiceBySlug } from "@/lib/services";

// إعادة توليد الصفحة كل ساعة عشان أي تعديل في لوحة الأدمن يظهر
// من غير ما نحتاج نعمل Deploy جديد على Vercel
export const revalidate = 300;

// تجهيز الصفحات المعروفة وقت الـ build (تحسين أداء + أرشفة أسرع)
// لو خدمة جديدة اتضافت بعد الـ build، هتتبني تلقائي أول ما حد يزورها
export async function generateStaticParams() {
  try {
    const services = await getAllServices();
    return services
      .filter((s) => s.slug)
      .map((s) => ({ slug: s.slug }));
  } catch (e) {
    console.error("generateStaticParams(services) failed:", e);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return { title: "الخدمة غير موجودة" };
  }

  const title = service.metaTitle || service.name;
  const description =
    service.metaDescription || service.description || undefined;
  const keywords = service.keywords
    ? service.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: service.imageUrl ? [service.imageUrl] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const faqs = Array.isArray(service.faqs) ? service.faqs.filter((f) => f && f.q) : [];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description || service.fullDescription || undefined,
    provider: {
      "@type": "AccountingService",
      name: "مكتب هاني العريان",
    },
    ...(service.imageUrl ? { image: service.imageUrl } : {}),
  };

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a || "",
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <SiteHeader />

      <section className="hero" style={{ height: "45vh" }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animate-drop">{service.name}</h1>
          {service.description && <p>{service.description}</p>}
        </div>
      </section>

      <section className="section-padding">
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
          }}
        >
          {service.imageUrl && (
            <img
              src={service.imageUrl}
              alt={service.name}
              style={{
                width: "100%",
                maxHeight: "380px",
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />
          )}

          {service.fullDescription && (
            <div
              style={{
                lineHeight: 2,
                fontSize: "1.05rem",
                color: "#444",
                whiteSpace: "pre-line",
              }}
            >
              {service.fullDescription}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <a
              href="/contact"
              className="cta-btn"
              style={{
                display: "inline-block",
                padding: "14px 34px",
                borderRadius: "50px",
                background: "var(--main-color, #b8860b)",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              تواصل معنا بخصوص هذه الخدمة
            </a>
          </div>

          {faqs.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <div className="section-header reveal" style={{ marginBottom: "25px" }}>
                <h2>أسئلة شائعة</h2>
                <div className="line"></div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {faqs.map((item, idx) => (
                  <details
                    key={idx}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: "12px",
                      padding: "14px 18px",
                      background: "#fafafa",
                    }}
                  >
                    <summary
                      style={{ cursor: "pointer", fontWeight: 700, color: "#222" }}
                    >
                      {item.q}
                    </summary>
                    {item.a && (
                      <p style={{ marginTop: "10px", color: "#555", lineHeight: 1.9 }}>
                        {item.a}
                      </p>
                    )}
                  </details>
                ))}
              </div>
            </div>
          )}
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
