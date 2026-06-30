// =====================================================================
// إعدادات تسجيل الدخول الافتراضية للأدمن (دايماً شغالة كحساب احتياطي)
// =====================================================================
const ADMIN_CREDENTIALS = {
    username: "eleryanofficeteam",
    password: "123456789"
};

// =====================================================================
// إعدادات Firebase
// =====================================================================
const firebaseConfig = {
    apiKey: "AIzaSyBVm0NZbsWb2Ive85OYA0E1inXMGXaOXTE",
    authDomain: "eleryanoffice0.firebaseapp.com",
    projectId: "eleryanoffice0",
    storageBucket: "eleryanoffice0.firebasestorage.app",
    messagingSenderId: "625913873615",
    appId: "1:625913873615:web:c8861075546718968423ba"
};

let db = null;
function initFirebase() {
    if (typeof firebase === "undefined") return false;
    if (firebaseConfig.apiKey === "PASTE_YOUR_API_KEY_HERE") return false;
    try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        return true;
    } catch (err) {
        console.error("Firebase init error:", err);
        return false;
    }
}

// =====================================================================
// قائمة الشركات الافتراضية (تُستخدم أول مرة فقط لو لسه مفيش شركات متخزنة)
// =====================================================================
const SEED_COMPANIES = [
    { id: "c1",  nameAr: "لاكوزين",                               nameEn: "La Cuisine",      person: "خالد عبد اللطيف عبد الوهاب" },
    { id: "c2",  nameAr: "شريف عبد الوهاب",                        nameEn: "",                person: "شريف عبد اللطيف عبد الوهاب" },
    { id: "c3",  nameAr: "البدراويه",                              nameEn: "El Badrawia",     person: "محمد كمال عبد العزيز" },
    { id: "c4",  nameAr: "المتحده شركه",                           nameEn: "El-Mottaheda",    person: "محمود ابو الحجاج" },
    { id: "c5",  nameAr: "لاكوستر",                                nameEn: "Lacoster",        person: "عمرو" },
    { id: "c6",  nameAr: "جرين لاين بيكيا",                        nameEn: "Green Palace",    person: "احمد ماجد" },
    { id: "c7",  nameAr: "تيرا بيلد",                              nameEn: "TeraBuild",       person: "صالح عيد هواري" },
    { id: "c8",  nameAr: "نسر العرب",                              nameEn: "Nesr El-Arab",    person: "محمد محمد ممثل" },
    { id: "c9",  nameAr: "ديماتك",                                 nameEn: "Dematech",        person: "احمد سعيد سلام" },
    { id: "c10", nameAr: "بونيتيرا لاعمال الكهروميكانيكية",        nameEn: "Boniterra Group", person: "هشام احمد محمد عمر" },
    { id: "c11", nameAr: "بونيتيرا للديكور",                       nameEn: "",                person: "هشام احمد محمد عمر" },
    { id: "c12", nameAr: "بونيتيرا للانشاءات",                     nameEn: "",                person: "هشام احمد محمد عمر" },
    { id: "c13", nameAr: "بونيتيرا لتشغيل وادارة المنشئات",        nameEn: "",                person: "هشام احمد محمد عمر" }
];

const MONTHS = [
    { v: 1, t: "1 - يناير" }, { v: 2, t: "2 - فبراير" }, { v: 3, t: "3 - مارس" },
    { v: 4, t: "4 - أبريل" }, { v: 5, t: "5 - مايو" }, { v: 6, t: "6 - يونيو" },
    { v: 7, t: "7 - يوليو" }, { v: 8, t: "8 - أغسطس" }, { v: 9, t: "9 - سبتمبر" },
    { v: 10, t: "10 - أكتوبر" }, { v: 11, t: "11 - نوفمبر" }, { v: 12, t: "12 - ديسمبر" }
];

function yearsRange() {
    const current = new Date().getFullYear();
    const arr = [];
    for (let y = current - 3; y <= current + 3; y++) arr.push(y);
    return arr;
}
const YEARS = yearsRange();

