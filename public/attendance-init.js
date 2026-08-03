
(async function() {
    initFirebase();
    const session = await window.ELERYAN_SESSION_READY;
    const username = session ? session.username : null;
    document.getElementById("userInfo").textContent = "الموظف الحالي: " + (username || "غير معروف");

    function logAttendance(type) {
        if (!db) return;
        const now = new Date();
        const dateStr = now.toLocaleDateString('zh-Hans-CN'); // YYYY/MM/DD لتسهيل الترتيب
        const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        db.collection("attendance").add({
            username: username,
            type: type,
            date: dateStr,
            time: timeStr,
            timestamp: Date.now()
        }).then(() => {
            const msgEl = document.getElementById("attendanceMsg");
            msgEl.textContent = `تم تسجيل ${type} بنجاح الساعة ${timeStr}`;
            msgEl.style.color = type === "حضور" ? "#2ecc71" : "#e74c3c";
        }).catch(console.error);
    }

    document.getElementById("btnCheckIn").addEventListener("click", () => logAttendance("حضور"));
    document.getElementById("btnCheckOut").addEventListener("click", () => logAttendance("انصراف"));
})();
