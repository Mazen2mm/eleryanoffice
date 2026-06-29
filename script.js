window.addEventListener('scroll', () => {
    const header = document.getElementById('navbar');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
reveal();

// ===== القائمة الجانبية =====
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
    hamburger && hamburger.classList.add('active');
    sidebar && sidebar.classList.add('active');
    overlay && overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    hamburger && hamburger.classList.remove('active');
    sidebar && sidebar.classList.remove('active');
    overlay && overlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger && hamburger.addEventListener('click', openSidebar);
sidebarClose && sidebarClose.addEventListener('click', closeSidebar);
overlay && overlay.addEventListener('click', closeSidebar);

// إغلاق القائمة عند الضغط على أي رابط فيها
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', closeSidebar);
});

// ===== نموذج التواصل =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
        btn.style.opacity = '0.8';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            this.reset();
            
            const toast = document.getElementById('toastMessage');
            if (toast) {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }
        }, 1500);
    });
}