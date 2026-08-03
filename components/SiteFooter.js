export default function SiteFooter({ minimal = false }) {
  return (
    <footer>
      {!minimal && (
        <div className="footer-content reveal">
          <div className="footer-logo">
            <img src="/3.png" alt="لوجو" style={{ height: "300px" }} />
          </div>
          <p data-en="Get in touch now">تواصل معنا الان</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/hanyeleryanoffice/">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="https://wa.me/201016779182" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a href="https://www.facebook.com/hanyeleryanoffice">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="tel:01050773678">
              <i className="fa-solid fa-phone"></i>
            </a>
          </div>
        </div>
      )}
      <div className="footer-bottom">
        <p>
          <span data-en="All rights reserved &copy; 2026 Hany El-Eryan Office">
            جميع الحقوق محفوظة &copy; 2026 مكتب هاني العريان
          </span>
        </p>
      </div>
    </footer>
  );
}
