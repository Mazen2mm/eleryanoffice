import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | إدارة المدونة",
};

export default function AdminBlogPage() {
  return (
    <>
      <FirebaseScripts storage />

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
                placeholder="وصف مختصر (يظهر في الكارت)"
                style={{ flex: 1, minWidth: "200px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", color: "#555" }}>صورة المقال (اختياري)</label>
                <input type="file" id="newBlogImage" accept="image/*" />
              </div>
              <button id="addBlogBtn" type="button">
                <i className="fa-solid fa-plus"></i> إضافة المقال
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                alignItems: "flex-start",
                padding: "0 20px 20px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: "220px" }}>
                <label style={{ fontSize: "0.85rem", color: "#555" }}>
                  اختياري
                </label>
                <input
                  type="text"
                  id="newBlogLink"
                  dir="ltr"
                  placeholder="https://..."
                  style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: "220px" }}>
                <label style={{ fontSize: "0.85rem", color: "#555" }}>
                  Slug: <bdi dir="ltr">tips-tax-2026</bdi>
                </label>
                <input
                  type="text"
                  id="newBlogSlug"
                  dir="ltr"
                  placeholder="tips-tax-2026"
                  style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div style={{ padding: "0 20px 20px" }}>
              <label style={{ fontSize: "0.85rem", color: "#555" }}>محتوى المقال الكامل </label>
              <textarea
                id="newBlogBody"
                placeholder="اكتب محتوى المقال هنا..."
                rows={5}
                style={{ width: "100%", marginTop: "6px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px", fontFamily: "inherit", resize: "vertical" }}
              ></textarea>
            </div>

            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                alignItems: "flex-start",
                padding: "0 20px 20px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: "220px" }}>
                <label style={{ fontSize: "0.85rem", color: "#555" }}>Meta Title (اختياري)</label>
                <input
                  type="text"
                  id="newBlogMetaTitle"
                  placeholder="عنوان الصفحة في نتائج جوجل"
                  style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 2, minWidth: "260px" }}>
                <label style={{ fontSize: "0.85rem", color: "#555" }}>Meta Description (اختياري)</label>
                <input
                  type="text"
                  id="newBlogMetaDesc"
                  placeholder="الوصف اللي هيظهر تحت العنوان في نتائج جوجل"
                  style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: "220px" }}>
                <label style={{ fontSize: "0.85rem", color: "#555" }}>Keywords (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  id="newBlogKeywords"
                  placeholder="ضرائب مصر, إقرار ضريبي"
                  style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
                />
              </div>
            </div>
          </div>

          <div className="admin-panel active" style={{ marginTop: "20px", padding: "20px" }}>
            <div className="panel-toolbar">
              <h2>المقالات الحالية</h2>
            </div>
            <div id="blogAdminList" suppressHydrationWarning>
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