// أنواع الإقرارات: شهري (vat, withholding, payroll) وسنوي (income)
const DECLARATION_TYPES = ["vat", "withholding", "payroll", "income"];

// =====================================================================
// حماية صفحات الأدمن - لازم يكون مسجل دخول (فيما عدا صفحة تسجيل الدخول)
// =====================================================================
const PROTECTED_PAGES = ["admin-home.html", "admin-dashboard.html", "admin-clients.html", "admin-users.html"];
const currentPage = window.location.pathname.split("/").pop();

if (PROTECTED_PAGES.includes(currentPage)) {
    if (sessionStorage.getItem("eleryan_admin_logged_in") !== "true") {
        window.location.href = "admin-login.html";
    }
}

function isDashboardPage() {
    return document.body && document.querySelector(".dashboard") !== null;
}

// =====================================================================
// إدارة الشركات (مصدر واحد يستخدمه: الإقرارات + صفحة عملائنا + تبويب بيانات الشركات)
// =====================================================================
function loadCompaniesOnce() {
    if (db) {
        return db.collection("companies").orderBy("createdAt", "asc").get()
            .then(function (snapshot) {
                if (snapshot.empty) {
                    return seedCompaniesToFirestore();
                }
                const list = [];
                snapshot.forEach(function (doc) {
                    list.push(Object.assign({ id: doc.id }, doc.data()));
                });
                return list;
            })
            .catch(function (err) {
                console.error("تعذر تحميل الشركات من Firestore:", err);
                return getLocalCompanies();
            });
    }
    return Promise.resolve(getLocalCompanies());
}

function seedCompaniesToFirestore() {
    const batchPromises = SEED_COMPANIES.map(function (c, idx) {
        const data = {
            nameAr: c.nameAr,
            nameEn: c.nameEn || "",
            person: c.person || "",
            email: c.email || "",
            system: c.system || "",
            showInClients: true,
            createdAt: Date.now() + idx
        };
        return db.collection("companies").doc(c.id).set(data).then(function () {
            return Object.assign({ id: c.id }, data);
        });
    });
    return Promise.all(batchPromises);
}

function getLocalCompanies() {
    let local = JSON.parse(localStorage.getItem("eleryan_companies_fallback") || "null");
    if (!local || !local.length) {
        local = SEED_COMPANIES.map(function (c) {
            return {
                id: c.id,
                nameAr: c.nameAr,
                nameEn: c.nameEn || "",
                person: c.person || "",
                email: c.email || "",
                system: c.system || "",
                showInClients: true,
                createdAt: Date.now()
            };
        });
        localStorage.setItem("eleryan_companies_fallback", JSON.stringify(local));
    }
    return local;
}

function saveLocalCompanies(list) {
    localStorage.setItem("eleryan_companies_fallback", JSON.stringify(list));
}

function addCompany(data) {
    data.createdAt = Date.now();
    data.showInClients = data.showInClients !== false;
    if (db) {
        return db.collection("companies").add(data);
    }
    const local = getLocalCompanies();
    local.push(Object.assign({ id: "local_" + Date.now() }, data));
    saveLocalCompanies(local);
    return Promise.resolve();
}

function deleteCompany(id) {
    if (db) {
        return db.collection("companies").doc(id).delete();
    }
    const local = getLocalCompanies().filter(function (c) { return c.id !== id; });
    saveLocalCompanies(local);
    return Promise.resolve();
}

function updateCompanyField(id, field, value) {
    if (db) {
        return db.collection("companies").doc(id).set({ [field]: value }, { merge: true });
    }
    const local = getLocalCompanies();
    const item = local.find(function (c) { return c.id === id; });
    if (item) item[field] = value;
    saveLocalCompanies(local);
    return Promise.resolve();
}

// =====================================================================
// منطق لوحة تحكم الإقرارات
// =====================================================================
let CURRENT_COMPANIES = [];

