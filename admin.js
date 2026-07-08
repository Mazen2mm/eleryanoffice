// =====================================================================
// الحساب الرئيسي الثابت (لا يُحذف أبداً)
// ملحوظة: كلمة المرور مخزنة هنا كـ SHA-256 hash مش نص صريح.
// =====================================================================
const ADMIN_CREDENTIALS = {
    username: "eleryanofficeteam",
    passwordHash: "15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225"
};

// دالة تشفير كلمة المرور بطريقة SHA-256 (one-way hash)
// أي كلمة مرور بتتحفظ أو تتقارن بتعدي على الدالة دي الأول
async function hashPassword(password) {
    const enc = new TextEncoder().encode(password);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

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
function initFirebase() {
    if (typeof firebase === "undefined") return false;
    try {
        if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        return true;
    } catch(e){ console.error(e); return false; }
}

// =====================================================================
// حماية صفحات الأدمن والصلاحيات
// =====================================================================
const PROTECTED_PAGES = {
    "admin-home.html": "all", 
    "admin-dashboard.html": "declarations",
    "admin-clients.html": "clients",
    "admin-companies.html": "companies",
    "admin-users.html": "users",
    "attendance.html": "attendance_click",
    "attendance-report.html": "attendance_report",
    "e-invoice.html": "einvoice" // تم ربط صفحة الأتمتة بصلاحية الفاتورة الإلكترونية
};

const currentPage = window.location.pathname.split("/").pop();

if (PROTECTED_PAGES[currentPage]) {
    const loggedInUser = sessionStorage.getItem("eleryan_user_logged_in");
    const userRole = sessionStorage.getItem("eleryan_user_role"); // "admin" أو "user"
    const userPermissions = JSON.parse(sessionStorage.getItem("eleryan_user_permissions") || "[]");

    if (!loggedInUser) {
        window.location.href = "admin-login.html";
    } else if (userRole !== "admin") {
        // التحقق من الصلاحيات للمستخدمين العاديين
        const requiredPermission = PROTECTED_PAGES[currentPage];
        if (requiredPermission !== "all" && !userPermissions.includes(requiredPermission)) {
            // توجيه لصفحة عدم الصلاحية بدلاً من رسالة Alert
            window.location.href = "no-permission.html";
        }
    }
}

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
    if (b) b.addEventListener("click", function() {
        sessionStorage.clear(); // تفريغ الجلسة بالكامل
        window.location.href = "admin-login.html";
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
    if (pageName !== "admin-dashboard.html") return;

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
    if (currentPage !== "admin-companies.html") return;
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
    {value:"einvoice",          label:"الفاتورة الإلكترونية"}
];

function permLabel(value) {
    const found = PERMISSIONS_LIST.find(p => p.value === value);
    return found ? found.label : value;
}

document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "admin-users.html") return;
    initFirebase();
    setupLogout("logoutBtn");
    loadUsers();

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
    saveBtn.addEventListener("click", function() {
        if (!currentEditUserId || !db) { closeEditUserModal(); return; }
        const checkboxes = document.querySelectorAll('input[name="editPermission"]:checked');
        const permissions = Array.from(checkboxes).map(cb => cb.value);
        db.collection("admin_users").doc(currentEditUserId).update({ permissions: permissions })
            .then(function() {
                showToast("تم تحديث الصلاحيات");
                closeEditUserModal();
                loadUsers();
            })
            .catch(function(e) {
                console.error(e);
                showToast("خطأ أثناء حفظ الصلاحيات");
            });
    });
});

