import "./globals.css";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eleryan-office.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "مكتب هاني العريان",
    template: "%s | مكتب هاني العريان",
  },
  description:
    "مكتب هاني العريان للاستشارات المالية والضريبية - محاسب قانوني وخبير ضريبي",
  icons: {
    icon: "/1.png",
    shortcut: "/1.png",
  },
  verification: {
    // ضع هنا كود التحقق من Google Search Console (Meta tag verification)
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    siteName: "مكتب هاني العريان",
    title: "مكتب هاني العريان",
    description:
      "مكتب هاني العريان للاستشارات المالية والضريبية - محاسب قانوني وخبير ضريبي",
    images: ["/1.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        {children}

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