document.addEventListener("DOMContentLoaded", function () {
    if (!isDashboardPage()) return;
    if (!document.getElementById("tbody-vat")) return; // مش صفحة الإقرارات

    const firebaseReady = initFirebase();
    if (!firebaseReady) {
        console.warn("Firebase غير مفعّل بعد - سيتم الحفظ محلياً على هذا الجهاز فقط حتى يتم ربط Firebase.");
    }

    // ---------------- تسجيل الخروج ----------------
    document.getElementById("logoutBtn").addEventListener("click", function () {
        sessionStorage.removeItem("eleryan_admin_logged_in");
        window.location.href = "admin-login.html";
    });

    // ---------------- التبديل بين التابات ----------------
    document.querySelectorAll(".admin-tab-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
            history.replaceState(null, "", "#" + btn.dataset.tab);
        });
    });

    // ---------------- البحث ----------------
    document.querySelectorAll(".company-search").forEach(function (input) {
        input.addEventListener("input", function () {
            const panel = this.dataset.panel;
            const q = this.value.trim();
            document.querySelectorAll("#tbody-" + panel + " tr").forEach(function (row) {
                row.style.display = row.dataset.companyName.includes(q) ? "" : "none";
            });
        });
    });

    // ---------------- تحميل الشركات ثم بناء الجداول ----------------
    loadCompaniesOnce().then(function (companies) {
        CURRENT_COMPANIES = companies;
        DECLARATION_TYPES.forEach(buildTable);

        if (document.getElementById("companyInfoTableBody")) {
            renderCompanyInfoPanel(companies);
        }

        // فتح التاب المطلوب مباشرة لو جاي من رابط فيه #
        const hashTab = window.location.hash.replace("#", "");
        if (hashTab) {
            const targetBtn = document.querySelector('.admin-tab-btn[data-tab="' + hashTab + '"]');
            if (targetBtn) targetBtn.click();
        }

        loadAllData();
    });
});

function buildTable(type) {
    const tbody = document.getElementById("tbody-" + type);
    if (!tbody) return;
    let html = "";
    CURRENT_COMPANIES.forEach(function (company) {
        html += `<tr data-company-name="${company.nameAr}" data-company="${company.id}">`;
        html += `<td class="row-index">-</td>`;
        html += `<td class="company-name">${company.nameAr}</td>`;
        html += `<td>
            <input type="text" class="admin-select person-input"
                style="width:170px; text-align:center; border:1px solid #d8dedb; border-radius:8px; padding:8px 10px;"
                data-type="${type}" data-company="${company.id}" data-field="person"
                value="${company.person || ""}">
        </td>`;

        if (type !== "income") {
            html += `<td>
                <select class="admin-select" data-type="${type}" data-company="${company.id}" data-field="month">
                    <option value="">--</option>
                    ${MONTHS.map(m => `<option value="${m.v}">${m.t}</option>`).join("")}
                </select>
            </td>`;
        }

        html += `<td>
            <select class="admin-select" data-type="${type}" data-company="${company.id}" data-field="year">
                <option value="">--</option>
                ${YEARS.map(y => `<option value="${y}">${y}</option>`).join("")}
            </select>
        </td>`;

        html += `</tr>`;
    });
    tbody.innerHTML = html;

    // ربط حدث الحفظ التلقائي عند أي تغيير
    tbody.querySelectorAll("select, input.person-input").forEach(function (el) {
        const evt = el.tagName === "SELECT" ? "change" : "blur";
        el.addEventListener(evt, function () {
            saveField(el.dataset.type, el.dataset.company, el.dataset.field, el.value, el);
            if (el.dataset.field === "year" || el.dataset.field === "month") {
                sortDeclarationTable(type);
            }
        });
    });

    renumberTable(type);
}

