// =====================================================================
// ملحوظة أمان: اسم مستخدم وكلمة مرور الحساب الرئيسي وحسابات الموظفين
// بقت تتحقق من على السيرفر بس (شوف app/api/login) - مبقتش موجودة هنا
// نهائيًا عشان محدش يقدر يشوفها من "Inspect" في المتصفح.
// =====================================================================

// =====================================================================
// Firebase Config
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
let storage = null;
function initFirebase() {
    if (typeof firebase === "undefined") return false;
    try {
        if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        if (firebase.storage) { try { storage = firebase.storage(); } catch(e) {} }
        return true;
    } catch(e){ console.error(e); return false; }
}

// =====================================================================
// حماية صفحات الأدمن والصلاحيات
// الحماية الفعلية بقت في middleware.js على السيرفر (محدش يقدر يتخطاها
// بالتلاعب في sessionStorage). الكود ده بس بيجيب بيانات الجلسة
// المتحقق منها من /api/me عشان نعرض اسم المستخدم ونتحكم في الواجهة.
// =====================================================================
const PROTECTED_PAGES = {
    "admin-home": "all", 
    "admin-dashboard": "declarations",
    "admin-clients": "clients",
    "admin-companies": "companies",
    "admin-users": "users",
    "attendance": "attendance_click",
    "attendance-report": "attendance_report",
    "e-invoice": "einvoice", // تم ربط صفحة الأتمتة بصلاحية الفاتورة الإلكترونية
    "admin-services": "office_services",
    "admin-blog": "blog",
    "admin-faq": "faq"
};

const currentPage = window.location.pathname.split("/").pop();

// window.ELERYAN_SESSION_READY بيبقى Promise بيتحل ببيانات الجلسة
// (أو null لو مش مسجل دخول)، أي كود تاني محتاج يعرف يوزر إيه ينتظره.
window.ELERYAN_SESSION_READY = (async function() {
    try {
        const res = await fetch("/api/me", { credentials: "same-origin" });
        const data = await res.json();
        if (!data.loggedIn) {
            if (PROTECTED_PAGES[currentPage]) window.location.href = "admin-login";
            return null;
        }
        // مرآة بسيطة لـ sessionStorage عشان أي كود قديم بيقرا منها لسه يشتغل
        // (ده مجرد عرض/واجهة، مش مصدر الحماية الحقيقي)
        sessionStorage.setItem("eleryan_user_logged_in", data.username);
        sessionStorage.setItem("eleryan_user_role", data.role);
        sessionStorage.setItem("eleryan_user_permissions", JSON.stringify(data.permissions || []));
        return data;
    } catch (e) {
        console.error("تعذر التحقق من الجلسة:", e);
        return null;
    }
})();

// =====================================================================
// Helpers
// =====================================================================
function showToast(msg) {
    const t = document.getElementById("saveToast");
    if (!t) return;
    t.querySelector("span").textContent = msg || "تم الحفظ بنجاح";
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2500);
}
function flashEl(el) {
    if (!el) return;
    el.classList.add("saved-flash");
    setTimeout(() => el.classList.remove("saved-flash"), 900);
}
function setupLogout(btnId) {
    const b = document.getElementById(btnId);
    if (b) b.addEventListener("click", async function() {
        try { await fetch("/api/logout", { method: "POST" }); } catch (e) {}
        sessionStorage.clear(); // تفريغ الجلسة بالكامل
        window.location.href = "admin-login";
    });
}

// =====================================================================
// الشركات الافتراضية في الإقرارات
// =====================================================================
const DEFAULT_DECL_COMPANIES = [
    {id:"c1",  name:"لاكوزين", person:"خالد عبد اللطيف عبد الوهاب", createdAt:1},
    {id:"c2",  name:"شريف عبد الوهاب", person:"شريف عبد اللطيف عبد الوهاب", createdAt:2},
    {id:"c3",  name:"البدراويه", person:"محمد كمال عبد العزيز", createdAt:3},
    {id:"c4",  name:"المتحده شركه", person:"محمود ابو الحجاج", createdAt:4},
    {id:"c5",  name:"لاكوستر", person:"عمرو", createdAt:5},
    {id:"c6",  name:"جرين لاين بيكيا", person:"احمد ماجد", createdAt:6},
    {id:"c7",  name:"تيرا بيلد", person:"صالح عيد هواري", createdAt:7},
    {id:"c8",  name:"نسر العرب", person:"محمد محمد ممثل", createdAt:8},
    {id:"c9",  name:"ديماتك", person:"احمد سعيد سلام", createdAt:9},
    {id:"c10", name:"بونيتيرا لاعمال الكهروميكانيكية", person:"هشام احمد محمد عمر", createdAt:10},
    {id:"c11", name:"بونيتيرا للديكور", person:"هشام احمد محمد عمر", createdAt:11},
    {id:"c12", name:"بونيتيرا للانشاءات", person:"هشام احمد محمد عمر", createdAt:12},
    {id:"c13", name:"بونيتيرا لتشغيل وادارة المنشئات", person:"هشام احمد محمد عمر", createdAt:13}
];

const MONTHS = [
    {v:1,t:"1 - يناير"},{v:2,t:"2 - فبراير"},{v:3,t:"3 - مارس"},
    {v:4,t:"4 - أبريل"},{v:5,t:"5 - مايو"},{v:6,t:"6 - يونيو"},
    {v:7,t:"7 - يوليو"},{v:8,t:"8 - أغسطس"},{v:9,t:"9 - سبتمبر"},
    {v:10,t:"10 - أكتوبر"},{v:11,t:"11 - نوفمبر"},{v:12,t:"12 - ديسمبر"}
];
function getYears() {
    const y = new Date().getFullYear();
    const a = [];
    for (let i = y-3; i <= y+3; i++) a.push(i);
    return a;
}
const DECLARATION_TYPES = ["vat","withholding","payroll","income"];

