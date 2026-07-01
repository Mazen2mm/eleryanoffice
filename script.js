// ===== Navbar Scroll =====
window.addEventListener('scroll', () => {
    const header = document.getElementById('navbar');
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Reveal on Scroll =====
function reveal() {
    document.querySelectorAll(".reveal").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });
}
window.addEventListener("scroll", reveal);
reveal();

// ===== Sidebar =====
document.addEventListener('DOMContentLoaded', function () {

    var hamburger = document.getElementById('hamburger');
    var sidebar   = document.getElementById('sidebar');
    var overlay   = document.getElementById('sidebarOverlay');
    var closeBtn  = document.getElementById('sidebarClose');

    function openSidebar() {
        sidebar.style.right = '0';
        overlay.style.display = 'block';
        setTimeout(function(){ overlay.style.opacity = '1'; }, 10);
        document.body.style.overflow = 'hidden';
        hamburger.classList.add('active');
    }

    function closeSidebar() {
        sidebar.style.right = '-300px';
        overlay.style.opacity = '0';
        setTimeout(function(){ overlay.style.display = 'none'; }, 300);
        document.body.style.overflow = '';
        hamburger.classList.remove('active');
    }

    if (hamburger) hamburger.addEventListener('click', openSidebar);
    if (closeBtn)  closeBtn.addEventListener('click', closeSidebar);
    if (overlay)   overlay.addEventListener('click', closeSidebar);

    document.querySelectorAll('.sidebar a').forEach(function(link) {
        link.addEventListener('click', closeSidebar);
    });

    // ===== Contact Form =====
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = this.querySelector('button');
            var orig = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
            btn.style.opacity = '0.8';
            setTimeout(function() {
                btn.innerHTML = orig;
                btn.style.opacity = '1';
                form.reset();
                var toast = document.getElementById('toastMessage');
                if (toast) {
                    toast.classList.add('show');
                    setTimeout(function(){ toast.classList.remove('show'); }, 3000);
                }
            }, 1500);
        });
    }

});
