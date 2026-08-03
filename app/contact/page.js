import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileSidebar from "@/components/MobileSidebar";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | تواصل معنا",
};

export default function ContactPage() {
  return (
    <>
      <FirebaseScripts />

      <SiteHeader />

      <section className="hero" style={{ height: "50vh" }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animate-drop" data-en="Contact Us">
            تواصل معنا
          </h1>
        </div>
      </section>

      <section className="section-padding dark-section">
        <div className="contact-wrapper reveal">
          <div className="contact-info">
            <a
              href="https://maps.app.goo.gl/FKJe9SjwRiPzWiNz8"
              target="_blank"
              rel="noreferrer"
              className="info-item"
              style={{ textDecoration: "none" }}
            >
              <i className="fa-solid fa-location-dot float-anim"></i>
              <p data-en="El Sedfawy Compound">كمبوند الصدفي</p>
            </a>
            <div className="info-item">
              <a
                href="https://wa.me/201016779182"
                target="_blank"
                rel="noreferrer"
                className="info-item track-whatsapp-click"
                style={{ textDecoration: "none" }}
              >
                <i
                  className="fa-brands fa-whatsapp float-anim"
                  style={{ animationDelay: "0.2s" }}
                ></i>
                <p data-en="01016779182 (WhatsApp)">01016779182 (واتساب)</p>
              </a>
            </div>
            <div className="info-item">
              <a
                href="tel:01050773678"
                className="info-item track-call-click"
                style={{ textDecoration: "none" }}
              >
                <i
                  className="fa-solid fa-phone float-anim"
                  style={{ animationDelay: "0.3s" }}
                ></i>
                <p data-en="01050773678 / 01008310982">
                  01050773678 / 01008310982
                </p>
              </a>
            </div>
            <div className="info-item">
              <a
                href="mailto:eleryanoffice@gmail.com"
                className="info-item"
                style={{ textDecoration: "none" }}
              >
                <i
                  className="fa-solid fa-envelope float-anim"
                  style={{ animationDelay: "0.4s" }}
                ></i>
                <p>eleryanoffice@gmail.com</p>
              </a>
            </div>
          </div>
          <form id="contactForm" className="glass-form">
            <div className="input-group">
              <input type="text" id="name" required />
              <label data-en="Full Name">الاسم الكامل</label>
              <span className="focus-border"></span>
            </div>
            <div className="input-group">
              <input type="text" id="phone" required />
              <label data-en="Phone Number">رقم الهاتف</label>
              <span className="focus-border"></span>
            </div>
            <div className="input-group">
              <textarea id="message" required></textarea>
              <label data-en="Your message or inquiry">رسالتك أو استفسارك</label>
              <span className="focus-border"></span>
            </div>
            <button type="submit" className="submit-btn">
              <span data-en="Send Request">إرسال الطلب</span>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </section>

      <SiteFooter minimal />

      <div className="toast" id="toastMessage">
        تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
      </div>

      <MobileSidebar />

      <script src="/admin.js"></script>
      <script src="/translate.js"></script>
      <script src="/script.js"></script>
    </>
  );
}
