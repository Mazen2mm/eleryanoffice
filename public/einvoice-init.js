const ETA_EXTENSION_ID = "jhcfippogffpombhhbljamceocoiogdd";

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

    function escEinv(s) {
        return String(s || "").replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    function renderCompanies() {
        const grid = document.getElementById("einvCompaniesGrid");
        const select = document.getElementById("einvCompanySelect");
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

        if (select) {
            const currentVal = select.value;
            select.innerHTML = '<option value="" disabled>-- اختار شركة --</option>' +
                companies.map(function (c) {
                    return `<option value="${escEinv(c.code)}" data-name="${escEinv(c.name)}">${escEinv(c.name)}</option>`;
                }).join("");
            if (companies.some(c => c.code === currentVal)) select.value = currentVal;
        }
    }

    async function loadEmployeesAccess() {
        const list = document.getElementById("einvEmployeesList");
        if (!list) return;
        try {
            const res = await fetch("/api/admin-users");
            const data = await res.json();
            if (!data.ok) {
                list.innerHTML = '<p style="color:#e74c3c;font-size:0.85rem;text-align:center;">تعذر تحميل الموظفين</p>';
                return;
            }
            renderEmployeesAccess(data.users || []);
        } catch (err) {
            list.innerHTML = '<p style="color:#e74c3c;font-size:0.85rem;text-align:center;">تعذر تحميل الموظفين</p>';
        }
    }

    function renderEmployeesAccess(users) {
        const list = document.getElementById("einvEmployeesList");
        if (!list) return;

        if (!users.length) {
            list.innerHTML = '<p style="color:#888;font-size:0.9rem;text-align:center;">مفيش موظفين مسجّلين</p>';
            return;
        }

        list.innerHTML = users.map(function (u) {
            const perms = u.permissions || [];
            const active = perms.includes("einvoice");
            return `<div class="info-item" style="justify-content:space-between;">
                <span>${escEinv(u.username)}</span>
                <button type="button"
                    class="status-chip ${active ? "up-to-date" : "overdue"} einv-toggle-btn"
                    data-id="${escEinv(u.id)}"
                    data-active="${active ? "1" : "0"}"
                    data-perms="${encodeURIComponent(JSON.stringify(perms))}">
                    <i class="fa-solid ${active ? "fa-toggle-on" : "fa-toggle-off"}"></i> ${active ? "مفعّل" : "متوقف"}
                </button>
            </div>`;
        }).join("");

        list.querySelectorAll(".einv-toggle-btn").forEach(function (btn) {
            btn.addEventListener("click", async function () {
                const id = btn.dataset.id;
                const isActive = btn.dataset.active === "1";
                const currentPerms = JSON.parse(decodeURIComponent(btn.dataset.perms));
                const nextPerms = isActive
                    ? currentPerms.filter(p => p !== "einvoice")
                    : currentPerms.concat(["einvoice"]);

                btn.disabled = true;

                try {
                    const res = await fetch("/api/admin-users/" + id, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ permissions: nextPerms }),
                    });
                    const data = await res.json();
                    if (!data.ok) {
                        showToast(data.message || "تعذر التحديث");
                        btn.disabled = false;
                        return;
                    }
                    showToast(isActive ? "تم إيقاف الموظف" : "تم تفعيل الموظف");
                    loadEmployeesAccess();
                } catch (err) {
                    showToast("تعذر الاتصال بالسيرفر");
                    btn.disabled = false;
                }
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderCompanies();

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

        const companySelect = document.getElementById("einvCompanySelect");
        const companyCodeField = document.getElementById("einvCompanyCode");
        if (companySelect) {
            companySelect.addEventListener("change", function () {
                companyCodeField.value = companySelect.value || "";
            });
        }

        const toggle = document.getElementById("einvModeToggle");
        const uncodedFields = document.getElementById("einvUncodedFields");
        let currentMode = "coded";
        if (toggle) {
            toggle.querySelectorAll(".einv-mode-btn").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    toggle.querySelectorAll(".einv-mode-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    currentMode = btn.dataset.mode;
                    uncodedFields.style.display = currentMode === "uncoded" ? "block" : "none";
                });
            });
        }

        const fileInput = document.getElementById("einvExcelFile");
        const fileNameEl = document.getElementById("einvFileName");
        if (fileInput) {
            fileInput.addEventListener("change", function () {
                fileNameEl.textContent = fileInput.files.length ? fileInput.files[0].name : "اضغط لاختيار ملف Excel";
            });
        }

        const formatBtn = document.getElementById("einvFormatBtn");
        const formatMsg = document.getElementById("einvFormatMsg");
        if (formatBtn) {
            formatBtn.addEventListener("click", async function () {
                formatMsg.textContent = "";

                if (!fileInput.files.length) {
                    formatMsg.textContent = "اختار ملف الأول";
                    formatMsg.style.color = "#e74c3c";
                    return;
                }
                if (currentMode === "uncoded" && !companyCodeField.value) {
                    formatMsg.textContent = "اختار الشركة الأول";
                    formatMsg.style.color = "#e74c3c";
                    return;
                }

                const originalBtnHTML = formatBtn.innerHTML;
                formatBtn.disabled = true;
                formatBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري المعالجة...';

                try {
                    const fd = new FormData();
                    fd.append("file", fileInput.files[0]);
                    fd.append("mode", currentMode);
                    if (currentMode === "uncoded") {
                        fd.append("companyCode", companyCodeField.value);
                        const selectedOption = companySelect.options[companySelect.selectedIndex];
                        fd.append("companyName", selectedOption ? selectedOption.dataset.name || "" : "");
                    }

                    const res = await fetch("/api/format-excel", { method: "POST", body: fd });
                    const data = await res.json();

                    if (!data.ok) {
                        formatMsg.textContent = data.message || "حصل خطأ أثناء المعالجة";
                        formatMsg.style.color = "#e74c3c";
                        return;
                    }

                    const byteChars = atob(data.fileBase64);
                    const byteNumbers = new Array(byteChars.length);
                    for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
                    const blob = new Blob([new Uint8Array(byteNumbers)], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = data.filename || "formatted-invoice.xlsx";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);

                    if (data.skippedRows && data.skippedRows.length) {
                        formatMsg.textContent = `تم التحميل (${data.rowsCount} صنف). ملحوظة: الصفوف رقم ${data.skippedRows.join("، ")} كانت ناقصة بيانات فاتجاهلناها.`;
                        formatMsg.style.color = "#e0a020";
                    } else {
                        formatMsg.textContent = `تم التحميل بنجاح (${data.rowsCount} صنف).`;
                        formatMsg.style.color = "#2ecc71";
                    }
                } catch (err) {
                    console.error(err);
                    formatMsg.textContent = "تعذر الاتصال بالسيرفر";
                    formatMsg.style.color = "#e74c3c";
                } finally {
                    formatBtn.disabled = false;
                    formatBtn.innerHTML = originalBtnHTML;
                }
            });
        }

        (async function () {
            const session = window.ELERYAN_SESSION_READY ? await window.ELERYAN_SESSION_READY : null;
            const extSection = document.getElementById("einvExtensionsSection");
            const noAccessMsg = document.getElementById("einvNoAccessMsg");
            if (session && session.role === "admin") {
                extSection.style.display = "block";
                loadEmployeesAccess();
            } else {
                noAccessMsg.style.display = "block";
            }
        })();

        document.querySelectorAll(".einv-start-btn").forEach(function (btn) {
            btn.addEventListener("click", async function () {
                const original = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التفعيل...';

                function resetBtn(msg, ok) {
                    btn.disabled = false;
                    btn.innerHTML = original;
                    if (msg) showToast(msg);
                }

                if (!ETA_EXTENSION_ID || ETA_EXTENSION_ID === "PASTE_YOUR_EXTENSION_ID_HERE") {
                    resetBtn("لسه محتاجين نحط ID الإكستنشن في einvoice-init.js");
                    return;
                }
                if (!window.chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
                    resetBtn("الإضافة مش متثبتة أو المتصفح مش بيدعم الاتصال بالإضافات");
                    return;
                }

                try {
                    const res = await fetch("/api/extension/start", { method: "POST" });
                    const data = await res.json();
                    if (!data.ok) {
                        resetBtn(data.message || "معندكش صلاحية تشغيل الإكستنشن");
                        return;
                    }

                    chrome.runtime.sendMessage(
                        ETA_EXTENSION_ID,
                        { action: "ETA_ACTIVATE", token: data.token },
                        function (response) {
                            if (chrome.runtime.lastError) {
                                resetBtn("الإضافة مش متثبتة على المتصفح ده");
                                return;
                            }
                            if (!response || !response.allowed) {
                                resetBtn((response && response.message) || "تعذر تفعيل الإضافة");
                                return;
                            }
                            resetBtn("تم تفعيل الإضافة - افتح صفحة ETA");
                        }
                    );
                } catch (err) {
                    console.error(err);
                    resetBtn("تعذر الاتصال بالسيرفر");
                }
            });
        });
    });
})();
