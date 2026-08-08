import Script from "next/script";
import AdminBody from "@/components/AdminBody";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "تسجيل الحضور والانصراف",
};

export default function AttendancePage() {
  return (
    <>
      <FirebaseScripts />

      <AdminBody style={{ padding: "40px 15px" }}>
        <div className="login-wrapper" style={{ maxWidth: "500px" }}>
          <h2 style={{ color: "var(--gold)", marginBottom: "20px" }}>
            نظام الحضور والانصراف الذكي
          </h2>
          <p
            id="userInfo"
            suppressHydrationWarning
            style={{ color: "#fff", marginBottom: "30px", fontWeight: "bold", fontSize: "1.2rem" }}
          ></p>

          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <button
              id="btnCheckIn"
              className="admin-login-btn"
              style={{ background: "#2ecc71", color: "#fff" }}
            >
              <i className="fa-solid fa-user-check"></i> تسجيل حضور
            </button>
            <button
              id="btnCheckOut"
              className="admin-login-btn"
              style={{ background: "#e74c3c", color: "#fff" }}
            >
              <i className="fa-solid fa-user-minus"></i> تسجيل انصراف
            </button>
          </div>
          <p
            id="attendanceMsg"
            suppressHydrationWarning
            style={{ marginTop: "20px", fontWeight: "bold", color: "#fff", fontSize: "1.1rem" }}
          ></p>
          <br />
          <a href="/admin-home" className="back-home-link">
            <i className="fa-solid fa-arrow-right"></i> العودة للرئيسية
          </a>
        </div>
      </AdminBody>

      <Script src="/admin.js" strategy="afterInteractive" />
      <Script src="/attendance-init.js" strategy="afterInteractive" />
    </>
  );
}
