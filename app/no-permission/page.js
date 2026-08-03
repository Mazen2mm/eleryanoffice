import AdminBody from "@/components/AdminBody";

export const metadata = {
  title: "مكتب هاني العريان | لا تملك صلاحية",
};

export default function NoPermissionPage() {
  return (
    <AdminBody>
      <div className="login-wrapper" style={{ maxWidth: "480px", textAlign: "center" }}>
        <i
          className="fa-solid fa-lock"
          style={{ fontSize: "3rem", color: "#e74c3c", marginBottom: "20px" }}
        ></i>
        <h1 style={{ marginBottom: "15px" }}>لا تملك صلاحية الوصول لهذه الصفحة</h1>
        <p className="subtitle">
          تواصل مع الحساب الرئيسي إذا كنت تعتقد أن هذا خطأ
        </p>
        <a href="/admin-home" className="back-home-link">
          <i className="fa-solid fa-arrow-right"></i> العودة للوحة التحكم
        </a>
      </div>
    </AdminBody>
  );
}
