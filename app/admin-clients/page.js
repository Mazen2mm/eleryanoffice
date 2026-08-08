import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "مكتب هاني العريان | إدارة العملاء",
};

export default function AdminClientsPage() {
  return (
    <>
      <FirebaseScripts />

      <AdminBody style={{ alignItems: "flex-start", padding: "25px 15px" }}>
        <div className="dashboard">
          <AdminHeader title='إدارة العملاء (تظهر في صفحة "عملائنا")' />

          <div className="admin-panel active">
            <div className="panel-toolbar">
              <h2>إضافة عميل جديد</h2>
            </div>
            <form className="clients-admin-form" id="addClientForm">
              <input type="text" id="clientNameAr" placeholder="اسم الشركة بالعربي" required />
              <input type="text" id="clientNameEn" placeholder="اسم الشركة بالإنجليزي (اختياري)" />
              <button type="submit">
                <i className="fa-solid fa-plus"></i> إضافة
              </button>
            </form>
          </div>

          <div className="admin-panel active" style={{ marginTop: "20px" }}>
            <div className="panel-toolbar">
              <h2>قائمة العملاء الحالية</h2>
              <span id="clientsCount" style={{ color: "#777", fontSize: "0.9rem" }}></span>
            </div>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>م</th>
                    <th>اسم الشركة (عربي)</th>
                    <th>اسم الشركة (إنجليزي)</th>
                    <th>حذف</th>
                  </tr>
                </thead>
                <tbody id="clientsTableBody">
                  <tr>
                    <td colSpan={4}>جاري التحميل...</td>
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
