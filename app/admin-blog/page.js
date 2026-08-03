import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | إدارة المدونة",
};

export default function AdminBlogPage() {
  return (
    <>
      <FirebaseScripts />

      <AdminBody style={{ alignItems: "flex-start", padding: "25px 15px" }}>
        <div className="dashboard">
          <AdminHeader title="إدارة المدونة (تظهر في صفحة المدونة)" />

          <div className="admin-panel active">
            <div className="panel-toolbar">
              <h2>إضافة مقال جديد</h2>
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
                id="newBlogName"
                placeholder="اسم المقال"
                style={{ flex: 1, minWidth: "200px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
              />
              <input
                type="text"
                id="newBlogDesc"
                placeholder="وصف مختصر"
                style={{ flex: 1, minWidth: "200px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
              />
              <input
                type="text"
                id="newBlogLink"
                placeholder="الرابط (اختياري) https://..."
                dir="ltr"
                style={{ flex: 1, minWidth: "220px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
              />
              <button id="addBlogBtn" type="button">
                <i className="fa-solid fa-plus"></i> إضافة المقال
              </button>
            </div>
          </div>

          <div className="admin-panel active" style={{ marginTop: "20px" }}>
            <div className="panel-toolbar">
              <h2>المقالات الحالية</h2>
            </div>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>م</th>
                    <th>اسم المقال</th>
                    <th>الوصف</th>
                    <th>الرابط</th>
                    <th>حذف</th>
                  </tr>
                </thead>
                <tbody id="blogAdminTbody" suppressHydrationWarning>
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
        <i className="fa-solid fa-circle-check"></i> <span suppressHydrationWarning>تم الحفظ بنجاح</span>
      </div>

      <script src="/admin.js"></script>
    </>
  );
}