// =====================================================================
// === صفحة الداشبورد (الإقرارات) ===
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    if (!document.querySelector(".dashboard")) return;
    const pageName = currentPage;
    if (pageName !== "admin-dashboard") return;

    initFirebase();
    setupLogout("logoutBtn");

    document.querySelectorAll(".admin-tab-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById("panel-"+btn.dataset.tab).classList.add("active");
            history.replaceState(null,"","#"+btn.dataset.tab);
        });
    });

    const hashTab = window.location.hash.replace("#","");
    if (hashTab) {
        const tb = document.querySelector('.admin-tab-btn[data-tab="'+hashTab+'"]');
        if (tb) tb.click();
    }

    // زراير إضافة شركة لكل نوع إقرار (فاتورة، خصم، مرتبات، دخل)
    document.querySelectorAll("[data-decl-type]").forEach(function(btn) {
        btn.addEventListener("click", function() { addDeclCompany(btn.dataset.declType); });
    });

    // زراير تحويل وتصدير CSV (الدوال معرّفة في admin-dashboard-init.js)
    const taxCsvBtn = document.getElementById("taxCsvBtn");
    if (taxCsvBtn) taxCsvBtn.addEventListener("click", function() {
        if (typeof window.processAndDownloadTaxCSV === "function") window.processAndDownloadTaxCSV();
    });
    const payrollCsvBtn = document.getElementById("payrollCsvBtn");
    if (payrollCsvBtn) payrollCsvBtn.addEventListener("click", function() {
        if (typeof window.processAndDownloadPayrollCSV === "function") window.processAndDownloadPayrollCSV();
    });

    document.querySelectorAll(".company-search").forEach(function(inp) {
        inp.addEventListener("input", function() {
            const panel = this.dataset.panel;
            const q = this.value.trim();
            document.querySelectorAll("#tbody-"+panel+" tr").forEach(function(row) {
                row.style.display = row.dataset.companyName && row.dataset.companyName.includes(q) ? "" : "none";
            });
        });
    });

    DECLARATION_TYPES.forEach(loadDeclPanel);
});

function loadDeclPanel(type) {
    const tbody = document.getElementById("tbody-"+type);
    if (!tbody) return;
    getCompaniesForDecl(type, function(companies) {
        renderDeclTable(type, companies);
        loadDeclData(type, companies);
    });
}

function getCompaniesForDecl(type, callback) {
    if (db) {
        db.collection("decl_companies").doc(type).collection("list")
            .orderBy("lastFiled","asc").get()
            .then(function(snap) {
                if (!snap.empty) {
                    const companies = [];
                    snap.forEach(d => companies.push({id: d.id, ...d.data()}));
                    callback(companies);
                } else { seedDefaultCompanies(type, callback); }
            }).catch(function() { callback(DEFAULT_DECL_COMPANIES); });
    } else { callback(DEFAULT_DECL_COMPANIES); }
}

function seedDefaultCompanies(type, callback) {
    if (!db) { callback(DEFAULT_DECL_COMPANIES); return; }
    const batch = db.batch();
    DEFAULT_DECL_COMPANIES.forEach(function(c) {
        const ref = db.collection("decl_companies").doc(type).collection("list").doc(c.id);
        batch.set(ref, {name: c.name, person: c.person, lastFiled: c.createdAt});
    });
    batch.commit().then(function() { getCompaniesForDecl(type, callback); })
    .catch(function() { callback(DEFAULT_DECL_COMPANIES); });
}

function renderDeclTable(type, companies) {
    const tbody = document.getElementById("tbody-"+type);
    const isMonthly = type !== "income";
    let html = "";

    companies.forEach(function(company, idx) {
        html += `<tr data-company-id="${company.id}" data-company-name="${company.name}">
            <td>${idx+1}</td>
            <td class="company-name">${company.name}</td>
            <td><input type="text" class="admin-select person-input"
                style="width:170px;text-align:center;border:1px solid #d8dedb;border-radius:8px;padding:8px 10px;"
                data-type="${type}" data-company="${company.id}" data-field="person"
                value="${company.person || ""}"></td>`;

        if (isMonthly) {
            html += `<td><select class="admin-select" data-type="${type}" data-company="${company.id}" data-field="month">
                ${MONTHS.map(m=>`<option value="${m.v}">${m.t}</option>`).join("")}
            </select></td>`;
        }

        html += `<td><select class="admin-select" data-type="${type}" data-company="${company.id}" data-field="year">
                ${getYears().map(y=>`<option value="${y}">${y}</option>`).join("")}
            </select></td>
            <td><button class="decl-delete-btn" data-type="${type}" data-company="${company.id}" title="حذف الشركة"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`;
    });

    tbody.innerHTML = html;

    tbody.querySelectorAll("select.admin-select, input.person-input").forEach(function(el) {
        const evt = el.tagName === "SELECT" ? "change" : "blur";
        el.addEventListener(evt, function() {
            saveDeclField(el.dataset.type, el.dataset.company, el.dataset.field, el.value, el);
        });
    });

    tbody.querySelectorAll(".decl-delete-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            if (!confirm("عايز تحذف الشركة دي من الإقرار ده؟")) return;
            const type = btn.dataset.type;
            const cid = btn.dataset.company;
            if (db) {
                db.collection("decl_companies").doc(type).collection("list").doc(cid).delete()
                    .then(function() { loadDeclPanel(type); showToast("تم الحذف"); })
                    .catch(function(e) { console.error(e); });
            } else { showToast("Firebase غير متصل"); }
        });
    });
}

function loadDeclData(type, companies) {
    companies.forEach(function(company) {
        const localKey = "eleryan_"+type+"_"+company.id;
        const localData = JSON.parse(localStorage.getItem(localKey)||"{}");
        applyDataToRow(type, company.id, localData);

        if (db) {
            db.collection("declarations").doc(type).collection("companies").doc(company.id)
                .get().then(function(doc) {
                    if (doc.exists) {
                        applyDataToRow(type, company.id, doc.data());
                        localStorage.setItem(localKey, JSON.stringify(doc.data()));
                    }
                }).catch(console.error);
        }
    });
}

function saveDeclField(type, companyId, field, value, el) {
    const localKey = "eleryan_"+type+"_"+companyId;
    let localData = JSON.parse(localStorage.getItem(localKey)||"{}");
    localData[field] = value;
    localStorage.setItem(localKey, JSON.stringify(localData));

    const rowEl = el.closest("tr");
    let month = 0, year = 0;
    if (rowEl) {
        const mEl = rowEl.querySelector('[data-field="month"]');
        const yEl = rowEl.querySelector('[data-field="year"]');
        month = mEl ? parseInt(mEl.value)||0 : 0;
        year  = yEl ? parseInt(yEl.value)||0 : 0;
    }
    const lastFiled = year * 100 + month;

    if (db) {
        const p1 = db.collection("declarations").doc(type).collection("companies").doc(companyId)
            .set({[field]: value}, {merge:true});
        const p2 = db.collection("decl_companies").doc(type).collection("list").doc(companyId)
            .set({lastFiled: lastFiled}, {merge:true});
        Promise.all([p1, p2])
            .then(function() { showToast(); flashEl(el); loadDeclPanel(type); })
            .catch(function(e) { console.error(e); showToast("خطأ - تحقق من Firebase"); });
    } else {
        showToast("تم الحفظ محلياً فقط");
        flashEl(el);
    }
}

