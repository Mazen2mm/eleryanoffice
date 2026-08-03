const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eleryan-office.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin-login",
          "/admin-home",
          "/admin-dashboard",
          "/admin-clients",
          "/admin-companies",
          "/admin-users",
          "/admin-services",
          "/admin-blog",
          "/admin-faq",
          "/attendance",
          "/attendance-report",
          "/e-invoice",
          "/no-permission",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
