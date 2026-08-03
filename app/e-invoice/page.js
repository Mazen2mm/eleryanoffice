import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";

export const metadata = {
  title: "الأتمتة والإكستنشنز | Eleryan Office",
};

export default function EInvoicePage() {
  return (
    <>
      <AdminBody style={{ alignItems: "flex-start", padding: "25px 15px" }}>
        <div className="dashboard">
          <AdminHeader title="الأتمتة والإكستنشنز" logoHeight="45px" showLogout={false} />

          <div className="automation-page" style={{ minHeight: "auto", padding: "30px 0", display: "block" }}>

            {/* ============ 1) رفع ملف Excel وتنسيقه ============ */}
            <div className="glass-form reveal active automation-card" style={{ maxWidth: "560px", marginBottom: "25px" }}>
              <div className="icon-wrapper" style={{ marginBottom: "15px", width: "60px", height: "60px", fontSize: "1.5rem", background: "rgba(212, 175, 55, 0.15)" }}>
                <i className="fa-solid fa-file-excel"></i>
              </div>
              <h2 style={{ color: "var(--gold)", fontSize: "1.5rem", marginBottom: "8px" }}>
                تنسيق ملف Excel
              </h2>
              <p style={{ color: "var(--text-light)", marginBottom: "20px", fontSize: "0.95rem", opacity: 0.8 }}>
                ارفع الملف، اختار نوع الأصناف، وهيتبعتلك منسّق تاني
              </p>

              {/* اختيار نوع الأصناف */}
              <div className="einv-mode-toggle" id="einvModeToggle">
                <button type="button" className="einv-mode-btn active" data-mode="coded">
                  <i className="fa-solid fa-barcode"></i> أصناف بكود
                </button>
                <button type="button" className="einv-mode-btn" data-mode="uncoded">
                  <i className="fa-solid fa-list"></i> أصناف بدون كود
                </button>
              </div>

              {/* يظهر بس لو اختار "أصناف بدون كود" */}
              <div className="einv-uncoded-fields" id="einvUncodedFields" style={{ display: "none" }}>
                <div className="admin-input-group" style={{ marginBottom: "12px" }}>
                  <label htmlFor="einvCompanyName">اسم الشركة</label>
                  <div className="input-wrap">
                    <input type="text" id="einvCompanyName" placeholder="اختار شركة مسجّلة أو اكتب اسم جديد" list="einvCompaniesList" />
                    <i className="fa-solid fa-building"></i>
                  </div>
                  <datalist id="einvCompaniesList"></datalist>
                </div>
                <div className="admin-input-group" style={{ marginBottom: "5px" }}>
                  <label htmlFor="einvCompanyCode">الكود</label>
                  <div className="input-wrap">
                    <input type="text" id="einvCompanyCode" placeholder="كود الشركة" />
                    <i className="fa-solid fa-hashtag"></i>
                  </div>
                </div>
              </div>

              <div className="einv-upload-box" id="einvUploadBox" style={{ marginTop: "20px" }}>
                <input type="file" id="einvExcelFile" accept=".xlsx,.xls,.csv" hidden />
                <label htmlFor="einvExcelFile" className="einv-upload-label">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span id="einvFileName" suppressHydrationWarning>اضغط لاختيار ملف Excel</span>
                </label>
              </div>

              <button id="einvFormatBtn" className="submit-btn" style={{ marginTop: "18px", boxShadow: "0 10px 20px rgba(212, 175, 55, 0.2)" }}>
                <i className="fa-solid fa-wand-magic-sparkles"></i> تنسيق وإرسال
              </button>
              <p id="einvFormatMsg" className="einv-inline-msg"></p>
            </div>

            {/* ============ 2) الشركات المسجّلة + تسجيل شركة جديدة ============ */}
            <div className="glass-form reveal active automation-card" style={{ maxWidth: "560px", marginBottom: "25px", textAlign: "right" }}>
              <h2 style={{ color: "var(--gold)", fontSize: "1.3rem", marginBottom: "15px", textAlign: "center" }}>
                <i className="fa-solid fa-building-columns"></i> الشركات المسجّلة
              </h2>

              <div className="einv-companies-grid" id="einvCompaniesGrid" suppressHydrationWarning>
                <p style={{ color: "#888", fontSize: "0.9rem", textAlign: "center" }}>لسه مفيش شركات مسجّلة</p>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "20px", paddingTop: "18px" }}>
                <div className="einv-register-row">
                  <input type="text" id="einvRegName" placeholder="اسم الشركة" />
                  <input type="text" id="einvRegCode" placeholder="الكود" />
                  <button id="einvRegisterBtn" type="button" className="submit-btn" style={{ margin: 0, width: "auto", padding: "12px 20px" }}>
                    <i className="fa-solid fa-plus"></i> تسجيل
                  </button>
                </div>
              </div>
            </div>

            {/* ============ 3) الإكستنشنز - أدمن بس ============ */}
            <div id="einvExtensionsSection" style={{ display: "none" }}>
              <h2 style={{ color: "var(--gold)", fontSize: "1.3rem", marginBottom: "15px", textAlign: "center" }}>
                <i className="fa-solid fa-puzzle-piece"></i> الإكستنشنز
              </h2>
              <div className="einv-extensions-grid einv-single">

                <div className="glass-form reveal active automation-card einv-ext-card">
                  <div className="icon-wrapper" style={{ margin: "0 auto 12px", width: "55px", height: "55px", fontSize: "1.4rem", background: "rgba(212, 175, 55, 0.15)" }}>
                    <i className="fa-solid fa-plug"></i>
                  </div>
                  <h3 style={{ color: "var(--white)", fontSize: "1.1rem", marginBottom: "6px" }}>الإكستنشن</h3>
                  <p style={{ color: "#999", fontSize: "0.82rem", marginBottom: "15px" }}>
                    اسم مؤقت - يتغيّر لاسم الإكستنشن الحقيقي
                  </p>
                  <button className="submit-btn einv-start-btn" data-ext="1" data-protocol="extension1://run" style={{ margin: "0 0 10px" }}>
                    <i className="fa-solid fa-play"></i> Start
                  </button>
                  <a href="/extension1-setup.exe" download className="logout-btn einv-download-link">
                    <i className="fa-solid fa-download"></i> تحميل الإضافة
                  </a>
                </div>

              </div>
              <p style={{ color: "#e74c3c", fontSize: "0.82rem", fontWeight: 700, textAlign: "center", marginTop: "15px" }}>
                <i className="fa-solid fa-triangle-exclamation"></i> برجاء تحميل وتثبيت الإضافة على الجهاز قبل التشغيل.
              </p>
            </div>

            <p id="einvNoAccessMsg" style={{ display: "none", color: "#999", textAlign: "center", fontSize: "0.85rem" }}>
              <i className="fa-solid fa-lock"></i> التحكم في الإكستنشنز متاح للحساب الرئيسي فقط.
            </p>

          </div>
        </div>
      </AdminBody>

      <div className="save-toast" id="saveToast">
        <i className="fa-solid fa-circle-check"></i> <span suppressHydrationWarning>تم الحفظ بنجاح</span>
      </div>

      <script src="/admin.js"></script>
      <script src="/einvoice-init.js"></script>
    </>
  );
}
