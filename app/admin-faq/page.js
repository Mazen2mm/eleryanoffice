import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "مكتب هاني العريان | الأسئلة",
};

export default function AdminFaqPage() {
  return (
    <>
      <FirebaseScripts />

      <AdminBody style={{ alignItems: "flex-start", padding: "25px 15px" }}>
        <div className="dashboard">
          <AdminHeader title='الأسئلة (رسائل صفحة "تواصل معنا")' />

          <div
            style={{
              display: "flex",
              gap: "18px",
              flexWrap: "wrap",
              marginBottom: "20px",
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
            <button
              id="resetStatsBtn"
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(231,76,60,0.08)",
                border: "1px solid #e74c3c",
                color: "#e74c3c",
                borderRadius: "12px",
                padding: "0 20px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <i className="fa-solid fa-rotate-left"></i> إعادة ضبط العداد
            </button>
          </div>


          <div className="admin-panel active" style={{ padding: "20px" }}>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>رقم الهاتف</th>
                    <th>الرسالة</th>
                    <th>التاريخ</th>
                    <th>حذف</th>
                  </tr>
                </thead>
                <tbody id="faqTbody" suppressHydrationWarning>
                  <tr>
                    <td colSpan={5} style={{ color: "#999" }}>
                      جاري التحميل...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminBody>

      <div className="save-toast" id="saveToast">
        <i className="fa-solid fa-circle-check"></i> <span>تم الإجراء بنجاح</span>
      </div>

      <script src="/admin.js"></script>
    </>
  );
}