function addDeclCompany(type) {
    const inp = document.getElementById("addDeclInput-"+type);
    const name = inp ? inp.value.trim() : "";
    if (!name) return;
    if (!db) { showToast("Firebase غير متصل"); return; }

    const newId = "c_"+Date.now();
    db.collection("decl_companies").doc(type).collection("list").doc(newId)
        .set({name: name, person: "", lastFiled: 0})
        .then(function() {
            if (inp) inp.value = "";
            showToast("تمت الإضافة");
            loadDeclPanel(type);
        }).catch(console.error);
}

function applyDataToRow(type, companyId, data) {
    if (!data) return;
    ["person","month","year"].forEach(function(field) {
        if (data[field] === undefined) return;
        const el = document.querySelector(`[data-type="${type}"][data-company="${companyId}"][data-field="${field}"]`);
        if (el) el.value = data[field];
    });
}

// =====================================================================
// === صفحة بيانات الشركات ===
// =====================================================================
const COMP_DATA_SEED = [];
document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "admin-companies") return;
    initFirebase();
    setupLogout("logoutBtn");

    document.getElementById("compDataSearch").addEventListener("input", function() {
        const q = this.value.trim().toLowerCase();
        document.querySelectorAll("#compDataTbody tr").forEach(function(row) {
            const n = row.dataset.companyName || "";
            row.style.display = n.toLowerCase().includes(q) ? "" : "none";
        });
    });
    loadCompanyData();

    const addCompanyBtn = document.getElementById("addCompanyBtn");
    if (addCompanyBtn) addCompanyBtn.addEventListener("click", window.addCompanyData);

    const undoCompanyBtn = document.getElementById("undoCompanyBtn");
    if (undoCompanyBtn) undoCompanyBtn.addEventListener("click", window.undoCompanyEdit);

    const redoCompanyBtn = document.getElementById("redoCompanyBtn");
    if (redoCompanyBtn) redoCompanyBtn.addEventListener("click", window.redoCompanyEdit);
});

function loadCompanyData() {
    const tbody = document.getElementById("compDataTbody");
    if (!tbody) return;

    if (db) {
        db.collection("company_data").orderBy("createdAt","asc").get()
            .then(function(snap) {
                if (snap.empty) { seedCompanyData(); } 
                else {
                    const rows = [];
                    snap.forEach(d => rows.push({id: d.id, ...d.data()}));
                    renderCompanyData(rows);
                }
            }).catch(function(e) { console.error(e); });
    } else {
        const local = JSON.parse(localStorage.getItem("eleryan_company_data")||"null");
        if (local) renderCompanyData(local);
    }
}

function seedCompanyData() {} 
function renderCompanyData(rows) {
    const tbody = document.getElementById("compDataTbody");
    const countEl = document.getElementById("compDataCount");
    if (countEl) countEl.textContent = "("+rows.length+" شركة)";
    if (!rows.length) { tbody.innerHTML = '<tr><td colspan="18" style="padding:30px;color:#999;">لا يوجد بيانات</td></tr>'; return; }
    let html = "";
    rows.forEach(function(row, idx) {
        html += `<tr data-company-name="${row.name||""}">
            <td class="col-idx">${idx+1}</td>
            <td class="col-company"><input data-id="${row.id}" data-field="name" value="${esc(row.name)}"></td>
            <td><input data-id="${row.id}" data-field="regno" value="${esc(row.regno)}" class="col-reg"></td>
            <td class="col-type"><input data-id="${row.id}" data-field="type" value="${esc(row.type)}"></td>
            <td class="col-system"><input data-id="${row.id}" data-field="system" value="${esc(row.system)}"></td>
            <td><input data-id="${row.id}" data-field="email" value="${esc(row.email)}" class="col-pass"></td>
            <td><input data-id="${row.id}" data-field="emailpass" value="${esc(row.emailpass)}" class="col-pass"></td>
            <td><input data-id="${row.id}" data-field="sysuser" value="${esc(row.sysuser)}" class="col-pass"></td>
            <td><input data-id="${row.id}" data-field="syspass" value="${esc(row.syspass)}" class="col-pass"></td>
            <td><input data-id="${row.id}" data-field="natid" value="${esc(row.natid)}" class="col-natid"></td>
            <td><input data-id="${row.id}" data-field="einvuser" value="${esc(row.einvuser)}" class="col-pass"></td>
            <td><input data-id="${row.id}" data-field="einvpass" value="${esc(row.einvpass)}" class="col-pass"></td>
            <td><input data-id="${row.id}" data-field="piencode" value="${esc(row.piencode)}"></td>
            <td><input data-id="${row.id}" data-field="salaries" value="${esc(row.salaries)}" class="col-pass"></td>
            <td><input data-id="${row.id}" data-field="acccode" value="${esc(row.acccode)}"></td>
            <td><input data-id="${row.id}" data-field="accpass" value="${esc(row.accpass)}" class="col-pass"></td>
            <td><input data-id="${row.id}" data-field="notes" value="${esc(row.notes)}"></td>
            <td class="col-del"><button class="decl-delete-btn comp-delete-btn" data-id="${row.id}"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`;
    });
    tbody.innerHTML = html;

    // تحديد عرض كل خلية تلقائياً على حسب طول النص المكتوب فيها
    tbody.querySelectorAll("input").forEach(function(inp) {
        autoSizeCompanyInput(inp);
        inp.addEventListener("input", function() { autoSizeCompanyInput(inp); });

        inp.addEventListener("focus", function() {
            inp.dataset.prevValue = inp.value;
        });

        inp.addEventListener("blur", function() {
            const oldValue = inp.dataset.prevValue !== undefined ? inp.dataset.prevValue : inp.value;
            if (oldValue !== inp.value) {
                window.companyUndoStack.push({ id: inp.dataset.id, field: inp.dataset.field, oldValue: oldValue, newValue: inp.value });
                window.companyRedoStack = [];
            }
            saveCompanyField(inp.dataset.id, inp.dataset.field, inp.value, inp);
        });
    });

    tbody.querySelectorAll(".comp-delete-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            if (!confirm("حذف الشركة دي نهائياً؟")) return;
            if (db) {
                db.collection("company_data").doc(btn.dataset.id).delete()
                    .then(function() { showToast("تم الحذف"); loadCompanyData(); }).catch(console.error);
            }
        });
    });
}

