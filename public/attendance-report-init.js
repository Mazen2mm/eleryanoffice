
        initFirebase();

        // وضعنا كود جلب البيانات في دالة لسهولة تحديث الجدول بعد الحذف
        function loadAttendance() {
            if(!db) return;
            const tbody = document.getElementById("attendanceTbody");
            tbody.innerHTML = '<tr><td colspan="5" style="color: #999;">جاري تحميل سجل الحضور...</td></tr>';
            
            db.collection("attendance").orderBy("timestamp", "desc").get().then(snap => {
                let html = "";
                if(snap.empty) {
                    tbody.innerHTML = '<tr><td colspan="5">لا توجد سجلات حضور حتى الآن</td></tr>';
                    return;
                }
                snap.forEach(doc => {
                    const data = doc.data();
                    const badgeColor = data.type === "حضور" ? "background:#e3f7e9; color:#1e8449;" : "background:#fdecea; color:#c0392b;";
                    html += `<tr>
                        <td><strong>${data.username}</strong></td>
                        <td><span class="status-chip" style="${badgeColor} padding: 5px 12px; border-radius: 4px;">${data.type}</span></td>
                        <td style="direction: ltr;">${data.date}</td>
                        <td style="direction: ltr;">${data.time}</td>
                        <td>
                            <button class="decl-delete-btn" onclick="deleteRecord('${doc.id}')" title="حذف هذا السجل">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>`;
                });
                tbody.innerHTML = html;
            }).catch(err => {
                console.error(err);
                tbody.innerHTML = '<tr><td colspan="5" style="color:red;">خطأ أثناء تحميل البيانات</td></tr>';
            });
        }

        // دالة مسح السجل
        window.deleteRecord = function(docId) {
            if(!confirm("هل أنت متأكد من رغبتك في حذف هذا السجل نهائياً؟")) return;
            
            if(db) {
                db.collection("attendance").doc(docId).delete().then(() => {
                    showToast("تم حذف السجل بنجاح");
                    loadAttendance(); // تحديث الجدول فوراً
                }).catch(err => {
                    console.error("خطأ في الحذف:", err);
                    alert("تعذر حذف السجل، تأكد من اتصالك بالإنترنت.");
                });
            }
        };

        // تشغيل الدالة فور فتح الصفحة
        loadAttendance();
    