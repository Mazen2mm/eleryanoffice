import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileSidebar from "@/components/MobileSidebar";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | من نحن",
};

export default function AboutPage() {
  return (
    <>
      <FirebaseScripts />

      <SiteHeader />

      <section className="hero" style={{ height: "50vh" }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animate-drop" data-en="About Us">
            من نحن
          </h1>
          <h2 className="animate-fade-in" data-en="Over 20 Years of Experience">
            خبرة لأكثر من 20 عاماً
          </h2>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-header reveal">
          <h2 data-en="Mr. Hany El-Eryan">الأستاذ / هاني العريان</h2>
          <div className="line"></div>
        </div>

        <div className="about-profile-container">
          <div className="profile-image-wrapper reveal">
            <img src="/mazen.jpg" alt="الأستاذ هاني العريان" className="profile-img" />
          </div>

          <div className="profile-text-wrapper reveal">
            <div className="service-card">
              <div className="icon-wrapper">
                <i className="fa-solid fa-star"></i>
              </div>
              <h3 data-en="Our Vision &amp; Expertise">رؤيتنا وخبرتنا</h3>
              <p data-en="Hany El-Eryan Office for Financial and Tax Consulting is a specialized firm offering integrated accounting and tax solutions, with over 20 years of experience in accounting, auditing, and tax consulting. Over the years, the office has supported numerous companies of varying activities and sizes by organizing and managing their financial and administrative operations in line with Egyptian laws and approved accounting and auditing standards. We are committed to delivering professional services built on accuracy, transparency, and responsiveness, adopting a practical approach aimed at reducing risk, strengthening control, enhancing financial performance, and building long-term partnerships based on trust and commitment.">
                يُعد مكتب هاني العريان للاستشارات المالية والضريبية من المكاتب
                المتخصصة في تقديم الحلول المحاسبية والضريبية المتكاملة، بخبرة
                تمتد لأكثر من 20 عامًا في مجال المحاسبة والمراجعة والاستشارات
                الضريبية. على مدار سنوات الخبرة، ساهم المكتب في دعم العديد من
                الشركات بمختلف أنشطتها وأحجامها، من خلال تنظيم وإدارة أعمالها
                المالية والإدارية بما يتوافق مع القوانين المصرية ومعايير
                المحاسبة والمراجعة المعتمدة. نحرص على تقديم خدمات احترافية
                قائمة على الدقة والشفافية وسرعة الاستجابة، مع تبني أسلوب عملي
                يهدف إلى تقليل المخاطر، إحكام الرقابة، وتعزيز الأداء المالي،
                وبناء شراكات طويلة الأمد قائمة على الثقة والالتزام.
              </p>
            </div>
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
