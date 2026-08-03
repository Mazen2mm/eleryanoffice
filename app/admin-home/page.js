import AdminBody from "@/components/AdminBody";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | لوحة التحكم الرئيسية",
};

export default function AdminHomePage() {
  return (
    <>
      <FirebaseScripts />

      <AdminBody style={{ alignItems: "flex-start", padding: "40px 15px" }}>
        <div className="admin-home-wrapper">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "40px",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div className="admin-welcome" style={{ marginBottom: 0, textAlign: "right" }}>
              <img src="/4.png" alt="لوجو" style={{ height: "65px", marginBottom: "15px" }} />
              <h1
                id="welcomeTitle"
                suppressHydrationWarning
                suppressHydrationWarning
                style={{ color: "var(--gold)", fontSize: "2rem", marginBottom: "10px" }}
              >
                أهلاً بك
              </h1>
              <p style={{ color: "var(--text-light)" }}>برجاء اختيار الخدمة المتاحة لك</p>
            </div>

            <button
              className="logout-btn"
              id="logoutBtn"
              style={{
                background: "rgba(231, 76, 60, 0.1)",
                borderColor: "#e74c3c",
                color: "#e74c3c",
                padding: "10px 20px",
              }}
            >
              <i className="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
            </button>
          </div>

          <div
            id="adminHomeStats"
            style={{
              display: "flex",
              gap: "18px",
              flexWrap: "wrap",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                flex: "1",
                minWidth: "200px",
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <i className="fa-solid fa-envelope-open-text" style={{ fontSize: "1.6rem", color: "var(--gold)" }}></i>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800 }} id="statContactMessages" suppressHydrationWarning>-</div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>رسائل تواصل معنا</div>
              </div>
            </div>
            <div
              style={{
                flex: "1",
                minWidth: "200px",
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <i className="fa-brands fa-whatsapp" style={{ fontSize: "1.6rem", color: "#2ecc71" }}></i>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800 }} id="statWhatsappClicks" suppressHydrationWarning>-</div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>ضغطات واتساب</div>
              </div>
            </div>
            <div
              style={{
                flex: "1",
                minWidth: "200px",
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <i className="fa-solid fa-phone" style={{ fontSize: "1.6rem", color: "#3498db" }}></i>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800 }} id="statCallClicks" suppressHydrationWarning>-</div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>ضغطات اتصل بنا</div>
              </div>
            </div>
          </div>

          <div className="admin-home-grid">
            <a href="/admin-companies" className="admin-home-card" data-permission="companies">
              <i className="fa-solid fa-database"></i>
              <h3>بيانات الشركات</h3>
              <p>الأيميلات والمنظومات والباسوردات الخاصة بكل شركة</p>
            </a>
            <a
              href="/attendance"
              className="admin-home-card"
              data-permission="attendance_click"
              style={{ borderColor: "#2ecc71" }}
            >
              <i className="fa-solid fa-user-clock" style={{ color: "#2ecc71" }}></i>
              <h3>تسجيل الحضور والانصراف</h3>
              <p>للموظفين لإثبات الحضور والمغادرة اليومي</p>
            </a>
            <a
              href="/attendance-report"
              className="admin-home-card"
              data-permission="attendance_report"
              style={{ borderColor: "#e74c3c" }}
            >
              <i className="fa-solid fa-clipboard-list" style={{ color: "#e74c3c" }}></i>
              <h3>تقرير الحضور والغياب</h3>
              <p>عرض كشوفات وتوقيتات حضور الموظفين</p>
            </a>
            <a href="/e-invoice" className="admin-home-card" data-permission="declarations">
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <h3>الفاتورة الإلكترونية</h3>
              <p>لإنشاء وإدارة الفواتير الإلكترونية وعرض التقارير</p>
            </a>            
            <a href="/admin-dashboard#vat" className="admin-home-card" data-permission="declarations">
              <i className="fa-solid fa-receipt"></i>
              <h3>إقرار القيمة المضافة</h3>
              <p>متابعة شهرية لكل شركة</p>
            </a>
            <a
              href="/admin-dashboard#withholding"
              className="admin-home-card"
              data-permission="declarations"
            >
              <i className="fa-solid fa-file-invoice"></i>
              <h3>إقرار الخصم والإضافة</h3>
              <p>متابعة شهرية لكل شركة</p>
            </a>
            <a href="/admin-dashboard#payroll" className="admin-home-card" data-permission="declarations">
              <i className="fa-solid fa-money-check-dollar"></i>
              <h3>إقرار المرتبات</h3>
              <p>متابعة شهرية لكل شركة</p>
            </a>
            <a href="/admin-dashboard#income" className="admin-home-card" data-permission="declarations">
              <i className="fa-solid fa-sack-dollar"></i>
              <h3>إقرار الدخل</h3>
              <p>متابعة سنوية لكل شركة</p>
            </a>
            <a href="/admin-clients" className="admin-home-card" data-permission="clients">
              <i className="fa-solid fa-handshake"></i>
              <h3>عملائنا</h3>
              <p>الشركات التي تظهر في صفحة "عملائنا"</p>
            </a>
            <a href="/admin-services" className="admin-home-card" data-permission="office_services">
              <i className="fa-solid fa-briefcase"></i>
              <h3>خدمات المكتب</h3>
              <p>الخدمات التي تظهر في صفحة "خدماتنا"</p>
            </a>            
            <a
              href="/admin-blog" className="admin-home-card" data-permission="blog">
              <i className="fa-solid fa-newspaper"></i>
              <h3>المدونة</h3>
              <p>إضافة وتعديل مقالات صفحة "المدونة"</p>
            </a>
            <a
              href="/admin-faq" className="admin-home-card" data-permission="faq">
              <i className="fa-solid fa-envelope-open-text"></i>
              <h3>الأسئلة</h3>
              <p>رسائل العملاء المرسلة من صفحة "تواصل معنا"</p>
            </a>
            <a href="/admin-users" className="admin-home-card" data-permission="users">
              <i className="fa-solid fa-users-gear"></i>
              <h3>إدارة المستخدمين</h3>
              <p>إضافة وحذف حسابات الدخول وتحديد الصلاحيات</p>
            </a>
          </div>
        </div>
      </AdminBody>

      <script src="/admin.js"></script>
      <script src="/admin-home-init.js"></script>
    </>
  );
}