// ترتيب الجدول: أقدم إقرار (أقدم سنة/شهر) فوق، وأحدث إقرار تحت
function sortDeclarationTable(type) {
    const tbody = document.getElementById("tbody-" + type);
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll("tr"));

    function keyOf(row) {
        const yearEl = row.querySelector('[data-field="year"]');
        const year = yearEl && yearEl.value ? parseInt(yearEl.value, 10) : NaN;
        if (type === "income") {
            return isNaN(year) ? Infinity : year;
        }
        const monthEl = row.querySelector('[data-field="month"]');
        const month = monthEl && monthEl.value ? parseInt(monthEl.value, 10) : NaN;
        if (isNaN(year) || isNaN(month)) return Infinity;
        return year * 100 + month;
    }

    rows.sort(function (a, b) {
        const ka = keyOf(a), kb = keyOf(b);
        if (ka !== kb) return ka - kb;
        return a.dataset.companyName.localeCompare(b.dataset.companyName, "ar");
    });

    rows.forEach(function (row) { tbody.appendChild(row); });
    renumberTable(type);
}

function renumberTable(type) {
    const tbody = document.getElementById("tbody-" + type);
    if (!tbody) return;
    tbody.querySelectorAll("tr").forEach(function (row, idx) {
        const cell = row.querySelector(".row-index");
        if (cell) cell.textContent = idx + 1;
    });
}

// =====================================================================
// الحفظ - Firestore إن كان متاح، وإلا localStorage كنسخة احتياطية محلية
// =====================================================================
function saveField(type, companyId, field, value, el) {
    const localKey = "eleryan_" + type + "_" + companyId;
    let localData = JSON.parse(localStorage.getItem(localKey) || "{}");
    localData[field] = value;
    localStorage.setItem(localKey, JSON.stringify(localData));

    if (db) {
        db.collection("declarations").doc(type).collection("companies").doc(companyId)
            .set({ [field]: value }, { merge: true })
            .then(function () { showToast(); flashEl(el); })
            .catch(function (err) {
                console.error("Firestore save error:", err);
                showToast("تم الحفظ محلياً فقط - تحقق من إعدادات Firebase");
                flashEl(el);
            });
    } else {
        showToast("تم الحفظ على هذا الجهاز فقط - يجب ربط Firebase لمزامنة كل الأجهزة");
        flashEl(el);
    }
}

function flashEl(el) {
    if (!el) return;
    el.classList.add("saved-flash");
    setTimeout(() => el.classList.remove("saved-flash"), 1000);
}