// تحديد عرض الخلية تلقائياً على حسب عدد حروف القيمة المكتوبة (بحد أدنى معقول)
function autoSizeCompanyInput(inp) {
    const len = (inp.value || "").length;
    inp.style.width = Math.max(len + 2, 6) + "ch";
}

// =====================================================================
// تراجع / إعادة للتعديلات في جدول بيانات الشركات (خاص بالجلسة الحالية)
// =====================================================================
window.companyUndoStack = [];
window.companyRedoStack = [];

function findCompanyInput(id, field) {
    const inputs = document.querySelectorAll('.companies-data-table td input[data-field]');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].dataset.id === id && inputs[i].dataset.field === field) return inputs[i];
    }
    return null;
}

window.undoCompanyEdit = function() {
    if (!window.companyUndoStack.length) { showToast("لا يوجد تعديل للتراجع عنه"); return; }
    const change = window.companyUndoStack.pop();
    const inp = findCompanyInput(change.id, change.field);
    if (inp) { inp.value = change.oldValue; inp.dataset.prevValue = change.oldValue; autoSizeCompanyInput(inp); }
    window.companyRedoStack.push(change);
    saveCompanyField(change.id, change.field, change.oldValue, inp);
};

window.redoCompanyEdit = function() {
    if (!window.companyRedoStack.length) { showToast("لا يوجد تعديل لإعادته"); return; }
    const change = window.companyRedoStack.pop();
    const inp = findCompanyInput(change.id, change.field);
    if (inp) { inp.value = change.newValue; inp.dataset.prevValue = change.newValue; autoSizeCompanyInput(inp); }
    window.companyUndoStack.push(change);
    saveCompanyField(change.id, change.field, change.newValue, inp);
};

function saveCompanyField(id, field, value, el) {
    if (db) {
        db.collection("company_data").doc(id).set({[field]: value}, {merge:true})
            .then(function() { showToast(); flashEl(el); })
            .catch(function(e) { console.error(e); showToast("خطأ في الحفظ"); });
    }
}
window.addCompanyData = function() {
    const get = id => document.getElementById(id).value.trim();
    const name = get("nc_name");
    if (!name) { alert("اسم الشركة مطلوب"); return; }
    const row = {
        name, type: get("nc_type"), system: get("nc_system"), email: get("nc_email"), emailpass: get("nc_emailpass"),
        sysuser: get("nc_sysuser"), syspass: get("nc_syspass"), natid: get("nc_natid"), regno: get("nc_regno"),
        einvuser: get("nc_einvuser"), einvpass: get("nc_einvpass"), piencode: get("nc_piencode"), salaries: get("nc_salaries"),
        acccode: get("nc_acccode"), accpass: get("nc_accpass"), notes: get("nc_notes"), createdAt: Date.now()
    };
    if (db) {
        db.collection("company_data").add(row).then(function() {
            document.getElementById("addCompanyRow").querySelectorAll("input").forEach(i=>i.value="");
            showToast("تمت الإضافة بنجاح"); loadCompanyData();
        }).catch(console.error);
    }
};
function esc(v) { return (v||"").replace(/"/g,"&quot;"); }

// =====================================================================
// === صفحة إدارة المستخدمين وتعديلات الصلاحيات ===
// =====================================================================
const PERMISSIONS_LIST = [
    {value:"declarations",      label:"إقرارات ضريبية"},
    {value:"companies",         label:"بيانات الشركات"},
    {value:"clients",           label:"إدارة عملائنا"},
    {value:"users",             label:"إدارة المستخدمين"},
    {value:"attendance_click",  label:"تسجيل الحضور والانصراف"},
    {value:"attendance_report", label:"تقرير الحضور والغياب"},
    {value:"einvoice",          label:"الفاتورة الإلكترونية"},
    {value:"office_services",   label:"خدمات المكتب"},
    {value:"blog",              label:"المدونة"},
    {value:"faq",               label:"الأسئلة (رسائل تواصل معنا)"}
];

function permLabel(value) {
    const found = PERMISSIONS_LIST.find(p => p.value === value);
    return found ? found.label : value;
}

document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "admin-users") return;
    initFirebase();
    setupLogout("logoutBtn");
    loadUsers();

    const addUserBtn = document.getElementById("addUserBtn");
    if (addUserBtn) addUserBtn.addEventListener("click", window.addUser);

    // إغلاق نافذة تعديل الصلاحيات
    const overlay = document.getElementById("editUserOverlay");
    const cancelBtn = document.getElementById("editUserCancel");
    if (cancelBtn) cancelBtn.addEventListener("click", closeEditUserModal);
    if (overlay) overlay.addEventListener("click", function(e) {
        if (e.target === overlay) closeEditUserModal();
    });
});

let currentEditUserId = null;

function closeEditUserModal() {
    const overlay = document.getElementById("editUserOverlay");
    if (overlay) overlay.classList.remove("show");
    currentEditUserId = null;
}

window.openEditUserModal = function(id, username, permissionsJSON) {
    currentEditUserId = id;
    let currentPerms = [];
    try { currentPerms = JSON.parse(permissionsJSON) || []; } catch(e) { currentPerms = []; }

    document.getElementById("editUserName").textContent = username;

    const grid = document.getElementById("editPermissionsGrid");
    grid.innerHTML = PERMISSIONS_LIST.map(function(p) {
        const checked = currentPerms.includes(p.value) ? "checked" : "";
        return `<label><input type="checkbox" name="editPermission" value="${p.value}" ${checked}> ${p.label}</label>`;
    }).join("");

    document.getElementById("editUserOverlay").classList.add("show");
};

document.addEventListener("DOMContentLoaded", function() {
    const saveBtn = document.getElementById("editUserSave");
    if (!saveBtn) return;
    saveBtn.addEventListener("click", async function() {
        if (!currentEditUserId) { closeEditUserModal(); return; }
        const checkboxes = document.querySelectorAll('input[name="editPermission"]:checked');
        const permissions = Array.from(checkboxes).map(cb => cb.value);
        try {
            const res = await fetch("/api/admin-users/" + currentEditUserId, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permissions }),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.message || "فشل الحفظ");
            showToast("تم تحديث الصلاحيات");
            closeEditUserModal();
            loadUsers();
        } catch (e) {
            console.error(e);
            showToast("خطأ أثناء حفظ الصلاحيات");
        }
    });
});

