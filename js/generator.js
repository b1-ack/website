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

const ruFirstNamesMale = ['Александр', 'Дмитрий', 'Михаил', 'Иван', 'Сергей', 'Андрей', 'Владимир', 'Николай', 'Евгений', 'Павел', 'Роман', 'Антон', 'Олег', 'Денис', 'Игорь', 'Макар', 'Лев', 'Даниил', 'Кирилл', 'Марк', 'Максим', 'Артем', 'Алексей', 'Юрий'];
const ruFirstNamesFemale = ['Анна', 'Елена', 'Мария', 'Наталья', 'Ольга', 'Светлана', 'Ирина', 'Екатерина', 'Татьяна', 'Алена', 'Дарья', 'Полина', 'Юлия', 'Алина', 'Виктория', 'Ксения', 'Милана', 'Софья', 'Варвара', 'Ева', 'Ирина', 'Людмила', 'Надежда'];
const ruLastNamesMale = ['Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Соколов', 'Михайлов', 'Фёдоров', 'Яковлев', 'Комаров', 'Орлов', 'Киселев', 'Макаров', 'Новиков', 'Морозов', 'Волков', 'Зайцев', 'Павлов', 'Семёнов', 'Голубев', 'Борисов'];
const ruLastNamesFemale = ['Иванова', 'Петрова', 'Сидорова', 'Смирнова', 'Кузнецова', 'Попова', 'Васильева', 'Соколова', 'Михайлова', 'Фёдорова', 'Яковлева', 'Комарова', 'Орлова', 'Киселева', 'Макарова', 'Новикова', 'Морозова', 'Волкова', 'Зайцева', 'Павлова', 'Семёнова', 'Голубева', 'Борисова'];
const enFirstNamesMale = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George'];
const enFirstNamesFemale = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Dorothy', 'Carol', 'Amanda'];
const enLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson'];
const enMiddleNames = ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret'];

const osList = {
    'Windows': { ua: 'Windows NT 10.0; Win64; x64', versions: ['10.0', '11.0'] },
    'macOS': { ua: 'Macintosh; Intel Mac OS X', versions: ['14_0', '13_0', '12_0', '11_0'] },
    'Linux': { ua: 'Linux x86_64', versions: [''] },
    'Android': { ua: 'Linux; Android', versions: ['14', '13', '12', '11'] },
    'iOS': { ua: 'iPhone; CPU iPhone OS', versions: ['17_0', '16_0', '15_0'] }
};

const browsers = { 'Chrome': { name: 'Chrome' }, 'Firefox': { name: 'Firefox' }, 'Safari': { name: 'Safari' }, 'Edge': { name: 'Edg' }, 'Opera': { name: 'OPR' } };
const cardTypes = { 'Visa': { prefix: '4', length: 16 }, 'MasterCard': { prefix: '5', length: 16 }, 'PayPal': { prefix: '4024', length: 16 } };

let currentGender = 'male';
let currentCardType = 'Visa';
let passwordOptions = { uppercase: true, lowercase: true, digits: true, special: true, ascii: false };
let usernameUseNumbers = false;

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const themeIcon = document.getElementById('theme-icon');
    const navMoreToggle = document.getElementById('nav-more-toggle');
    const navMoreMenu = document.getElementById('nav-more-menu');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => nav.classList.toggle('active'));
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) nav.classList.remove('active');
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
            localStorage.setItem('theme', next);
        });
    }


    function positionPopup() {
        const homeLink = document.querySelector('.nav > .nav-link');
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

    const langBtn = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-dropdown-menu');

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
                window.location.href = `../${lang}/${page}`;
            });
        });
    }

    if (!localStorage.getItem('cookie-consent')) {
        const el = document.getElementById('cookie-consent');
        if (el) setTimeout(() => el.classList.add('show'), 500);
    }

    generatePassword();
    generateUUID();
    generateMAC();
    generateUA();
    generatePerson();
    generateUsername();
    generateDOB();
    generateCard();

    const pl = document.getElementById('password-length');
    if (pl) pl.addEventListener('input', generatePassword);
    const ul = document.getElementById('username-length');
    if (ul) ul.addEventListener('input', generateUsername);
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.src = theme === 'dark' ? '../img/icons/dark.png' : '../img/icons/light.png';
}

function togglePasswordOption(option) {
    passwordOptions[option] = !passwordOptions[option];
    const el = document.getElementById('password-' + option);
    if (el) el.classList.toggle('active', passwordOptions[option]);
    generatePassword();
}