function loadUsers() {
    const grid = document.getElementById("usersGrid");
    if (!grid) return;

    let html = `<div class="user-card main-account">
        <div class="user-icon"><i class="fa-solid fa-crown"></i></div>
        <div class="user-info">
            <strong>${ADMIN_CREDENTIALS.username}</strong>
            <span>الحساب الرئيسي (لا يمكن حذفه)</span>
        </div>
    </div>`;

    if (db) {
        db.collection("admin_users").orderBy("createdAt","asc").get()
            .then(function(snap) {
                snap.forEach(function(doc) {
                    const u = doc.data();
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
                            <button class="edit-user-btn" data-id="${doc.id}" data-username="${esc(u.username)}" data-perms='${permsAttr}' title="تعديل الصلاحيات">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="delete-user-btn" data-id="${doc.id}" title="حذف">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>`;
                });
                grid.innerHTML = html;
                grid.querySelectorAll(".delete-user-btn").forEach(function(btn) {
                    btn.addEventListener("click", function() {
                        if (!confirm("حذف هذا المستخدم؟")) return;
                        db.collection("admin_users").doc(btn.dataset.id).delete()
                            .then(function() { showToast("تم الحذف"); loadUsers(); }).catch(console.error);
                    });
                });
                grid.querySelectorAll(".edit-user-btn").forEach(function(btn) {
                    btn.addEventListener("click", function() {
                        openEditUserModal(btn.dataset.id, btn.dataset.username, btn.dataset.perms);
                    });
                });
            }).catch(function(e) {
                console.error(e);
                grid.innerHTML = html + '<div style="padding:20px;color:red;">تعذر تحميل المستخدمين</div>';
            });
    } else {
        grid.innerHTML = html + '<div style="padding:20px;color:#888;">Firebase غير متصل</div>';
    }
}

window.addUser = async function() {
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    
    const checkboxes = document.querySelectorAll('input[name="permission"]:checked');
    const permissions = Array.from(checkboxes).map(cb => cb.value);

    if (!username || !password) { alert("يجب إدخال اسم المستخدم وكلمة المرور"); return; }
    if (username === ADMIN_CREDENTIALS.username) { alert("اسم المستخدم محجوز"); return; }
    if (!db) { showToast("Firebase غير متصل"); return; }

    const passwordHash = await hashPassword(password);

    db.collection("admin_users").add({
        username, 
        passwordHash, 
        permissions, 
        createdAt: Date.now()
    }).then(function() {
        document.getElementById("newUsername").value = "";
        document.getElementById("newPassword").value = "";
        document.querySelectorAll('input[name="permission"]').forEach(cb => cb.checked = false);
        showToast("تمت إضافة المستخدم");
        loadUsers();
    }).catch(console.error);
};

window.verifyLogin = async function(username, password, callback) {
    const passwordHash = await hashPassword(password);

    if (username === ADMIN_CREDENTIALS.username && passwordHash === ADMIN_CREDENTIALS.passwordHash) {
        callback({ role: "admin", permissions: [] }); 
        return;
    }
    if (!db) { callback(false, "قاعدة البيانات غير متصلة"); return; }
    
    db.collection("admin_users")
        .where("username", "==", username)
        .where("passwordHash", "==", passwordHash)
        .get()
        .then(function(snap) { 
            if(!snap.empty) {
                callback({ role: "user", permissions: snap.docs[0].data().permissions || [] });
            } else {
                callback(false, "اسم المستخدم أو كلمة المرور غير صحيحة");
            }
        })
        .catch(function(error) { 
            console.error("Firebase Login Error: ", error);
            callback(false, "حدث خطأ أثناء الاتصال بقاعدة البيانات. (راجع الـ Console)"); 
        });
};

// =====================================================================
// === باقي الأكواد القديمة المتعلقة بالعملاء (admin-clients.html) ===
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
    if (currentPage !== "admin-clients.html") return;
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
// === صفحة عملائنا العامة (clients.html) - عرض الشركات في الماركيه ===
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "clients.html") return;
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
// === صفحة أتمتة الفواتير (e-invoice.html) ===
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    if (currentPage !== "e-invoice.html") return;

    const githubUser = "Mazen2mm"; 
    const githubRepo = "eleryanoffice";        
    const folderPath = "E-invoice";            

    const selectEl = document.getElementById("companySelect");
    const loadingMsg = document.getElementById("loadingMsg");
    const startBtn = document.getElementById("startBtn");

    if (!selectEl || !startBtn) return; // التأكد من وجود العناصر بالصفحة

    async function fetchFilesFromGitHub() {
        loadingMsg.style.display = "block";
        startBtn.disabled = true;
        startBtn.style.opacity = "0.5";

        let apiUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/${folderPath}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("لم يتم العثور على الملفات");
            
            const data = await response.json();

            data.forEach(item => {
                if (item.type === "file") {
                    let option = document.createElement("option");
                    let cleanName = item.name.replace(".txt", "").replace(".ahk", "");
                    
                    option.value = cleanName; 
                    option.text = cleanName;  
                    option.style.background = "#0a192f";
                    option.style.color = "#fff";
                    selectEl.appendChild(option);
                }
            });
            
            loadingMsg.style.display = "none";
            startBtn.disabled = false;
            startBtn.style.opacity = "1";

        } catch (error) {
            console.error(error);
            loadingMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> تأكد من رفع الملفات في مجلد E-invoice على جيت هاب';
            loadingMsg.style.color = "#e74c3c"; 
        }
    }

    fetchFilesFromGitHub();

    startBtn.addEventListener("click", function() {
        const branch = selectEl.value;
        if (!branch) {
            selectEl.style.borderColor = "#e74c3c";
            setTimeout(() => selectEl.style.borderColor = "rgba(212, 175, 55, 0.4)", 2000);
            return;
        }

        const originalText = startBtn.innerHTML;
        startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري البدء...';
        
        window.location.href = `mycompany://run?branch=${branch}`;

        setTimeout(() => {
            startBtn.innerHTML = originalText;
        }, 3000);
    });
});