async function loadUsers() {
    const grid = document.getElementById("usersGrid");
    if (!grid) return;

    const session = await window.ELERYAN_SESSION_READY;
    const mainAccountLabel = (session && session.role === "admin") ? session.username : "الحساب الرئيسي";

    let html = `<div class="user-card main-account">
        <div class="user-icon"><i class="fa-solid fa-crown"></i></div>
        <div class="user-info">
            <strong>${esc(mainAccountLabel)}</strong>
            <span>الحساب الرئيسي (لا يمكن حذفه)</span>
        </div>
    </div>`;

    try {
        const res = await fetch("/api/admin-users");
        const data = await res.json();
        if (!data.ok) throw new Error(data.message || "تعذر تحميل المستخدمين");

        data.users.forEach(function(u) {
            const perms = u.permissions || [];
            let permsHTML = perms.length
                ? perms.map(p => `<span style="background:#eee;color:#333;font-size:10px;padding:2px 5px;border-radius:4px;margin-left:4px;">${esc(permLabel(p))}</span>`).join("")
                : `<span style="color:#bbb;font-size:11px;">لا توجد صلاحيات محددة</span>`;
            const permsAttr = esc(JSON.stringify(perms)).replace(/'/g, "&#39;");
            html += `<div class="user-card">
                <div class="user-icon"><i class="fa-solid fa-user"></i></div>
                <div class="user-info">
                    <strong>${esc(u.username)}</strong>
                    <span>••••••••</span>
                    <div style="margin-top:5px;">${permsHTML}</div>
                </div>
                <div class="card-actions">
                    <button class="edit-user-btn" data-id="${u.id}" data-username="${esc(u.username)}" data-perms='${permsAttr}' title="تعديل الصلاحيات">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="delete-user-btn" data-id="${u.id}" title="حذف">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>`;
        });

        grid.innerHTML = html;
        grid.querySelectorAll(".delete-user-btn").forEach(function(btn) {
            btn.addEventListener("click", async function() {
                if (!confirm("حذف هذا المستخدم؟")) return;
                try {
                    const res = await fetch("/api/admin-users/" + btn.dataset.id, { method: "DELETE" });
                    const data = await res.json();
                    if (!data.ok) throw new Error(data.message);
                    showToast("تم الحذف");
                    loadUsers();
                } catch (e) { console.error(e); showToast("تعذر الحذف"); }
            });
        });
        grid.querySelectorAll(".edit-user-btn").forEach(function(btn) {
            btn.addEventListener("click", function() {
                openEditUserModal(btn.dataset.id, btn.dataset.username, btn.dataset.perms);
            });
        });
    } catch (e) {
        console.error(e);
        grid.innerHTML = html + '<div style="padding:20px;color:red;">تعذر تحميل المستخدمين</div>';
    }
}

window.addUser = async function() {
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value.trim();

    const checkboxes = document.querySelectorAll('input[name="permission"]:checked');
    const permissions = Array.from(checkboxes).map(cb => cb.value);

    if (!username || !password) { alert("يجب إدخال اسم المستخدم وكلمة المرور"); return; }

    try {
        const res = await fetch("/api/admin-users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, permissions }),
        });
        const data = await res.json();
        if (!data.ok) { alert(data.message || "تعذرت الإضافة"); return; }

        document.getElementById("newUsername").value = "";
        document.getElementById("newPassword").value = "";
        document.querySelectorAll('input[name="permission"]').forEach(cb => cb.checked = false);
        showToast("تمت إضافة المستخدم");
        loadUsers();
    } catch (e) {
        console.error(e);
        alert("حدث خطأ أثناء إضافة المستخدم");
    }
};

// تسجيل الدخول بقى بيتم بالكامل على السيرفر (شوف admin-login-init.js و app/api/login)
// الدالة دي اتشالت من هنا لأنها كانت بتبعت كلمة المرور والهاش عشان يتقارنوا في المتصفح.

// =====================================================================
// === باقي الأكواد القديمة المتعلقة بالعملاء (admin-clients) ===
// =====================================================================
const CLIENTS_SEED = [ {nameAr: "لاكوزين", nameEn: "La Cuisine"} ];
function seedClientsAdmin(callback) {
    if (!db) return; const batch = db.batch();
    CLIENTS_SEED.forEach(function(c, i) {
        const ref = db.collection("clients").doc();
        batch.set(ref, {...c, createdAt: Date.now() + i});
    });
    batch.commit().then(callback).catch(console.error);
}
document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "admin-clients") return;
    initFirebase(); setupLogout("logoutBtn");
    document.getElementById("addClientForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const nameAr = document.getElementById("clientNameAr").value.trim();
        const nameEn = document.getElementById("clientNameEn").value.trim();
        if (!nameAr) return;
        const client = {nameAr, nameEn: nameEn||nameAr, createdAt: Date.now()};
        if (db) {
            db.collection("clients").add(client)
                .then(function() { showToast("تمت الإضافة"); this.reset(); loadClientsAdmin(); }.bind(this))
        }
    });
    loadClientsAdmin();
});

function loadClientsAdmin() {
    const tbody = document.getElementById("clientsTableBody");
    const countEl = document.getElementById("clientsCount");
    if (!tbody) return;
    if (db) {
        db.collection("clients").orderBy("createdAt","asc").get().then(function(snap) {
            if (snap.empty) { seedClientsAdmin(loadClientsAdmin); return; }
            let html = ""; let i = 0;
            snap.forEach(function(doc) {
                i++; const d=doc.data();
                html += `<tr><td>${i}</td><td class="company-name">${d.nameAr}</td><td>${d.nameEn||""}</td>
                    <td><button class="delete-client-btn" data-id="${doc.id}"><i class="fa-solid fa-trash"></i></button></td></tr>`;
            });
            tbody.innerHTML = html;
            if (countEl) countEl.textContent = i+" شركة";
            tbody.querySelectorAll(".delete-client-btn").forEach(function(btn) {
                btn.addEventListener("click", function() {
                    if (!confirm("حذف هذا العميل؟")) return;
                    db.collection("clients").doc(btn.dataset.id).delete()
                        .then(function() { showToast("تم الحذف"); loadClientsAdmin(); });
                });
            });
        });
    }
}

// =====================================================================
// === صفحة عملائنا العامة (clients) - عرض الشركات في الماركيه ===
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "clients") return;
    initFirebase();
    loadPublicClients();
});

