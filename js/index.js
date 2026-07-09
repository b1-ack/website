const langOrder = ['en', 'ru', 'de', 'fr', 'ge'];

function getCurrentLang() {
    const path = window.location.pathname;
    const parts = path.split('/');
    for (const part of parts) {
        if (langOrder.includes(part)) return part;
    }
    return 'en';
}

function getPageName() {
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1] || 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const navMoreToggle = document.getElementById('nav-more-toggle');
    const navMoreMenu = document.getElementById('nav-more-menu');
    const themeIcon = document.getElementById('theme-icon');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }

    function positionPopup() {
        const homeLink = document.querySelector('.nav-link.active');
        if (!navMoreMenu || !homeLink || !navMoreToggle) return;
        const homeRect = homeLink.getBoundingClientRect();
        const toggleRect = navMoreToggle.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
            navMoreMenu.style.left = (homeRect.left - 4) + 'px';
            navMoreMenu.style.width = (toggleRect.right - homeRect.left + 8) + 'px';
        } else {
            navMoreMenu.style.left = '';
            navMoreMenu.style.width = '';
        }
    }

    if (navMoreToggle && navMoreMenu) {
        navMoreToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMoreToggle.classList.toggle('active');
            navMoreMenu.classList.toggle('active');
            if (navMoreMenu.classList.contains('active')) {
                positionPopup();
            }
        });

        document.addEventListener('click', () => {
            navMoreToggle.classList.remove('active');
            navMoreMenu.classList.remove('active');
        });

        window.addEventListener('resize', positionPopup);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
            localStorage.setItem('theme', next);
        });
    }

    const langBtn = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-dropdown-menu');
    const langIcon = document.getElementById('lang-icon');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            langMenu.classList.remove('active');
        });

        const currentLang = getCurrentLang();
        langMenu.querySelectorAll('.lang-dropdown-item').forEach(item => {
            if (item.dataset.lang === currentLang) {
                item.classList.add('active');
            }
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = item.dataset.lang;
                const page = getPageName();
                localStorage.setItem('b1ack-lang', lang);
                window.location.href = `../${lang}/${page}` + window.location.hash;
            });
        });
    }

    document.querySelectorAll('.nav-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const parts = btn.getAttribute('href').split('/');
            for (const part of parts) {
                const clean = part.replace('.html', '');
                if (langOrder.includes(clean)) {
                    localStorage.setItem('b1ack-lang', clean);
                    break;
                }
            }
        });
    });

    if (!localStorage.getItem('cookie-consent')) {
        const el = document.getElementById('cookie-consent');
        if (el) {
            setTimeout(() => el.classList.add('show'), 500);
        }
    }
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.src = theme === 'dark' ? '../img/icons/dark.png' : '../img/icons/light.png';
    }
}

function acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted');
    const el = document.getElementById('cookie-consent');
    if (el) {
        el.classList.remove('show');
        setTimeout(() => { el.style.display = 'none'; }, 500);
    }
}

(function() {
    const key = 'page_refresh_count';
    const limit = 5;
    const windowMs = 60000;

    const now = Date.now();
    let refreshData = JSON.parse(localStorage.getItem(key) || '[]');

    refreshData = refreshData.filter(t => now - t < windowMs);
    refreshData.push(now);

    localStorage.setItem(key, JSON.stringify(refreshData));

    if (refreshData.length > limit) {
        localStorage.setItem(key, '[]');
        const lang = getCurrentLang();
        window.location.href = `../${lang}/survive.html`;
    }
})();