function showToast(message) {
    const toast = document.getElementById("saveToast");
    if (!toast) return;
    toast.querySelector("span").textContent = message || "تم الحفظ بنجاح";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// =====================================================================
// تحميل البيانات المحفوظة عند فتح الصفحة (من Firestore أو من النسخة المحلية)
// =====================================================================
function loadAllData() {
    DECLARATION_TYPES.forEach(function (type) {
        let remaining = CURRENT_COMPANIES.length;
        if (remaining === 0) return;

        CURRENT_COMPANIES.forEach(function (company) {
            // تحميل محلي فوري (يضمن ظهور آخر قيمة معروفة بسرعة)
            const localKey = "eleryan_" + type + "_" + company.id;
            const localData = JSON.parse(localStorage.getItem(localKey) || "{}");
            applyDataToRow(type, company.id, localData);

            // تحميل من Firestore (المصدر الأساسي لمزامنة كل الأجهزة)
            if (db) {
                db.collection("declarations").doc(type).collection("companies").doc(company.id)
                    .get()
                    .then(function (doc) {
                        if (doc.exists) {
                            applyDataToRow(type, company.id, doc.data());
                            localStorage.setItem(localKey, JSON.stringify(doc.data()));
                        }
                    })
                    .catch(function (err) {
                        console.error("Firestore load error:", err);
                    })
                    .finally(function () {
                        remaining--;
                        if (remaining === 0) sortDeclarationTable(type);
                    });
            } else {
                remaining--;
                if (remaining === 0) sortDeclarationTable(type);
            }
        });
    });
}

function applyDataToRow(type, companyId, data) {
    if (!data) return;
    ["person", "month", "year"].forEach(function (field) {
        if (data[field] === undefined) return;
        const el = document.querySelector(
            `[data-type="${type}"][data-company="${companyId}"][data-field="${field}"]`
        );
        if (el) el.value = data[field];
    });
}

// =====================================================================
// عرض العملاء في الصفحة العامة "عملائنا" (من نفس قائمة الشركات الموحّدة)
// =====================================================================
document.addEventListener("DOMContentLoaded", function () {
    const marquee = document.getElementById("clientsMarquee");
    if (!marquee) return;

    initFirebase();

    loadCompaniesOnce().then(function (companies) {
        const items = companies.filter(function (c) { return c.showInClients !== false; });
        if (!items.length) return; // تفضل الكروت الثابتة الموجودة زي ما هي

        function buildGroup(hidden) {
            let html = `<div class="marquee-group"${hidden ? ' aria-hidden="true"' : ''}>`;
            items.forEach(function (d) {
                html += `<div class="service-card client-card">
                    <h3 class="client-title">${d.nameAr} <span class="separator">|</span> <span class="client-en">${d.nameEn || d.nameAr}</span></h3>
                </div>`;
            });
            html += `</div>`;
            return html;
        }

        marquee.innerHTML = buildGroup(false) + buildGroup(true);
    }).catch(function (err) {
        console.error("تعذر تحميل قائمة العملاء:", err);
    });
});

// =====================================================================
// إدارة الشركات (تظهر تلقائياً في صفحة "عملائنا" + الإقرارات + تبويب بيانات الشركات)
// =====================================================================
function isClientsAdminPage() {
    return document.getElementById("clientsTableBody") !== null;
}

document.addEventListener("DOMContentLoaded", function () {
    if (!isClientsAdminPage()) return;

    initFirebase();

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem("eleryan_admin_logged_in");
            window.location.href = "admin-login.html";
        });
    }

    document.getElementById("addClientForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const nameAr = document.getElementById("clientNameAr").value.trim();
        const nameEn = document.getElementById("clientNameEn").value.trim();
        const person = document.getElementById("clientPerson") ? document.getElementById("clientPerson").value.trim() : "";
        const email = document.getElementById("clientEmail") ? document.getElementById("clientEmail").value.trim() : "";
        const system = document.getElementById("clientSystem") ? document.getElementById("clientSystem").value.trim() : "";
        const showInClients = document.getElementById("clientShowPublic") ? document.getElementById("clientShowPublic").checked : true;
        if (!nameAr) return;

        const client = {
            nameAr: nameAr,
            nameEn: nameEn || "",
            person: person || "",
            email: email || "",
            system: system || "",
            showInClients: showInClients
        };

        addCompany(client).then(function () {
            showToast("تمت إضافة الشركة بنجاح");
            document.getElementById("addClientForm").reset();
            loadClientsAdmin();
        }).catch(function (err) {
            console.error(err);
            showToast("حصل خطأ - تأكد من إعدادات Firebase");
        });
    });

    loadClientsAdmin();
});