function loadPublicClients() {
    const container = document.getElementById("clientsMarquee");
    if (!container) return;

    function renderClients(list) {
        if (!list.length) {
            container.innerHTML = '<div style="text-align:center;padding:20px;color:#fff;">سيتم إضافة عملائنا قريباً</div>';
            return;
        }

        function buildGroup() {
            const group = document.createElement("div");
            group.className = "marquee-group";
            list.forEach(function(c) {
                const card = document.createElement("div");
                card.className = "service-card client-card";

                const title = document.createElement("div");
                title.className = "client-title";

                const arEl = document.createElement("h3");
                arEl.style.margin = "0";
                arEl.textContent = c.nameAr || "";
                title.appendChild(arEl);

                if (c.nameEn) {
                    const sep = document.createElement("span");
                    sep.className = "separator";
                    sep.textContent = "|";
                    title.appendChild(sep);

                    const enEl = document.createElement("span");
                    enEl.className = "client-en";
                    enEl.textContent = c.nameEn;
                    title.appendChild(enEl);
                }

                card.appendChild(title);
                group.appendChild(card);
            });
            return group;
        }

        container.innerHTML = "";
        container.appendChild(buildGroup());
        container.appendChild(buildGroup());
    }

    if (db) {
        db.collection("clients").orderBy("createdAt", "asc").get().then(function(snap) {
            const list = [];
            snap.forEach(function(doc) { list.push(doc.data()); });
            renderClients(list);
        }).catch(function(e) {
            console.error(e);
            container.innerHTML = '<div style="text-align:center;padding:20px;color:#fff;">تعذر تحميل بيانات العملاء</div>';
        });
    } else {
        container.innerHTML = '<div style="text-align:center;padding:20px;color:#fff;">تعذر الاتصال بقاعدة البيانات</div>';
    }
}

// =====================================================================
// === صفحة أتمتة الفواتير (e-invoice) ===
// الكود القديم هنا اتشال بالكامل (كان بيجيب أسماء الشركات من مجلد
// GitHub ويشغل mycompany://run) - الصفحة دلوقتي منطقها في einvoice-init.js
// =====================================================================

// =====================================================================
// === صفحة إدارة "خدمات المكتب" (admin-services) ===
// تُدير المحتوى اللي بيظهر في صفحة "خدماتنا" العامة (services)
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "admin-services") return;
    initFirebase();
    setupLogout("logoutBtn");
    loadOfficeServicesAdmin();

    const addBtn = document.getElementById("addServiceBtn");
    if (addBtn) addBtn.addEventListener("click", addOfficeService);
});

function loadOfficeServicesAdmin() {
    const list = document.getElementById("servicesAdminList");
    if (!list || !db) return;
    list.innerHTML = '<div style="padding:20px;color:#999;">جاري التحميل...</div>';
    db.collection("office_services").orderBy("order", "asc").get().then(function(snap) {
        if (snap.empty) { list.innerHTML = '<div style="padding:20px;color:#999;">لا توجد خدمات مضافة بعد</div>'; return; }
        const rows = [];
        snap.forEach(d => rows.push({id: d.id, ...d.data()}));
        renderOfficeServicesAdmin(rows);
    }).catch(function(e) {
        console.error(e);
        list.innerHTML = '<div style="padding:20px;color:red;">تعذر تحميل الخدمات</div>';
    });
}

function renderOfficeServicesAdmin(rows) {
    const list = document.getElementById("servicesAdminList");
    let html = "";
    rows.forEach(function(row, idx) {
        html += `<div class="admin-panel" style="padding:18px;margin-bottom:15px;display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap;">
            <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
                <img src="${row.imageUrl || ''}" alt="" style="width:80px;height:80px;border-radius:50%;object-fit:cover;background:#f0f0f0;border:1px solid #eee;">
                <label class="logout-btn" style="cursor:pointer;font-size:0.75rem;padding:6px 10px;">
                    <i class="fa-solid fa-image"></i> تغيير الصورة
                    <input type="file" accept="image/*" data-id="${row.id}" class="service-img-input" style="display:none;">
                </label>
            </div>
            <div style="flex:1;min-width:220px;display:flex;flex-direction:column;gap:10px;">
                <input type="text" value="${esc(row.name)}" data-id="${row.id}" data-field="name" class="service-field-input" placeholder="اسم الخدمة" style="font-weight:800;padding:10px;border:1px solid #ddd;border-radius:8px;">
                <textarea data-id="${row.id}" data-field="description" class="service-field-input" placeholder="وصف الخدمة" rows="2" style="padding:10px;border:1px solid #ddd;border-radius:8px;font-family:inherit;resize:vertical;">${row.description || ""}</textarea>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;">
                <button class="logout-btn service-move-up" data-id="${row.id}" ${idx===0?"disabled":""} title="تحريك لأعلى"><i class="fa-solid fa-arrow-up"></i></button>
                <button class="logout-btn service-move-down" data-id="${row.id}" ${idx===rows.length-1?"disabled":""} title="تحريك لأسفل"><i class="fa-solid fa-arrow-down"></i></button>
                <button class="decl-delete-btn service-delete" data-id="${row.id}" title="حذف"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`;
    });
    list.innerHTML = html;

    list.querySelectorAll(".service-field-input").forEach(function(el) {
        el.addEventListener("blur", function() {
            db.collection("office_services").doc(el.dataset.id).set({[el.dataset.field]: el.value}, {merge:true})
                .then(function() { showToast(); flashEl(el); }).catch(console.error);
        });
    });

    list.querySelectorAll(".service-img-input").forEach(function(el) {
        el.addEventListener("change", function() {
            const file = el.files[0];
            if (file) uploadOfficeServiceImage(el.dataset.id, file);
        });
    });

    list.querySelectorAll(".service-delete").forEach(function(btn) {
        btn.addEventListener("click", function() {
            if (!confirm("حذف هذه الخدمة نهائياً؟")) return;
            db.collection("office_services").doc(btn.dataset.id).delete()
                .then(function() { showToast("تم الحذف"); loadOfficeServicesAdmin(); }).catch(console.error);
        });
    });

    list.querySelectorAll(".service-move-up").forEach(function(btn) {
        btn.addEventListener("click", function() { moveOfficeService(rows, btn.dataset.id, -1); });
    });
    list.querySelectorAll(".service-move-down").forEach(function(btn) {
        btn.addEventListener("click", function() { moveOfficeService(rows, btn.dataset.id, 1); });
    });
}

