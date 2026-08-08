// =====================================================================
// تبديل اللغة عربي / إنجليزي
// أي عنصر عايز يترجم لازم يكون عليه data-en="English text"
// السكريبت ده بياخد النص العربي الأصلي ويخزنه تلقائياً عشان يرجعله تاني
// =====================================================================
(function () {
    const STORAGE_KEY = "eleryan_site_lang";

    function applyLanguage(lang) {
        const elements = document.querySelectorAll("[data-en]");

        elements.forEach(function (el) {
            if (!el.dataset.ar) {
                el.dataset.ar = el.textContent;
            }
            el.textContent = lang === "en" ? el.dataset.en : el.dataset.ar;
        });

        // عناصر الـ placeholder
        document.querySelectorAll("[data-en-placeholder]").forEach(function (el) {
            if (!el.dataset.arPlaceholder) {
                el.dataset.arPlaceholder = el.getAttribute("placeholder") || "";
            }
            el.setAttribute(
                "placeholder",
                lang === "en" ? el.dataset.enPlaceholder : el.dataset.arPlaceholder
            );
        });

        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
        document.body.classList.toggle("lang-en", lang === "en");

        const btnLabel = document.querySelectorAll(".lang-toggle-btn .lang-label");
        btnLabel.forEach(function (s) {
            s.textContent = lang === "en" ? "AR" : "EN";
        });
        const btnTitleVal = lang === "en" ? "التبديل للعربية" : "Switch to English";
        document.querySelectorAll(".lang-toggle-btn").forEach(function (b) {
            b.title = btnTitleVal;
        });

        localStorage.setItem(STORAGE_KEY, lang);
    }

    document.addEventListener("DOMContentLoaded", function () {
        const saved = localStorage.getItem(STORAGE_KEY) || "ar";
        applyLanguage(saved);

        document.querySelectorAll(".lang-toggle-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                const current = localStorage.getItem(STORAGE_KEY) || "ar";
                applyLanguage(current === "ar" ? "en" : "ar");
            });
        });
    });
})();
