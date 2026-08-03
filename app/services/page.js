import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileSidebar from "@/components/MobileSidebar";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | خدمات المكتب",
};

export default function ServicesPage() {
  return (
    <>
      <FirebaseScripts />

      <SiteHeader />

      <section className="hero" style={{ height: "50vh" }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animate-drop" data-en="Office Services">
            خدمات المكتب
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-header reveal">
          <h2 data-en="Our Comprehensive Service Package">باقة خدماتنا الشاملة</h2>
          <div className="line"></div>
        </div>
        <div className="services-container" id="servicesContainerPublic" suppressHydrationWarning>
          <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
            جاري تحميل الخدمات...
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