function loadClientsAdmin() {
    const tbody = document.getElementById("clientsTableBody");
    const countEl = document.getElementById("clientsCount");

    loadCompaniesOnce().then(function (companies) {
        if (!companies.length) {
            tbody.innerHTML = '<tr><td colspan="8">لا يوجد شركات مضافة بعد</td></tr>';
            if (countEl) countEl.textContent = "";
            return;
        }
        let html = "";
        companies.forEach(function (d, i) {
            html += `<tr data-id="${d.id}">
                <td>${i + 1}</td>
                <td class="company-name">
                    <input type="text" class="inline-edit-input" data-field="nameAr" value="${(d.nameAr || "").replace(/"/g, '&quot;')}">
                </td>
                <td><input type="text" class="inline-edit-input" data-field="nameEn" value="${(d.nameEn || "").replace(/"/g, '&quot;')}"></td>
                <td><input type="text" class="inline-edit-input" data-field="person" value="${(d.person || "").replace(/"/g, '&quot;')}"></td>
                <td><input type="text" class="inline-edit-input" data-field="email" value="${(d.email || "").replace(/"/g, '&quot;')}"></td>
                <td><input type="text" class="inline-edit-input" data-field="system" value="${(d.system || "").replace(/"/g, '&quot;')}"></td>
                <td style="text-align:center;">
                    <input type="checkbox" class="show-public-checkbox" ${d.showInClients !== false ? "checked" : ""}>
                </td>
                <td><button class="delete-client-btn" data-id="${d.id}"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`;
        });
        tbody.innerHTML = html;
        if (countEl) countEl.textContent = companies.length + " شركة";

        tbody.querySelectorAll(".inline-edit-input").forEach(function (input) {
            input.addEventListener("blur", function () {
                const row = input.closest("tr");
                updateCompanyField(row.dataset.id, input.dataset.field, input.value.trim())
                    .then(function () { flashEl(input); showToast(); })
                    .catch(function (err) { console.error(err); showToast("حصل خطأ أثناء الحفظ"); });
            });
        });

        tbody.querySelectorAll(".show-public-checkbox").forEach(function (chk) {
            chk.addEventListener("change", function () {
                const row = chk.closest("tr");
                updateCompanyField(row.dataset.id, "showInClients", chk.checked)
                    .then(function () { showToast(); })
                    .catch(function (err) { console.error(err); showToast("حصل خطأ أثناء الحفظ"); });
            });
        });

        tbody.querySelectorAll(".delete-client-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                if (!confirm("متأكد عايز تحذف الشركة دي؟ هيتم حذفها كمان من كل الإقرارات.")) return;
                deleteCompany(btn.dataset.id).then(function () {
                    showToast("تم الحذف");
                    loadClientsAdmin();
                }).catch(function (err) {
                    console.error(err);
                    showToast("حصل خطأ أثناء الحذف");
                });
            });
        });
    }).catch(function (err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="8">تعذر تحميل البيانات</td></tr>';
    });
}

// =====================================================================
// تبويب "بيانات الشركات" (اسم الشركة + الايميل + المنظومة) داخل لوحة الإقرارات
// =====================================================================
function renderCompanyInfoPanel(companies) {
    const tbody = document.getElementById("companyInfoTableBody");
    if (!tbody) return;
    if (!companies.length) {
        tbody.innerHTML = '<tr><td colspan="5">لا يوجد شركات مضافة بعد - أضِفها من صفحة "إدارة العملاء"</td></tr>';
        return;
    }
    let html = "";
    companies.forEach(function (d, i) {
        html += `<tr data-id="${d.id}">
            <td>${i + 1}</td>
            <td class="company-name">${d.nameAr}</td>
            <td><input type="text" class="inline-edit-input" data-field="email" value="${(d.email || "").replace(/"/g, '&quot;')}"></td>
            <td><input type="text" class="inline-edit-input" data-field="system" value="${(d.system || "").replace(/"/g, '&quot;')}"></td>
            <td><input type="text" class="inline-edit-input" data-field="person" value="${(d.person || "").replace(/"/g, '&quot;')}"></td>
        </tr>`;
    });
    tbody.innerHTML = html;

    tbody.querySelectorAll(".inline-edit-input").forEach(function (input) {
        input.addEventListener("blur", function () {
            const row = input.closest("tr");
            updateCompanyField(row.dataset.id, input.dataset.field, input.value.trim())
                .then(function () { flashEl(input); showToast(); })
                .catch(function (err) { console.error(err); showToast("حصل خطأ أثناء الحفظ"); });
        });
    });
}

