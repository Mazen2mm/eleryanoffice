export default function AdminHeader({
  title,
  extraClass = "",
  showLogout = true,
  logoHeight,
  homeLabel = "الرئيسية",
}) {
  return (
    <div className={`dashboard-header${extraClass ? " " + extraClass : ""}`}>
      <div className="header-title">
        <img
          src="/4.png"
          alt="لوجو"
          style={logoHeight ? { height: logoHeight } : undefined}
        />
        <span>{title}</span>
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <a href="/admin-home" className="logout-btn" style={{ textDecoration: "none" }}>
          <i className="fa-solid fa-house"></i> {homeLabel}
        </a>
        {showLogout && (
          <button className="logout-btn" id="logoutBtn">
            <i className="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
          </button>
        )}
      </div>
    </div>
  );
}
