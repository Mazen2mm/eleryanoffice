import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | لوحة التحكم",
};

export default function AdminDashboardPage() {
  return (
    <>
      <FirebaseScripts xlsx />

      <AdminBody style={{ alignItems: "flex-start", padding: "25px 15px" }}>
        <div className="dashboard">
          <AdminHeader title="لوحة تحكم الإقرارات الضريبية" />

          <div className="admin-tabs">
            <button className="admin-tab-btn active" data-tab="vat">
              <i className="fa-solid fa-receipt"></i> إقرار القيمة المضافة
            </button>
            <button className="admin-tab-btn" data-tab="withholding">
              <i className="fa-solid fa-file-invoice"></i> إقرار الخصم والإضافة
            </button>
            <button className="admin-tab-btn" data-tab="payroll">
              <i className="fa-solid fa-money-check-dollar"></i> إقرار المرتبات
            </button>
            <button className="admin-tab-btn" data-tab="income">
              <i className="fa-solid fa-sack-dollar"></i> إقرار الدخل السنوي
            </button>
          </div>

          <div className="admin-panel active" id="panel-vat">
            <div className="panel-toolbar">
              <h2>إقرار القيمة المضافة (شهري)</h2>
              <div className="search-wrap">
                <input
                  type="text"
                  className="company-search"
                  data-panel="vat"
                  placeholder="بحث باسم الشركة..."
                />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>

            <div
              className="tax-converter-box"
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "25px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  color: "#0a192f",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "1.2rem",
                }}
              >
                <i
                  className="fa-solid fa-file-csv"
                  style={{ color: "#d4af37", fontSize: "1.4rem" }}
                ></i>
                <span>منظومة تحويل فواتير القيمة المضافة (Excel إلى CSV المعتمد)</span>
              </h3>

              <div style={{ display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 700,
                      color: "#4a5568",
                      fontSize: "0.9rem",
                    }}
                  >
                    نوع المنظومة:
                  </label>
                  <select
                    id="systemType"
                    style={{
                      width: "100%",
                      padding: "11px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      backgroundColor: "#f8fafc",
                      fontWeight: 600,
                      outline: "none",
                    }}
                  >
                    <option value="new">منظومة جديدة</option>
                    <option value="old">منظومة قديمة</option>
                  </select>
                </div>

                <div style={{ flex: 1, minWidth: "180px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 700,
                      color: "#4a5568",
                      fontSize: "0.9rem",
                    }}
                  >
                    1. نوع المعاملة الدفترية:
                  </label>
                  <select
                    id="taxInvoiceType"
                    style={{
                      width: "100%",
                      padding: "11px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      backgroundColor: "#f8fafc",
                      fontWeight: 600,
                      outline: "none",
                    }}
                  >
                    <option value="sales">شيت مبيعات المنظومة (Sales)</option>
                    <option value="purchases">شيت مشتريات المنظومة (Purchases)</option>
                  </select>
                </div>

                <div style={{ flex: 2, minWidth: "280px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 700,
                      color: "#4a5568",
                      fontSize: "0.9rem",
                    }}
                  >
                    2. اختر ملف الإكسل المستخرج:
                  </label>
                  <input
                    type="file"
                    id="taxExcelFile"
                    accept=".xlsx, .xls, .csv"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "2px dashed #cbd5e1",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: "160px" }}>
                  <button
                    id="taxCsvBtn"
                    style={{
                      width: "100%",
                      background: "#0a192f",
                      color: "#d4af37",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <i className="fa-solid fa-file-arrow-down"></i>
                    <span>تحويل وتصدير CSV</span>
                  </button>
                </div>
              </div>
              <div
                id="taxConverterStatus"
                style={{ marginTop: "12px", fontWeight: 700, fontSize: "0.95rem", minHeight: "20px" }}
              ></div>
            </div>

            <div className="decl-add-row">
              <input type="text" id="addDeclInput-vat" placeholder="اسم الشركة الجديدة" />
              <button id="addDeclBtn-vat" data-decl-type="vat">
                <i className="fa-solid fa-plus"></i> إضافة شركة
              </button>
            </div>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>م</th>
                    <th>اسم الشركة</th>
                    <th>اسم الشخص المسئول</th>
                    <th>الشهر</th>
                    <th>السنة</th>
                    <th>حذف</th>
                  </tr>
                </thead>
                <tbody id="tbody-vat"></tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel" id="panel-withholding">
            <div className="panel-toolbar">
              <h2>إقرار الخصم والإضافة (شهري)</h2>
              <div className="search-wrap">
                <input
                  type="text"
                  className="company-search"
                  data-panel="withholding"
                  placeholder="بحث باسم الشركة..."
                />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
            <div className="decl-add-row" style={{ display: "none" }}>
              <input type="text" id="addDeclInput-withholding" placeholder="اسم الشركة الجديدة" />
              <button id="addDeclBtn-withholding" data-decl-type="withholding">
                <i className="fa-solid fa-plus"></i> إضافة شركة
              </button>
            </div>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>م</th>
                    <th>اسم الشركة</th>
                    <th>اسم الشخص المسئول</th>
                    <th>الشهر</th>
                    <th>السنة</th>
                  </tr>
                </thead>
                <tbody id="tbody-withholding"></tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel" id="panel-payroll">
            <div className="panel-toolbar">
              <h2>إقرار المرتبات (شهري)</h2>
              <div className="search-wrap">
                <input
                  type="text"
                  className="company-search"
                  data-panel="payroll"
                  placeholder="بحث باسم الشركة..."
                />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>

            <div
              className="tax-converter-box"
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "25px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  color: "#0a192f",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "1.2rem",
                }}
              >
                <i
                  className="fa-solid fa-money-check-dollar"
                  style={{ color: "#27ae60", fontSize: "1.4rem" }}
                ></i>
                <span>منظومة تحويل إقرار المرتبات (Excel إلى CSV المعتمد)</span>
              </h3>

              <div style={{ display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ flex: 2, minWidth: "280px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 700,
                      color: "#4a5568",
                      fontSize: "0.9rem",
                    }}
                  >
                    اختر ملف الإكسل (شيت الموظفين):
                  </label>
                  <input
                    type="file"
                    id="payrollExcelFile"
                    accept=".xlsx, .xls, .csv"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "2px dashed #cbd5e1",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: "160px" }}>
                  <button
                    id="payrollCsvBtn"
                    style={{
                      width: "100%",
                      background: "#0a192f",
                      color: "#27ae60",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <i className="fa-solid fa-file-arrow-down"></i>
                    <span>تحويل وتصدير CSV</span>
                  </button>
                </div>
              </div>
              <div
                id="payrollConverterStatus"
                style={{ marginTop: "12px", fontWeight: 700, fontSize: "0.95rem", minHeight: "20px" }}
              ></div>
            </div>

            <div className="decl-add-row" style={{ display: "none" }}>
              <input type="text" id="addDeclInput-payroll" placeholder="اسم الشركة الجديدة" />
              <button id="addDeclBtn-payroll" data-decl-type="payroll">
                <i className="fa-solid fa-plus"></i> إضافة شركة
              </button>
            </div>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>م</th>
                    <th>اسم الشركة</th>
                    <th>اسم الشخص المسئول</th>
                    <th>الشهر</th>
                    <th>السنة</th>
                  </tr>
                </thead>
                <tbody id="tbody-payroll"></tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel" id="panel-income">
            <div className="panel-toolbar">
              <h2>إقرار الدخل (سنوي)</h2>
              <div className="search-wrap">
                <input
                  type="text"
                  className="company-search"
                  data-panel="income"
                  placeholder="بحث باسم الشركة..."
                />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
            <div className="decl-add-row" style={{ display: "none" }}>
              <input type="text" id="addDeclInput-income" placeholder="اسم الشركة الجديدة" />
              <button id="addDeclBtn-income" data-decl-type="income">
                <i className="fa-solid fa-plus"></i> إضافة شركة
              </button>
            </div>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>م</th>
                    <th>اسم الشركة</th>
                    <th>اسم الشخص المسئول</th>
                    <th>السنة</th>
                    <th>حذف</th>
                  </tr>
                </thead>
                <tbody id="tbody-income"></tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminBody>

      <div className="save-toast" id="saveToast">
        <i className="fa-solid fa-circle-check"></i> <span suppressHydrationWarning>تم الحفظ بنجاح</span>
      </div>

      <script src="/admin.js"></script>
      <script src="/admin-dashboard-init.js"></script>
    </>
  );
}
