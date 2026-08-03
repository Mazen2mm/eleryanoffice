import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | إدارة المستخدمين",
};

export default function AdminUsersPage() {
  return (
    <>
      <FirebaseScripts />

      <AdminBody style={{ alignItems: "flex-start", padding: "25px 15px" }}>
        <div className="dashboard">
          <AdminHeader title="إدارة المستخدمين" />

          <div className="admin-panel active">
            <div className="panel-toolbar">
              <h2>إضافة مستخدم جديد وتحديد الصلاحيات</h2>
            </div>
            <div
              className="add-user-form"
              style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "20px" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  id="newUsername"
                  placeholder="اسم المستخدم (username)"
                  style={{ flex: 1 }}
                />
                <input
                  type="password"
                  id="newPassword"
                  placeholder="كلمة المرور"
                  style={{ flex: 1 }}
                />
              </div>

              <div
                style={{
                  background: "rgba(212,175,55,0.06)",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                }}
              >
                <h4 style={{ marginBottom: "10px", color: "#0a192f" }}>اختر الصلاحيات:</h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "10px",
                  }}
                >
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" name="permission" value="declarations" /> إقرارات
                    ضريبية
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" name="permission" value="companies" /> بيانات الشركات
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" name="permission" value="clients" /> إدارة عملائنا
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" name="permission" value="users" /> إدارة المستخدمين
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" name="permission" value="attendance_click" /> تسجيل
                    الحضور والانصراف
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" name="permission" value="attendance_report" /> تقرير
                    الحضور والغياب
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" name="permission" value="einvoice" /> الفاتورة
                    الإلكترونية
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" name="permission" value="office_services" /> خدمات
                    المكتب
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" name="permission" value="blog" /> المدونة
                  </label>
                  <label style={{ cursor: "pointer" }}>
                    <input type="checkbox" name="permission" value="faq" /> الأسئلة (رسائل تواصل
                    معنا)
                  </label>
                </div>
              </div>

              <button
                id="addUserBtn"
                style={{ alignSelf: "flex-start", padding: "10px 30px" }}
              >
                <i className="fa-solid fa-plus"></i> إضافة المستخدم
              </button>
            </div>
          </div>

          <div className="admin-panel active" style={{ marginTop: "20px" }}>
            <div className="panel-toolbar">
              <h2>المستخدمون الحاليون</h2>
            </div>
            <div className="users-grid" id="usersGrid">
              <div style={{ padding: "20px", color: "#999" }}>جاري التحميل...</div>
            </div>
          </div>
        </div>
      </AdminBody>

      <div className="save-toast" id="saveToast">
        <i className="fa-solid fa-circle-check"></i> <span suppressHydrationWarning>تم الحفظ بنجاح</span>
      </div>

      <div className="edit-user-overlay" id="editUserOverlay">
        <div className="edit-user-modal">
          <h3>
            <i className="fa-solid fa-user-pen"></i> تعديل صلاحيات{" "}
            <span id="editUserName" suppressHydrationWarning style={{ color: "var(--gold)" }}></span>
          </h3>
          <div className="permissions-grid" id="editPermissionsGrid" suppressHydrationWarning></div>
          <div style={{ display: "flex", gap: "10px", marginTop: "22px", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="logout-btn"
              id="editUserCancel"
              style={{ background: "#eef2f7", borderColor: "#ccd6e0", color: "#0a192f" }}
            >
              إلغاء
            </button>
            <button type="button" id="editUserSave">
              <i className="fa-solid fa-floppy-disk"></i> حفظ التعديلات
            </button>
          </div>
        </div>
      </div>

      <script src="/admin.js"></script>
    </>
  );
}
