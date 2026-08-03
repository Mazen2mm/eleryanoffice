export default function MobileSidebar() {
  return (
    <>
      <div className="sidebar-overlay" id="sidebarOverlay"></div>
      <div className="sidebar" id="sidebar">
        <button className="sidebar-close" id="sidebarClose">
          <i className="fa-solid fa-xmark"></i>
        </button>
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
      </div>
    </>
  );
}
