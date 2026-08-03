// =====================================================================
// صفحة الأتمتة والإكستنشنز (e-invoice)
// ملحوظة: تخزين الشركات هنا مؤقتًا في localStorage لحد ما نبني الباك إند
// (الفرونت إند بس دلوقتي زي ما اتفقنا). لما نجهز الباك إند هنستبدل
// دوال loadCompanies/saveCompanies بنداءات Firestore/API حقيقية.
// =====================================================================

(function () {
    if (document.location.pathname.split("/").pop() !== "e-invoice") return;

    const STORAGE_KEY = "einv_companies_temp";

    function loadCompanies() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
        catch (e) { return []; }
    }
    function saveCompanies(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function renderCompanies() {
        const grid = document.getElementById("einvCompaniesGrid");
        const datalist = document.getElementById("einvCompaniesList");
        const companies = loadCompanies();

        if (!companies.length) {
            grid.innerHTML = '<p style="color:#888;font-size:0.9rem;text-align:center;">لسه مفيش شركات مسجّلة</p>';
        } else {
            grid.innerHTML = companies.map(function (c, i) {
                return `<div class="einv-company-chip">
                    <span><strong>${escEinv(c.name)}</strong> <em>#${escEinv(c.code)}</em></span>
                    <button type="button" class="einv-company-remove" data-i="${i}" title="حذف"><i class="fa-solid fa-xmark"></i></button>
                </div>`;
            }).join("");

            grid.querySelectorAll(".einv-company-remove").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    const list = loadCompanies();
                    list.splice(Number(btn.dataset.i), 1);
                    saveCompanies(list);
                    renderCompanies();
                });
            });
        }

        if (datalist) {
            datalist.innerHTML = companies.map(function (c) {
                return `<option value="${escEinv(c.name)}"></option>`;
            }).join("");
        }
    }

    function escEinv(s) {
        return String(s || "").replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderCompanies();

        // --- تسجيل شركة جديدة ---
        const registerBtn = document.getElementById("einvRegisterBtn");
        if (registerBtn) {
            registerBtn.addEventListener("click", function () {
                const nameEl = document.getElementById("einvRegName");
                const codeEl = document.getElementById("einvRegCode");
                const name = nameEl.value.trim();
                const code = codeEl.value.trim();
                if (!name || !code) { showToast("اكتب اسم الشركة والكود"); return; }

                const list = loadCompanies();
                list.push({ name, code, createdAt: Date.now() });
                saveCompanies(list);
                nameEl.value = "";
                codeEl.value = "";
                renderCompanies();
                showToast("تم تسجيل الشركة");
            });
        }

        // --- تبديل أصناف بكود / بدون كود ---
        const toggle = document.getElementById("einvModeToggle");
        const uncodedFields = document.getElementById("einvUncodedFields");
        if (toggle) {
            toggle.querySelectorAll(".einv-mode-btn").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    toggle.querySelectorAll(".einv-mode-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    uncodedFields.style.display = btn.dataset.mode === "uncoded" ? "block" : "none";
                });
            });
        }

        // --- اسم الملف المختار ---
        const fileInput = document.getElementById("einvExcelFile");
        const fileNameEl = document.getElementById("einvFileName");
        if (fileInput) {
            fileInput.addEventListener("change", function () {
                fileNameEl.textContent = fileInput.files.length ? fileInput.files[0].name : "اضغط لاختيار ملف Excel";
            });
        }

        // --- زرار تنسيق وإرسال (لسه من غير باك إند) ---
        const formatBtn = document.getElementById("einvFormatBtn");
        const formatMsg = document.getElementById("einvFormatMsg");
        if (formatBtn) {
            formatBtn.addEventListener("click", function () {
                if (!fileInput.files.length) {
                    formatMsg.textContent = "اختار ملف الأول";
                    formatMsg.style.color = "#e74c3c";
                    return;
                }
                // TODO: هنا هيتحط نداء الـ API الحقيقي لما نبني الباك إند
                // (رفع الملف + تنسيقه + إرجاعه تاني للتحميل)
                formatMsg.textContent = "التنسيق التلقائي هيشتغل لما نجهز الباك إند - الخطوة دي هتتفعل في المرحلة الجاية";
                formatMsg.style.color = "var(--gold)";
            });
        }

        // --- الإكستنشنز: للحساب الرئيسي بس ---
        (async function () {
            const session = window.ELERYAN_SESSION_READY ? await window.ELERYAN_SESSION_READY : null;
            const extSection = document.getElementById("einvExtensionsSection");
            const noAccessMsg = document.getElementById("einvNoAccessMsg");
            if (session && session.role === "admin") {
                extSection.style.display = "block";
            } else {
                noAccessMsg.style.display = "block";
            }
        })();

        // --- أزرار تشغيل الإكستنشنز ---
        document.querySelectorAll(".einv-start-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                const protocol = btn.dataset.protocol; // مثال: extension1://run
                const original = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري البدء...';
                window.location.href = protocol;
                setTimeout(() => { btn.innerHTML = original; }, 3000);
            });
        });
    });
})();
