import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileSidebar from "@/components/MobileSidebar";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | عملائنا",
};

export default function ClientsPage() {
  return (
    <>
      <FirebaseScripts />

      <SiteHeader />

      <section className="hero" style={{ height: "50vh" }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animate-drop" data-en="Partners in Success">
            شركاء النجاح
          </h1>
        </div>
      </section>

      <section className="section-padding dark-section text-white">
        <div className="section-header reveal">
          <h2 data-en="Our Valued Clients">عملائنا المتميزون</h2>
          <div className="line"></div>
        </div>

        <div
          className="marquee-container"
          id="clientsMarquee"
          dir="ltr"
          style={{ marginTop: "40px" }}
        >
          <div style={{ textAlign: "center", padding: "20px", color: "#fff" }}>
            جاري تحميل شركاء النجاح...
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
