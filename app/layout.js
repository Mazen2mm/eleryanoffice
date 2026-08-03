import "./globals.css";

export const metadata = {
  title: "مكتب هاني العريان",
  description:
    "مكتب هاني العريان للاستشارات المالية والضريبية - محاسب قانوني وخبير ضريبي",
  icons: {
    icon: "/1.png",
    shortcut: "/1.png",
  },
  verification: {
    google: "lKVt0uUnsfBrd8kQhoSXJ7uK0UDYX-VyQcwuPzcnB0U",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

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
      <body>{children}</body>
    </html>
  );
}
