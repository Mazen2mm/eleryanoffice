import FirebaseScripts from "@/components/FirebaseScripts";
import AdminBody from "@/components/AdminBody";

export const metadata = {
  title: "مكتب هاني العريان | تسجيل الدخول",
};

export default function AdminLoginPage() {
  return (
    <>
      <FirebaseScripts />

      <AdminBody>
        <div className="login-wrapper">
          <img src="/4.png" alt="لوجو" className="admin-logo" />
          <h1>برجاء تسجيل الدخول</h1>
          <p className="subtitle">مكتب هاني العريان للاستشارات المالية والضريبية</p>

          <form id="loginForm">
            <div className="admin-input-group">
              <label htmlFor="username">اسم المستخدم</label>
              <div className="input-wrap">
                <input type="text" id="username" autoComplete="username" required />
                <i className="fa-solid fa-user"></i>
              </div>
            </div>
            <div className="admin-input-group">
              <label htmlFor="password">كلمة المرور</label>
              <div className="input-wrap">
                <input
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  required
                />
                <i className="fa-solid fa-lock"></i>
              </div>
            </div>
            <button type="submit" className="admin-login-btn">
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>دخول</span>
            </button>
            <p className="login-error" id="loginError"></p>
          </form>

          <a href="/" className="back-home-link">
            <i className="fa-solid fa-arrow-right"></i> العودة للموقع الرئيسي
          </a>
        </div>
      </AdminBody>

      <style>{`
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
}
`}</style>

      <script src="/admin.js"></script>
      <script src="/admin-login-init.js"></script>
    </>
  );
}
