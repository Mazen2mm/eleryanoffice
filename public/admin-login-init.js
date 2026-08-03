
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var u = document.getElementById('username').value.trim();
    var p = document.getElementById('password').value.trim();
    var errorEl = document.getElementById('loginError');
    var btn = document.querySelector('.admin-login-btn');

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        // التحقق من اسم المستخدم وكلمة المرور بيحصل دلوقتي على السيرفر فقط
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p }),
        });
        const data = await res.json();

        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span>دخول</span>';
        btn.disabled = false;

        if (data.ok) {
            // مرآة عرض فقط (الحماية الحقيقية في الكوكي الآمن اللي السيرفر ظبطه)
            sessionStorage.setItem('eleryan_user_logged_in', data.username);
            sessionStorage.setItem('eleryan_user_role', data.role);
            sessionStorage.setItem('eleryan_user_permissions', JSON.stringify(data.permissions || []));
            window.location.href = 'admin-home';
        } else {
            errorEl.textContent = data.message || 'اسم المستخدم أو كلمة المرور غير صحيحة';
            btn.style.animation = 'none';
            void btn.offsetWidth;
            btn.style.animation = 'shake 0.4s';
        }
    } catch (err) {
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span>دخول</span>';
        btn.disabled = false;
        errorEl.textContent = 'تعذر الاتصال بالسيرفر، حاول تاني';
    }
});