function moveOfficeService(rows, id, direction) {
    const idx = rows.findIndex(r => r.id === id);
    const swapWith = idx + direction;
    if (swapWith < 0 || swapWith >= rows.length) return;
    const a = rows[idx], b = rows[swapWith];
    const batch = db.batch();
    batch.set(db.collection("office_services").doc(a.id), {order: b.order}, {merge:true});
    batch.set(db.collection("office_services").doc(b.id), {order: a.order}, {merge:true});
    batch.commit().then(function() { loadOfficeServicesAdmin(); }).catch(console.error);
}

function uploadOfficeServiceImage(id, file) {
    if (!storage) { showToast("تخزين الصور غير متاح"); return; }
    showToast("جاري رفع الصورة...");
    const ref = storage.ref().child("office_services/" + id + "/" + Date.now() + "_" + file.name);
    ref.put(file).then(function() {
        return ref.getDownloadURL();
    }).then(function(url) {
        return db.collection("office_services").doc(id).set({imageUrl: url}, {merge:true});
    }).then(function() {
        showToast("تم رفع الصورة");
        loadOfficeServicesAdmin();
    }).catch(function(e) { console.error(e); showToast("تعذر رفع الصورة"); });
}

window.addOfficeService = function() {
    const nameEl = document.getElementById("newServiceName");
    const descEl = document.getElementById("newServiceDesc");
    const fileEl = document.getElementById("newServiceImage");
    const name = nameEl ? nameEl.value.trim() : "";
    if (!name) { alert("اسم الخدمة مطلوب"); return; }
    if (!db) { showToast("Firebase غير متصل"); return; }

    db.collection("office_services").orderBy("order", "desc").limit(1).get().then(function(snap) {
        const nextOrder = snap.empty ? 1 : (snap.docs[0].data().order || 0) + 1;
        return db.collection("office_services").add({
            name: name,
            description: descEl ? descEl.value.trim() : "",
            imageUrl: "",
            order: nextOrder,
            createdAt: Date.now()
        });
    }).then(function(docRef) {
        const file = fileEl && fileEl.files ? fileEl.files[0] : null;
        if (file && storage) {
            const ref = storage.ref().child("office_services/" + docRef.id + "/" + Date.now() + "_" + file.name);
            ref.put(file).then(function() { return ref.getDownloadURL(); })
                .then(function(url) { return db.collection("office_services").doc(docRef.id).set({imageUrl: url}, {merge:true}); })
                .then(function() { finishAddService(); }).catch(function(e) { console.error(e); finishAddService(); });
        } else { finishAddService(); }
    }).catch(function(e) { console.error(e); showToast("خطأ أثناء الإضافة"); });

    function finishAddService() {
        if (nameEl) nameEl.value = "";
        if (descEl) descEl.value = "";
        if (fileEl) fileEl.value = "";
        showToast("تمت إضافة الخدمة");
        loadOfficeServicesAdmin();
    }
};

// =====================================================================
// === صفحة "خدمات المكتب" العامة (services) - عرض ديناميكي ===
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "services" && !document.getElementById("servicesContainerPublic")) return;
    initFirebase();
    loadPublicServices();
});

function loadPublicServices() {
    const container = document.getElementById("servicesContainerPublic");
    if (!container) return;
    if (!db) { container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">تعذر الاتصال بقاعدة البيانات</div>'; return; }

    db.collection("office_services").orderBy("order", "asc").get().then(function(snap) {
        if (snap.empty) { container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">لا توجد خدمات لعرضها حالياً</div>'; return; }
        let html = "";
        let i = 0;
        snap.forEach(function(doc) {
            const d = doc.data();
            const delay = (i * 0.1).toFixed(1);
            html += `<div class="service-card reveal active" style="transition-delay:${delay}s;">
                <div class="icon-wrapper">${d.imageUrl ? `<img src="${d.imageUrl}" alt="${esc(d.name)}">` : '<i class="fa-solid fa-briefcase"></i>'}</div>
                <h3>${esc(d.name)}</h3>
                <p>${esc(d.description)}</p>
            </div>`;
            i++;
        });
        container.innerHTML = html;
    }).catch(function(e) {
        console.error(e);
        container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">تعذر تحميل الخدمات</div>';
    });
}

// =====================================================================
// === صفحة إدارة "المدونة" (admin-blog) ===
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "admin-blog") return;
    initFirebase();
    setupLogout("logoutBtn");
    loadBlogAdmin();

    const addBtn = document.getElementById("addBlogBtn");
    if (addBtn) addBtn.addEventListener("click", addBlogPost);
});

function loadBlogAdmin() {
    const tbody = document.getElementById("blogAdminTbody");
    if (!tbody || !db) return;
    db.collection("blog_posts").orderBy("order", "asc").get().then(function(snap) {
        if (snap.empty) { tbody.innerHTML = '<tr><td colspan="5" style="color:#999;">لا توجد مقالات مضافة</td></tr>'; return; }
        const rows = [];
        snap.forEach(d => rows.push({id: d.id, ...d.data()}));
        renderBlogAdmin(rows);
    }).catch(function(e) { console.error(e); tbody.innerHTML = '<tr><td colspan="5" style="color:red;">تعذر التحميل</td></tr>'; });
}

function renderBlogAdmin(rows) {
    const tbody = document.getElementById("blogAdminTbody");
    let html = "";
    rows.forEach(function(row, idx) {
        html += `<tr>
            <td>${idx+1}</td>
            <td><input type="text" value="${esc(row.name)}" data-id="${row.id}" data-field="name" class="blog-field-input" style="width:100%;border:1px solid #ddd;border-radius:6px;padding:6px;"></td>
            <td><input type="text" value="${esc(row.description)}" data-id="${row.id}" data-field="description" class="blog-field-input" style="width:100%;border:1px solid #ddd;border-radius:6px;padding:6px;"></td>
            <td><input type="text" value="${esc(row.link)}" data-id="${row.id}" data-field="link" class="blog-field-input" dir="ltr" style="width:100%;border:1px solid #ddd;border-radius:6px;padding:6px;"></td>
            <td><button class="decl-delete-btn blog-delete" data-id="${row.id}"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`;
    });
    tbody.innerHTML = html;

    tbody.querySelectorAll(".blog-field-input").forEach(function(el) {
        el.addEventListener("blur", function() {
            db.collection("blog_posts").doc(el.dataset.id).set({[el.dataset.field]: el.value}, {merge:true})
                .then(function() { showToast(); flashEl(el); }).catch(console.error);
        });
    });
    tbody.querySelectorAll(".blog-delete").forEach(function(btn) {
        btn.addEventListener("click", function() {
            if (!confirm("حذف هذا المقال نهائياً؟")) return;
            db.collection("blog_posts").doc(btn.dataset.id).delete()
                .then(function() { showToast("تم الحذف"); loadBlogAdmin(); }).catch(console.error);
        });
    });
}

