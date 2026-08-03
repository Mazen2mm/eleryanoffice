import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | خدمات المكتب",
};

export default function AdminServicesPage() {
  return (
    <>
      <FirebaseScripts storage />

      <AdminBody style={{ alignItems: "flex-start", padding: "25px 15px" }}>
        <div className="dashboard">
          <AdminHeader title="إدارة خدمات المكتب (تظهر في صفحة خدماتنا)" />

          <div className="admin-panel active">
            <div className="panel-toolbar">
              <h2>إضافة خدمة جديدة</h2>
            </div>
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                alignItems: "flex-start",
                padding: "20px",
              }}
            >
              <input
                type="text"
                id="newServiceName"
                placeholder="اسم الخدمة"
                style={{ flex: 1, minWidth: "200px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
              />
              <textarea
                id="newServiceDesc"
                placeholder="وصف الخدمة"
                rows={2}
                style={{
                  flex: 2,
                  minWidth: "260px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              ></textarea>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", color: "#555" }}>صورة الخدمة (اختياري)</label>
                <input type="file" id="newServiceImage" accept="image/*" />
              </div>
              <button id="addServiceBtn" type="button">
                <i className="fa-solid fa-plus"></i> إضافة الخدمة
              </button>
            </div>
          </div>

          <div className="admin-panel active" style={{ marginTop: "20px", padding: "20px" }}>
            <div className="panel-toolbar">
              <h2>الخدمات الحالية</h2>
              <span style={{ color: "#888", fontSize: "0.85rem" }}>
                استخدم الأسهم لترتيب ظهور الخدمات بصفحة "خدماتنا"
              </span>
            </div>
            <div id="servicesAdminList" suppressHydrationWarning>
              <div style={{ padding: "20px", color: "#999" }}>جاري التحميل...</div>
            </div>
          </div>
        </div>
      </AdminBody>

      <div className="save-toast" id="saveToast">
        <i className="fa-solid fa-circle-check"></i> <span suppressHydrationWarning>تم الحفظ بنجاح</span>
      </div>

      <script src="/admin.js"></script>
    </>
  );
}
