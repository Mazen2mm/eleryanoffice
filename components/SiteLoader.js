"use client";
import { useEffect, useState } from "react";

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const MIN_DISPLAY_MS = 900; // أقل مدة عرض عشان الشاشة متومضش لو النت سريع
    const start = Date.now();

    function finish() {
      const elapsed = Date.now() - start;
      const wait = Math.max(MIN_DISPLAY_MS - elapsed, 0);
      setTimeout(() => {
        setFading(true);
        setTimeout(() => setVisible(false), 500); // مدة التلاشي
      }, wait);
    }

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
      return () => window.removeEventListener("load", finish);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className={`site-loader${fading ? " site-loader-fade" : ""}`} aria-hidden="true">
      <div className="site-loader-rings">
        <div className="site-loader-ring ring-outer"></div>
        <div className="site-loader-ring ring-mid"></div>
        <div className="site-loader-ring ring-inner"></div>
        <img src="/4.png" alt="" className="site-loader-logo" />
      </div>
    </div>
  );
}