function generatePassword() {
    const length = parseInt(document.getElementById('password-length')?.value) || 16;
    let chars = '';
    if (passwordOptions.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (passwordOptions.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (passwordOptions.digits) chars += '0123456789';
    if (passwordOptions.special) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (passwordOptions.ascii) chars += '¡¢£¤¥¦§¨©ª«¬®¯°±²³µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏ';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
    let password = '';
    for (let i = 0; i < length; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    const el = document.getElementById('password-result');
    if (el) el.textContent = password;
}

function generateUUID() {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    const el = document.getElementById('uuid-result');
    if (el) el.textContent = uuid;
}

function generateMAC() {
    const hexDigits = '0123456789ABCDEF';
    let mac = '';
    for (let i = 0; i < 6; i++) {
        if (i > 0) mac += ':';
        mac += hexDigits.charAt(Math.floor(Math.random() * 16));
        mac += hexDigits.charAt(Math.floor(Math.random() * 16));
    }
    const el = document.getElementById('mac-result');
    if (el) el.textContent = mac;
}

function generateUA() {
    const osSelect = document.getElementById('ua-os');
    const browserSelect = document.getElementById('ua-browser');
    let os = osSelect?.value || 'random';
    let browser = browserSelect?.value || 'random';
    if (os === 'random') { const keys = Object.keys(osList); os = keys[Math.floor(Math.random() * keys.length)]; }
    if (browser === 'random') { const keys = Object.keys(browsers); browser = keys[Math.floor(Math.random() * keys.length)]; }
    const osData = osList[os];
    const browserData = browsers[browser];
    const osVersion = osData.versions[Math.floor(Math.random() * osData.versions.length)];
    const browserVersion = Math.floor(Math.random() * 30) + 100;

    let ua;
    if (os === 'Linux') {
        ua = 'Mozilla/5.0 (' + osData.ua + ') AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    } else if (browser === 'Firefox') {
        ua = 'Mozilla/5.0 (' + osData.ua + (osVersion ? ' ' + osVersion : '') + '; rv:109.0) Gecko/20100101 Firefox/' + browserVersion + '.0';
    } else if (browser === 'Safari') {
        const mobileVersion = os === 'iOS' ? osVersion : '15E148';
        ua = 'Mozilla/5.0 (' + osData.ua + ' ' + osVersion + ') AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/' + mobileVersion + ' Safari/604.1';
    } else if (browser === 'Edge' || browser === 'Opera') {
        ua = 'Mozilla/5.0 (' + osData.ua + (osVersion ? ' ' + osVersion : '') + ') AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ' + browserData.name + '/' + browserVersion + '.0.0.0';
    } else {
        ua = 'Mozilla/5.0 (' + osData.ua + (osVersion ? ' ' + osVersion : '') + ') AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    }
    const el = document.getElementById('ua-result');
    if (el) el.textContent = ua;
}

function generatePerson() {
    const gender = currentGender || 'male';
    let firstNames, lastNames;
    const currentLang = getCurrentLang();
    if (currentLang === 'ru') {
        firstNames = gender === 'male' ? ruFirstNamesMale : ruFirstNamesFemale;
        lastNames = gender === 'male' ? ruLastNamesMale : ruLastNamesFemale;
    } else {
        firstNames = gender === 'male' ? enFirstNamesMale : enFirstNamesFemale;
        lastNames = enLastNames;
    }
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const el = document.getElementById('person-result');
    if (!el) return;

    if (currentLang === 'ru') {
        const malePatronymics = ['Александрович', 'Дмитриевич', 'Михайлович', 'Иванович', 'Сергеевич', 'Владимирович', 'Николаевич'];
        const femalePatronymics = ['Александровна', 'Дмитриевна', 'Михайловна', 'Ивановна', 'Сергеевна', 'Владимировна', 'Николаевна'];
        const patronymic = gender === 'male' ? malePatronymics[Math.floor(Math.random() * malePatronymics.length)] : femalePatronymics[Math.floor(Math.random() * femalePatronymics.length)];
        el.textContent = lastName + ' ' + firstName + ' ' + patronymic;
    } else {
        const middleName = enMiddleNames[Math.floor(Math.random() * enMiddleNames.length)];
        el.textContent = firstName + ' ' + middleName + ' ' + lastName;
    }
}

function setGender(gender) {
    currentGender = gender;
    const m = document.getElementById('gender-male');
    const f = document.getElementById('gender-female');
    if (m) m.classList.toggle('active', gender === 'male');
    if (f) f.classList.toggle('active', gender === 'female');
    generatePerson();
}

function setCardType(type) {
    currentCardType = type;
    ['visa', 'mastercard', 'paypal'].forEach(id => {
        const el = document.getElementById('card-' + id);
        if (el) el.classList.toggle('active', (id === 'visa' && type === 'Visa') || (id === 'mastercard' && type === 'MasterCard') || (id === 'paypal' && type === 'PayPal'));
    });
    generateCard();
}

function generateUsername() {
    const length = parseInt(document.getElementById('username-length')?.value) || 10;
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    let username = '';
    for (let i = 0; i < length; i++) username += chars.charAt(Math.floor(Math.random() * chars.length));
    username = username.charAt(0).toUpperCase() + username.slice(1);
    if (usernameUseNumbers) username += Math.floor(Math.random() * 999);
    const el = document.getElementById('username-result');
    if (el) el.textContent = username;
}

function toggleUsernameNumbers() {
    usernameUseNumbers = !usernameUseNumbers;
    const el = document.getElementById('username-numbers');
    if (el) el.classList.toggle('active', usernameUseNumbers);
    generateUsername();
}

function generateDOB() {
    const year = Math.floor(Math.random() * 40) + 1980;
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const el = document.getElementById('dob-result');
    if (el) el.textContent = day + '.' + month + '.' + year;
}

function generateCard() {
    const cardData = cardTypes[currentCardType];
    let cardNumber = cardData.prefix;
    for (let i = cardData.prefix.length; i < cardData.length - 1; i++) cardNumber += Math.floor(Math.random() * 10);
    let sum = 0;
    let isSecond = true;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        if (isSecond) { digit *= 2; if (digit > 9) digit -= 9; }
        sum += digit;
        isSecond = !isSecond;
    }
    cardNumber += (10 - (sum % 10)) % 10;
    const formatted = cardNumber.match(/.{1,4}/g).join(' ');
    const el = document.getElementById('card-result');
    if (el) el.textContent = currentCardType + ': ' + formatted;
}

function copyToClipboard(elementId, button) {
    const text = document.getElementById(elementId)?.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const originalContent = button.innerHTML;
        button.classList.add('copied');
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalContent;
        }, 2000);
    });
}

function acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted');
    const el = document.getElementById('cookie-consent');
    if (el) {
        el.classList.remove('show');
        setTimeout(() => { el.style.display = 'none'; }, 500);
    }
}
