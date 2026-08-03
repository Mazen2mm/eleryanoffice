import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | بيانات الشركات",
};

export default function AdminCompaniesPage() {
  return (
    <>
      <FirebaseScripts />

      <AdminBody style={{ alignItems: "flex-start", padding: "20px 10px" }}>
        <div className="dashboard" style={{ maxWidth: "100%" }}>
          <AdminHeader
            title="بيانات الشركات والمنظومات"
            extraClass="sticky-companies-header"
          />

          <div className="admin-panel active">
            <div className="panel-toolbar">
              <h2>إضافة شركة جديدة</h2>
            </div>
            <div className="add-company-row" id="addCompanyRow">
              <input type="text" id="nc_name" placeholder="اسم الشركة *" required />
              <select id="nc_type">
                <option value="شركة">شركة</option>
                <option value="فردي">فردي</option>
              </select>
              <select id="nc_system">
                <option value="منظومه جديدة">منظومه جديدة</option>
                <option value="منظومة قديمة">منظومة قديمة</option>
              </select>
              <input type="email" id="nc_email" placeholder="الايميل" />
              <input type="text" id="nc_emailpass" placeholder="باسورد الايميل" />
              <input type="text" id="nc_sysuser" placeholder="يوزر المنظومة" />
              <input type="text" id="nc_syspass" placeholder="باسورد المنظومة" />
              <input type="text" id="nc_natid" placeholder="الرقم القومي" />
              <input type="text" id="nc_regno" placeholder="رقم التسجيل" />
              <input type="text" id="nc_einvuser" placeholder="يوزر الفاتورة الإلكترونية" />
              <input type="text" id="nc_einvpass" placeholder="باسورد الفاتورة الإلكترونية" />
              <input type="text" id="nc_piencode" placeholder="pien code" />
              <input type="text" id="nc_salaries" placeholder="المرتبات" />
              <input type="text" id="nc_acccode" placeholder="كود المحاسب" />
              <input type="text" id="nc_accpass" placeholder="باسورد المحاسب" />
              <input type="text" id="nc_notes" placeholder="ملاحظات" />
              <button id="addCompanyBtn">
                <i className="fa-solid fa-plus"></i> إضافة الشركة
              </button>
            </div>
          </div>

          <div className="admin-panel active" style={{ marginTop: "20px", padding: 0 }}>
            <div className="panel-toolbar" style={{ padding: "16px 20px" }}>
              <h2>
                قائمة الشركات{" "}
                <span
                  id="compDataCount"
                  suppressHydrationWarning
                  style={{ color: "#888", fontSize: "0.9rem", fontWeight: 400 }}
                ></span>
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  id="undoCompanyBtn"
                  className="logout-btn"
                  style={{ background: "#eef2f7", borderColor: "#ccd6e0", color: "#0a192f" }}
                  title="تراجع عن آخر تعديل"
                >
                  <i className="fa-solid fa-rotate-left"></i> تراجع
                </button>
                <button
                  type="button"
                  id="redoCompanyBtn"
                  className="logout-btn"
                  style={{ background: "#eef2f7", borderColor: "#ccd6e0", color: "#0a192f" }}
                  title="إعادة آخر تعديل"
                >
                  <i className="fa-solid fa-rotate-right"></i> إعادة
                </button>
                <div className="search-wrap">
                  <input
                    type="text"
                    id="compDataSearch"
                    className="company-search"
                    placeholder="بحث..."
                  />
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
              </div>
            </div>
            <div className="companies-data-table-wrap">
              <table className="companies-data-table">
                <thead>
                  <tr>
                    <th rowSpan={2} className="col-idx">
                      م
                    </th>
                    <th rowSpan={2} className="col-company">
                      اسم الشركة
                    </th>
                    <th rowSpan={2}>رقم التسجيل</th>
                    <th rowSpan={2}>النوع</th>
                    <th rowSpan={2}>نوع المنظومة</th>
                    <th colSpan={2}>الايميل</th>
                    <th colSpan={2}>المنظومة</th>
                    <th rowSpan={2}>الرقم القومي</th>
                    <th colSpan={4}>الفاتورة الإلكترونية</th>
                    <th rowSpan={2}>كود المحاسب</th>
                    <th rowSpan={2}>باسورد المحاسب</th>
                    <th rowSpan={2}>ملاحظات</th>
                    <th rowSpan={2}>حذف</th>
                  </tr>
                  <tr>
                    <th>اسم المستخدم</th>
                    <th>الباسورد</th>
                    <th>رقم التسجيل</th>
                    <th>الباسورد</th>
                    <th>اسم المستخدم</th>
                    <th>الباسورد</th>
                    <th>pien code</th>
                    <th>المرتبات</th>
                  </tr>
                </thead>
                <tbody id="compDataTbody" suppressHydrationWarning>
                  <tr>
                    <td colSpan={18} style={{ padding: "30px", color: "#999" }}>
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
