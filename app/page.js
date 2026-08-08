import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileSidebar from "@/components/MobileSidebar";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | الرئيسية",
};

export default function HomePage() {
  return (
    <>
      <FirebaseScripts />

      <SiteHeader />

      <section id="home" className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animate-drop" data-en="Hany El-Eryan">
            هاني العريان
          </h1>
          <h2 className="animate-fade-in" data-en="Chartered Accountant &amp; Tax Expert">
            محاسب قانوني وخبير ضريبي
          </h2>
          <p
            className="animate-slide-up"
            data-en="Your trusted partner for financial success, tax stability, and legal compliance for over 20 years"
          >
            شريكك الموثوق للنجاح المالي، الاستقرار الضريبي، والامتثال القانوني
            لأكثر من 20 عاما
          </p>
          <a href="/services" className="cta-button animate-bounce">
            <span data-en="Discover Our Services">اكتشف خدماتنا</span>{" "}
            <i className="fa-solid fa-arrow-down"></i>
          </a>
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
