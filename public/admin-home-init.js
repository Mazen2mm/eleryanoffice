
document.addEventListener("DOMContentLoaded", async function() {
    // إظهار اسم المستخدم بجوار الترحيب (بعد التحقق من الجلسة على السيرفر)
    const session = await window.ELERYAN_SESSION_READY;
    if (session) {
        document.getElementById("welcomeTitle").textContent = "مرحباً بك يا " + session.username;
    }
});

document.getElementById('logoutBtn').addEventListener('click', async function () {
    try { await fetch('/api/logout', { method: 'POST' }); } catch (e) {}
    sessionStorage.clear();
    window.location.href = 'admin-login';
});
