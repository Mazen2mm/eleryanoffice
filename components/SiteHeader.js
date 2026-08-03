export default function SiteHeader() {
  return (
    <header id="navbar">
      <div className="logo">
        <a href="/" className="logo-link">
          <img src="/4.png" alt="لوجو" className="logo-img" />
          <span className="logo-text" data-en="Hany El-Eryan Office">
            مكتب هاني العريان
          </span>
        </a>
      </div>
      <nav>
        <ul>
          <li>
            <a href="/" data-en="Home">
              الرئيسية
            </a>
          </li>
          <li>
            <a href="/about" data-en="About Us">
              من نحن
            </a>
          </li>
          <li>
            <a href="/services" data-en="Services">
              خدماتنا
            </a>
          </li>
          <li>
            <a href="/clients" data-en="Clients">
              عملائنا
            </a>
          </li>
          <li>
            <a href="/blog" data-en="Blog">
              المدونة
            </a>
          </li>
          <li>
            <a href="/contact" data-en="Contact Us">
              تواصل معنا
            </a>
          </li>
        </ul>
      </nav>
      <div className="header-actions">
        <button
          className="lang-toggle-btn"
          id="langToggleBtn"
          title="Switch to English"
        >
          <i className="fa-solid fa-globe"></i>{" "}
          <span className="lang-label">EN</span>
        </button>
        <a href="/admin-login" className="admin-icon-link" title="لوحة التحكم">
          <i className="fa-solid fa-user-shield"></i>
        </a>
      </div>
      <button className="hamburger" id="hamburger" aria-label="فتح القائمة">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