// =====================================================================
// إدارة مستخدمي الدخول للوحة التحكم (إضافة / حذف)
// =====================================================================
function getLocalAdminUsers() {
    return JSON.parse(localStorage.getItem("eleryan_admin_users_fallback") || "[]");
}
function saveLocalAdminUsers(list) {
    localStorage.setItem("eleryan_admin_users_fallback", JSON.stringify(list));
}

// بيتأكد إن اليوزر/الباسورد صح - بيشوف الحساب الافتراضي + أي حسابات مضافة (Firestore أو محلي)
function checkAdminCredentials(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        return Promise.resolve(true);
    }
    if (db) {
        return db.collection("adminUsers")
            .where("username", "==", username)
            .where("password", "==", password)
            .get()
            .then(function (snapshot) { return !snapshot.empty; })
            .catch(function (err) {
                console.error(err);
                return getLocalAdminUsers().some(function (u) { return u.username === username && u.password === password; });
            });
    }
    return Promise.resolve(
        getLocalAdminUsers().some(function (u) { return u.username === username && u.password === password; })
    );
}

function isAdminUsersPage() {
    return document.getElementById("adminUsersTableBody") !== null;
}

document.addEventListener("DOMContentLoaded", function () {
    if (!isAdminUsersPage()) return;
    initFirebase();

    const form = document.getElementById("addAdminUserForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("newAdminUsername").value.trim();
            const password = document.getElementById("newAdminPassword").value.trim();
            if (!username || !password) return;

            const newUser = { username: username, password: password, createdAt: Date.now() };

            if (db) {
                db.collection("adminUsers").add(newUser)
                    .then(function () {
                        showToast("تمت إضافة المستخدم بنجاح");
                        form.reset();
                        loadAdminUsers();
                    })
                    .catch(function (err) {
                        console.error(err);
                        showToast("حصل خطأ - تأكد من إعدادات Firebase");
                    });
            } else {
                const local = getLocalAdminUsers();
                local.push(newUser);
                saveLocalAdminUsers(local);
                showToast("تم الحفظ محلياً فقط - يجب ربط Firebase لمزامنة كل الأجهزة");
                form.reset();
                loadAdminUsers();
            }
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem("eleryan_admin_logged_in");
            window.location.href = "admin-login.html";
        });
    }

    loadAdminUsers();
});

function loadAdminUsers() {
    const tbody = document.getElementById("adminUsersTableBody");
    if (!tbody) return;

    let html = `<tr>
        <td>1</td>
        <td>${ADMIN_CREDENTIALS.username}</td>
        <td style="color:#777;">حساب رئيسي - لا يمكن حذفه</td>
    </tr>`;

    function render(list) {
        list.forEach(function (u, i) {
            html += `<tr>
                <td>${i + 2}</td>
                <td>${u.username}</td>
                <td><button class="delete-client-btn delete-admin-user-btn" data-id="${u.id || ""}" data-idx="${i}"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`;
        });
        tbody.innerHTML = html;

        tbody.querySelectorAll(".delete-admin-user-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                if (!confirm("متأكد عايز تحذف المستخدم ده؟")) return;
                if (db && btn.dataset.id) {
                    db.collection("adminUsers").doc(btn.dataset.id).delete()
                        .then(function () { showToast("تم الحذف"); loadAdminUsers(); })
                        .catch(function (err) { console.error(err); showToast("حصل خطأ أثناء الحذف"); });
                } else {
                    const local = getLocalAdminUsers();
                    local.splice(parseInt(btn.dataset.idx, 10), 1);
                    saveLocalAdminUsers(local);
                    showToast("تم الحذف");
                    loadAdminUsers();
                }
            });
        });
    }

    if (db) {
        db.collection("adminUsers").orderBy("createdAt", "asc").get()
            .then(function (snapshot) {
                const list = [];
                snapshot.forEach(function (doc) { list.push(Object.assign({ id: doc.id }, doc.data())); });
                render(list);
            })
            .catch(function (err) {
                console.error(err);
                render(getLocalAdminUsers());
            });
    } else {
        render(getLocalAdminUsers());
    }
}