window.addBlogPost = function() {
    const nameEl = document.getElementById("newBlogName");
    const descEl = document.getElementById("newBlogDesc");
    const linkEl = document.getElementById("newBlogLink");
    const name = nameEl ? nameEl.value.trim() : "";
    if (!name) { alert("اسم المقال مطلوب"); return; }
    if (!db) { showToast("Firebase غير متصل"); return; }

    db.collection("blog_posts").orderBy("order", "desc").limit(1).get().then(function(snap) {
        const nextOrder = snap.empty ? 1 : (snap.docs[0].data().order || 0) + 1;
        return db.collection("blog_posts").add({
            name: name,
            description: descEl ? descEl.value.trim() : "",
            link: linkEl ? linkEl.value.trim() : "",
            order: nextOrder,
            createdAt: Date.now()
        });
    }).then(function() {
        if (nameEl) nameEl.value = "";
        if (descEl) descEl.value = "";
        if (linkEl) linkEl.value = "";
        showToast("تمت الإضافة");
        loadBlogAdmin();
    }).catch(function(e) { console.error(e); showToast("خطأ أثناء الإضافة"); });
};

// =====================================================================
// === صفحة "المدونة" العامة (blog) - عرض ديناميكي ===
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "blog" && !document.getElementById("blogContainerPublic")) return;
    initFirebase();
    loadPublicBlog();
});

function loadPublicBlog() {
    const container = document.getElementById("blogContainerPublic");
    if (!container) return;
    if (!db) { container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">تعذر الاتصال بقاعدة البيانات</div>'; return; }

    db.collection("blog_posts").orderBy("order", "asc").get().then(function(snap) {
        if (snap.empty) { container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">لا توجد مقالات لعرضها حالياً</div>'; return; }
        let html = "";
        let i = 0;
        snap.forEach(function(doc) {
            const d = doc.data();
            const delay = (i * 0.1).toFixed(1);
            const hasLink = d.link && d.link.trim();
            const tag = hasLink ? "a" : "div";
            const attrs = hasLink ? `href="${esc(d.link)}" target="_blank" rel="noreferrer"` : "";
            html += `<${tag} ${attrs} class="service-card reveal active" style="transition-delay:${delay}s;text-decoration:none;display:block;">
                <div class="icon-wrapper"><i class="fa-solid fa-newspaper"></i></div>
                <h3>${esc(d.name)}</h3>
                <p>${esc(d.description)}</p>
            </${tag}>`;
            i++;
        });
        container.innerHTML = html;
    }).catch(function(e) {
        console.error(e);
        container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">تعذر تحميل المقالات</div>';
    });
}

// =====================================================================
// === رسائل "تواصل معنا" (contact) وصفحة "الأسئلة" الإدارية ===
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    initFirebase();
    form.addEventListener("submit", function() {
        if (!db) return;
        const nameEl = document.getElementById("name");
        const phoneEl = document.getElementById("phone");
        const msgEl = document.getElementById("message");
        const name = nameEl ? nameEl.value.trim() : "";
        const phone = phoneEl ? phoneEl.value.trim() : "";
        const message = msgEl ? msgEl.value.trim() : "";
        if (!name && !phone && !message) return;
        db.collection("contact_messages").add({
            name: name, phone: phone, message: message, createdAt: Date.now()
        }).catch(console.error);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "admin-faq") return;
    initFirebase();
    setupLogout("logoutBtn");
    loadContactMessages();
});

function loadContactMessages() {
    const tbody = document.getElementById("faqTbody");
    if (!tbody || !db) return;
    db.collection("contact_messages").orderBy("createdAt", "desc").get().then(function(snap) {
        if (snap.empty) { tbody.innerHTML = '<tr><td colspan="5" style="color:#999;">لا توجد رسائل حتى الآن</td></tr>'; return; }
        let html = "";
        snap.forEach(function(doc) {
            const d = doc.data();
            const dateStr = new Date(d.createdAt).toLocaleString("ar-EG");
            html += `<tr>
                <td><strong>${esc(d.name)}</strong></td>
                <td dir="ltr">${esc(d.phone)}</td>
                <td style="max-width:320px;white-space:pre-wrap;">${esc(d.message)}</td>
                <td style="direction:ltr;">${dateStr}</td>
                <td><button class="decl-delete-btn faq-delete" data-id="${doc.id}" title="حذف"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`;
        });
        tbody.innerHTML = html;
        tbody.querySelectorAll(".faq-delete").forEach(function(btn) {
            btn.addEventListener("click", function() {
                if (!confirm("حذف هذه الرسالة؟")) return;
                db.collection("contact_messages").doc(btn.dataset.id).delete()
                    .then(function() { showToast("تم الحذف"); loadContactMessages(); }).catch(console.error);
            });
        });
    }).catch(function(e) { console.error(e); tbody.innerHTML = '<tr><td colspan="5" style="color:red;">تعذر تحميل الرسائل</td></tr>'; });
}

// =====================================================================
// === إظهار كروت لوحة التحكم الرئيسية حسب صلاحيات المستخدم فقط ===
// =====================================================================
document.addEventListener("DOMContentLoaded", async function() {
    if (currentPage !== "admin-home") return;
    const session = await window.ELERYAN_SESSION_READY;
    if (!session || session.role === "admin") return; // الحساب الرئيسي يشوف كل حاجة

    const userPermissions = session.permissions || [];
    document.querySelectorAll(".admin-home-card[data-permission]").forEach(function(card) {
        const perm = card.dataset.permission;
        if (perm !== "all" && !userPermissions.includes(perm)) {
            card.style.display = "none";
        }
    });
});

// =====================================================================
// === نقطة تنبيه على كارت "الأسئلة" لما توصل رسالة جديدة من "تواصل معنا" ===
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "admin-home") return;
    initFirebase();
    const card = document.querySelector('.admin-home-card[data-permission="faq"]');
    if (!card || !db) return;
    db.collection("contact_messages").limit(1).get().then(function(snap) {
        if (!snap.empty) {
            card.classList.add("has-notification");
        }
    }).catch(console.error);
});
