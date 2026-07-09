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

const _s = {
    en: {
        wmo: {
            0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
            45:'Fog',48:'Fog',51:'Light drizzle',53:'Moderate drizzle',55:'Dense drizzle',
            56:'Light freezing drizzle',57:'Dense freezing drizzle',
            61:'Slight rain',63:'Moderate rain',65:'Heavy rain',
            66:'Light freezing rain',67:'Heavy freezing rain',
            71:'Slight snow',73:'Moderate snow',75:'Heavy snow',77:'Snow grains',
            80:'Slight rain showers',81:'Moderate rain showers',82:'Violent rain showers',
            85:'Slight snow showers',86:'Heavy snow showers',
            95:'Thunderstorm',96:'Thunderstorm with hail',99:'Thunderstorm with hail'
        },
        wd: ['N','NE','E','SE','S','SW','W','NW'],
        wdS: ['Su','Mo','Tu','We','Th','Fr','Sa'],
        wdF: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        today:'Today',current:'Current Weather',feels:'Feels like',humidity:'Humidity',
        wind:'Wind',uv:'UV Index',uvS:'UV',pressure:'Pressure',visibility:'Visibility',
        precip:'Precipitation',dew:'Dew point',sunrise:'Sunrise',sunset:'Sunset:',
        low:'Low',moderate:'Moderate',high:'High',extreme:'Extreme',
        hourly:'Hourly Forecast',daily:'7-Day Forecast',details:'Details',
        prev:'Previous',next:'Next',day:'Day',min:'Min',range:'Range',max:'Max',
        rain:'Precip',unknown:'Unknown',gust:'gust',hPa:' hPa',km:' km',
        kmh:' km/h',mph:' mph',mm:' mm',inch:' in',
        loading:'Loading weather...',error:'Error loading weather',
        geoNotSupported:'Geolocation is not supported in your browser',
        geoDetecting:'Detecting location...',
        geoFailed:'Could not detect location. Check geolocation access in your browser settings.',
        chooseLoc:'Choose location',searchCity:'Search city...',
        detect:'Detect',provider:'Weather provider: Open-Meteo',
        temperature:'Temperature',windL:'Wind',precipitation:'Precipitation',
        home:'Home',system:'System',docs:'Documentation',more:'More',
        weather:'Weather',fingerprint:'Fingerprint',generator:'Generator',
        donate:'Donate',cookies:'Cookies',
        cookieText:'We do not collect or store your cookies.',
        accept:'Accept'
    },
    ru: {
        wmo: {
            0:'Ясно',1:'Преимущественно ясно',
            2:'Переменная облачность',
            3:'Облачно',
            45:'Туман',48:'Туман',
            51:'Легкий моросящий дождь',
            53:'Умеренный моросящий дождь',
            55:'Сильный моросящий дождь',
            56:'Легкий ледяной моросящий дождь',
            57:'Умеренный ледяной моросящий дождь',
            61:'Небольшой дождь',
            63:'Умеренный дождь',
            65:'Сильный дождь',
            66:'Легкий ледяной дождь',
            67:'Сильный ледяной дождь',
            71:'Небольшой снегопад',
            73:'Умеренный снегопад',
            75:'Сильный снегопад',
            77:'Град',
            80:'Небольшие ливни',
            81:'Умеренные ливни',
            82:'Сильные ливни',
            85:'Небольшие снегопады',
            86:'Сильные снегопады',
            95:'Гроза',96:'Гроза с градом',
            99:'Гроза с градом'
        },
        wd: ['С','СВ','В','ЮВ','Ю','ЮЗ','З','СЗ'],
        wdS: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        wdF: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
        today:'Сегодня',current:'Текущая погода',
        feels:'Ощущается как',
        humidity:'Влажность',wind:'Ветер',
        uv:'УФ Индекс',uvS:'УФ',
        pressure:'Давление',visibility:'Видимость',
        precip:'Осадки',dew:'Точка росы',
        sunrise:'Восход',sunset:'Заход: ',
        low:'Низкий',moderate:'Умеренный',
        high:'Высокий',extreme:'Экстремальный',
        hourly:'Почасовой прогноз',
        daily:'Прогноз на 7 дней',
        details:'Подробно',
        prev:'Назад',next:'Вперёд',
        day:'День',min:'Мин',range:'Диапазон',
        max:'Макс',rain:'Осад',unknown:'Неизвестно',
        gust:'пор.',hPa:' гПа',km:' км',
        kmh:' км/ч',mph:' ми/ч',mm:' мм',inch:' дюйм',
        loading:'Загрузка погоды...',
        error:'Ошибка загрузки погоды',
        geoNotSupported:'Геолокация не поддерживается в вашем браузере',
        geoDetecting:'Определение местоположения...',
        geoFailed:'Не удалось определить местоположение. Проверьте доступ к геолокации в настройках браузера',
        chooseLoc:'Выберите местоположение',
        searchCity:'Поиск города...',
        detect:'Определить',
        provider:'Поставщик погоды: Open-Meteo',
        temperature:'Температура',windL:'Ветер',
        precipitation:'Осадки',
        home:'Главная',system:'Система',
        docs:'Документация',more:'Ещё',
        weather:'Погода',fingerprint:'Отпечаток',
        generator:'Генератор',donate:'Донат',
        cookies:'Cookies',
        cookieText:'Мы не собираем и не храним ваши файлы cookie.',
        accept:'Принять'
    },
    de: {
        wmo: {
            0:'Klar',1:'Überwiegend klar',2:'Teilweise bewölkt',3:'Bewölkt',
            45:'Nebel',48:'Nebel',51:'Leichter Nieselregen',53:'Mäßiger Nieselregen',55:'Starker Nieselregen',
            56:'Leichter gefrierender Nieselregen',57:'Mäßiger gefrierender Nieselregen',
            61:'Leichter Regen',63:'Mäßiger Regen',65:'Starker Regen',
            66:'Leichter gefrierender Regen',67:'Starker gefrierender Regen',
            71:'Leichter Schneefall',73:'Mäßiger Schneefall',75:'Starker Schneefall',77:'Schneekörner',
            80:'Leichte Regenschauer',81:'Mäßige Regenschauer',82:'Starke Regenschauer',
            85:'Leichte Schneeschauer',86:'Starke Schneeschauer',
            95:'Gewitter',96:'Gewitter mit Hagel',99:'Gewitter mit Hagel'
        },
        wd: ['N','NO','O','SO','S','SW','W','NW'],
        wdS: ['So','Mo','Di','Mi','Do','Fr','Sa'],
        wdF: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
        today:'Heute',current:'Aktuelles Wetter',feels:'Gefühlt wie',
        humidity:'Luftfeuchtigkeit',wind:'Wind',uv:'UV-Index',uvS:'UV',
        pressure:'Luftdruck',visibility:'Sichtweite',
        precip:'Niederschlag',dew:'Taupunkt',sunrise:'Sonnenaufgang',sunset:'Sonnenuntergang: ',
        low:'Niedrig',moderate:'Mäßig',high:'Hoch',extreme:'Extrem',
        hourly:'Stündliche Vorhersage',daily:'7-Tage-Vorhersage',details:'Details',
        prev:'Zurück',next:'Weiter',day:'Tag',min:'Min',range:'Spanne',max:'Max',
        rain:'Niederschl',unknown:'Unbekannt',gust:'Böen',hPa:' hPa',km:' km',
        kmh:' km/h',mph:' mph',mm:' mm',inch:' Zoll',
        loading:'Wetter wird geladen...',error:'Fehler beim Laden der Wetterdaten',
        geoNotSupported:'Geolokalisierung wird von Ihrem Browser nicht unterstützt',
        geoDetecting:'Standort wird ermittelt...',
        geoFailed:'Standort konnte nicht ermittelt werden. Überprüfen Sie den Zugriff auf die Geolokalisierung in Ihren Browsereinstellungen.',
        chooseLoc:'Standort wählen',searchCity:'Stadt suchen...',
        detect:'Ermitteln',provider:'Wetterdienst: Open-Meteo',
        temperature:'Temperatur',windL:'Wind',precipitation:'Niederschlag',
        home:'Startseite',system:'System',docs:'Dokumentation',more:'Mehr',
        weather:'Wetter',fingerprint:'Fingerabdruck',generator:'Generator',
        donate:'Spenden',cookies:'Cookies',
        cookieText:'Wir sammeln und speichern keine Cookies.',
        accept:'Akzeptieren'
    },
    fr: {
        wmo: {
            0:'Clair',1:'Plutôt dégagé',2:'Partiellement nuageux',3:'Nuageux',
            45:'Brouillard',48:'Brouillard',51:'Légère bruine',53:'Bruine modérée',55:'Forte bruine',
            56:'Légère bruine verglaçante',57:'Forte bruine verglaçante',
            61:'Pluie faible',63:'Pluie modérée',65:'Pluie forte',
            66:'Pluie verglaçante faible',67:'Pluie verglaçante forte',
            71:'Neige faible',73:'Neige modérée',75:'Neige forte',77:'Grains de neige',
            80:'Averses faibles',81:'Averses modérées',82:'Averses fortes',
            85:'Faibles chutes de neige',86:'Fortes chutes de neige',
            95:'Orage',96:'Orage avec grêle',99:'Orage avec grêle'
        },
        wd: ['N','NE','E','SE','S','SO','O','NO'],
        wdS: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
        wdF: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
        today:'Aujourd\'hui',current:'Météo actuelle',feels:'Ressenti',
        humidity:'Humidité',wind:'Vent',uv:'Indice UV',uvS:'UV',
        pressure:'Pression',visibility:'Visibilité',
        precip:'Précipitations',dew:'Point de rosée',sunrise:'Lever',sunset:'Coucher: ',
        low:'Faible',moderate:'Modéré',high:'Élevé',extreme:'Extrême',
        hourly:'Prévisions horaires',daily:'Prévisions 7 jours',details:'Détails',
        prev:'Précédent',next:'Suivant',day:'Jour',min:'Min',range:'Écart',max:'Max',
        rain:'Précip',unknown:'Inconnu',gust:'rafale',hPa:' hPa',km:' km',
        kmh:' km/h',mph:' mph',mm:' mm',inch:' po',
        loading:'Chargement de la météo...',error:'Erreur de chargement de la météo',
        geoNotSupported:'La géolocalisation n\'est pas prise en charge par votre navigateur',
        geoDetecting:'Détection de la position...',
        geoFailed:'Impossible de détecter la position. Vérifiez l\'accès à la géolocalisation dans les paramètres de votre navigateur.',
        chooseLoc:'Choisir un lieu',searchCity:'Rechercher une ville...',
        detect:'Détecter',provider:'Fournisseur météo: Open-Meteo',
        temperature:'Température',windL:'Vent',precipitation:'Précipitations',
        home:'Accueil',system:'Système',docs:'Documentation',more:'Plus',
        weather:'Météo',fingerprint:'Empreinte',generator:'Générateur',
        donate:'Don',cookies:'Cookies',
        cookieText:'Nous ne collectons ni ne stockons vos cookies.',
        accept:'Accepter'
    },
    ge: {
        wmo: {
            0:'ნათელი',1:'უმეტესად ნათელი',
            2:'ნაწილობრივ მოღრუბლი',
            3:'მოღრუბლი',
            45:'ნისლი',48:'ნისლი',
            51:'მსუბუქი წვიმა',53:'ზომიერი წვიმა',55:'ძლიერი წვიმა',
            56:'მსუბუქი გაყინულიანი წვიმა',
            57:'ზომიერი გაყინულიანი წვიმა',
            61:'მცირე წვიმა',63:'ზომიერი წვიმა',
            65:'ძლიერი წვიმა',
            66:'მსუბუქი გაყინულიანი წვიმა',
            67:'ძლიერი გაყინულიანი წვიმა',
            71:'მცირე თოვლი',73:'ზომიერი თოვლი',
            75:'ძლიერი თოვლი',77:'სეტყვა',
            80:'მცირე ხანმო႙ლე წვიმა',
            81:'ზომიერი ხანმოკლე წვიმა',
            82:'ძლიერი ხანმოკლე წვიმა',
            85:'მცირე თოვლის ხანმოკლე ნალექი',
            86:'ძლიერი თოვლის ხანმოკლე ნალექი',
            95:'ქარიშხალი',96:'ქარიშხალი სეტყვით',
            99:'ქარიშხალი სეტყვით'
        },
        wd: ['ჩ','ჩ-ა','ა','ს-ა','ს','ს-დ','დ','ჩ-დ'],
        wdS: ['კვ','ორ','სა','ოს','ხუ','პა','შა'],
        wdF: ['კვირა','ორშაბათი','სამშაბათი','ოთხშაბათი','ხუთშაბათი','პარასკევი','შაბათი'],
        today:'დღეს',current:'მიმდინარე ამინდი',
        feels:'შეგრჯდება როგორც',
        humidity:'ტენიანობა',wind:'ქარი',
        uv:'ულტრაიასტვის ინდექსი',uvS:'ულტრა',
        pressure:'წნება',visibility:'ხილადიანობა',
        precip:'ნალექი',dew:'ნამსხვის წერცილი',
        sunrise:'ამოსვლა',sunset:'ჩასვლა: ',
        low:'დაბალი',moderate:'ზომიერი',
        high:'მაღალი',extreme:'ექსტრემალური',
        hourly:'საათო პროგნოზი',
        daily:'7-დღიანი პროგნოზი',
        details:'დეტალური',
        prev:'უ႙ან',next:'შემდეგი',
        day:'დღე',min:'მინ',range:'დიაპაზონი',
        max:'მაქს',rain:'ნალექი',unknown:'უცნობილი',
        gust:'ანკი',hPa:' ჰპა',km:' კმ',
        kmh:' კმ/სთ',mph:' მი/სთ',mm:' მმ',inch:' დუიმი',
        loading:'ამინდის ჩამტვირთა...',
        error:'ამინდის ჩამტვირთის შეცდომა',
        geoNotSupported:'გეოლოკაცია არ არის მხარდაჭერილი ტქვენს ბრაუზერში',
        geoDetecting:'ადგილმედგომარეობის განსაზღვრა...',
        geoFailed:'ვერ მოხერხა ადგილმედგომარეობის განსაზღვრა. შეამოწეთ გეოლოკაციის ხელმიწვდომა ბრაუზერის პარამეტრებში.',
        chooseLoc:'აირჩიეთ ადგილმედგომარეობა',
        searchCity:'მოძებრაეთ ქალაქი...',
        detect:'განსაზღვრა',
        provider:'ამინდის მომწოდებელი: Open-Meteo',
        temperature:'ტემპერატურა',windL:'ქარი',
        precipitation:'ნალექი',
        home:'მთავარი',system:'სისტემა',
        docs:'დოკუმენტაცია',more:'მეტი',
        weather:'ამინდი',fingerprint:'ანაბეჭდი',
        generator:'გენერატორი',donate:'შემოწირულობა',
        cookies:'ქუქიები',
        cookieText:'ჩვენ არ ვაგროვებთ და არ ვინახავთ ტქვენს ქუქიებს.',
        accept:'მიღება'
    }
};

function _(key) {
    const lang = getCurrentLang();
    return (_s[lang] && _s[lang][key] !== undefined) ? _s[lang][key] : ((_s.en[key] !== undefined) ? _s.en[key] : key);
}

function _w(code) {
    const lang = getCurrentLang();
    return (_s[lang] && _s[lang].wmo && _s[lang].wmo[code] !== undefined) ? _s[lang].wmo[code] : (_s.en.wmo[code] || 'Unknown');
}

function _wd(idx) {
    const lang = getCurrentLang();
    return (_s[lang] && _s[lang].wd && _s[lang].wd[idx] !== undefined) ? _s[lang].wd[idx] : _s.en.wd[idx];
}

function _wdS(idx) {
    const lang = getCurrentLang();
    return (_s[lang] && _s[lang].wdS && _s[lang].wdS[idx] !== undefined) ? _s[lang].wdS[idx] : _s.en.wdS[idx];
}

function _wdF(idx) {
    const lang = getCurrentLang();
    return (_s[lang] && _s[lang].wdF && _s[lang].wdF[idx] !== undefined) ? _s[lang].wdF[idx] : _s.en.wdF[idx];
}

const wmoIcons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '💧', 53: '💧', 55: '💧',
    56: '💧', 57: '💧',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    66: '🌧️', 67: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '🌨️',
    77: '🌨️',
    80: '🌧️', 81: '🌧️', 82: '🌧️',
    85: '🌨️', 86: '🌨️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
};

function wmoIcon(code) { return wmoIcons[code] || '☁️'; }
function wmoDescText(code) { return _w(code); }

function windDir(deg) {
    return _wd(Math.round(deg / 45) % 8);
}

function windDirArrow(deg) {
    return '<svg style="width:14px;height:14px;vertical-align:middle;transform:rotate(' + deg + 'deg)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L12 22M12 2L7 7M12 2L17 7"/></svg>';
}

let autoUnits = null;
let acTimeout = null;
let weatherData = null;
let weatherCity = '';
let weatherLat = null;
let weatherLon = null;

function getUnit(key, def) {
    try {
        const v = localStorage.getItem(key);
        if (v) return v;
    } catch(e) {}
    if (autoUnits && autoUnits[key]) return autoUnits[key];
    return def;
}

function setUnit(key, val) {
    try { localStorage.setItem(key, val); } catch(e) {}
}

function applyUnitsUI() {
    const groups = {
        temperature: getUnit('temperature', 'c'),
        speed: getUnit('speed', 'kmh'),
        precipitation: getUnit('precipitation', 'mm')
    };
    document.querySelectorAll('.wunits-group').forEach(function(g) {
        const unit = g.querySelector('.wunits-btns').dataset.unit;
        g.querySelectorAll('button').forEach(function(b) {
            b.classList.toggle('active', b.dataset.value === groups[unit]);
        });
    });
}

function convertTemp(c) {
    if (c === null || c === undefined) return '';
    return getUnit('temperature', 'c') === 'f' ? Math.round(c * 9 / 5 + 32) : Math.round(c);
}

function tempUnit() {
    return getUnit('temperature', 'c') === 'f' ? '°F' : '°C';
}

function convertWind(kmh) {
    if (kmh === null || kmh === undefined) return '';
    return getUnit('speed', 'kmh') === 'mph' ? Math.round(kmh * 0.621371) : Math.round(kmh);
}

function windUnit() {
    return getUnit('speed', 'kmh') === 'mph' ? _('mph') : _('kmh');
}

function convertPrecip(mm) {
    if (mm === null || mm === undefined) return '';
    if (mm === 0) return 0;
    return getUnit('precipitation', 'mm') === 'in' ? (mm / 25.4).toFixed(1) : Math.round(mm);
}

function precipUnit() {
    return getUnit('precipitation', 'mm') === 'in' ? _('inch') : _('mm');
}

function detectUnits(countryCode) {
    if (countryCode === 'US') {
        return { temperature: 'f', speed: 'mph', precipitation: 'in' };
    } else if (countryCode === 'GB') {
        return { temperature: 'c', speed: 'mph', precipitation: 'mm' };
    }
    return { temperature: 'c', speed: 'kmh', precipitation: 'mm' };
}

function saveLocation(lat, lon, name) {
    try { localStorage.setItem('location', JSON.stringify({lat: lat, lon: lon, name: name})); } catch(e) {}
}

function showContent() {
    var init = document.getElementById('wloc-initial');
    if (init) init.classList.add('wloc-determined');
    document.getElementById('wcontent').style.display = 'block';
    document.body.classList.add('w-scroll');
}

function showLoading(msg) {
    showContent();
    const wc = document.getElementById('wcontent');
    wc.innerHTML = '<div class="wloading"><div class="wloading-spinner"></div><div>' + msg + '</div></div>';
}

function renderWeather(data, cityName, lat, lon) {
    weatherData = data;
    weatherCity = cityName;
    weatherLat = lat;
    weatherLon = lon;
    const c = data.current;
    const h = data.hourly;
    const d = data.daily;
    const code = c.weather_code;
    const icon = wmoIcon(code);
    const desc = wmoDescText(code);
    const temp = c.temperature_2m;
    const feels = c.apparent_temperature;
    const wc = document.getElementById('wcontent');
    const now = new Date();
    const hourNow = now.getHours();

    let hourlyHtml = '';
    for (let i = 0; i < 24; i++) {
        const t = h.time[i];
        const hh = parseInt(t.split('T')[1].split(':')[0]);
        const hTemp = h.temperature_2m[i];
        const hCode = h.weather_code[i];
        const hRain = h.precipitation_probability ? h.precipitation_probability[i] : 0;
        const isActive = hh === hourNow;
        hourlyHtml += '<div class="whourly-item' + (isActive ? ' active' : '') + '">' +
            '<div class="whourly-time">' + String(hh).padStart(2, '0') + ':00</div>' +
            '<div class="whourly-icon">' + wmoIcon(hCode) + '</div>' +
            '<div class="whourly-temp">' + convertTemp(hTemp) + '</div>' +
            (hRain !== undefined ? '<div class="whourly-rain">' + hRain + '%</div>' : '') +
            '</div>';
    }

    let dailyHtml = '';
    const todayName = _wdF(now.getDay());
    for (let i = 0; i < d.time.length; i++) {
        const date = new Date(d.time[i] + 'T00:00:00');
        const dayIdx = date.getDay();
        const isToday = i === 0;
        const shortName = isToday ? _('today') : _wdS(dayIdx);
        const high = d.temperature_2m_max[i];
        const low = d.temperature_2m_min[i];
        const dCode = d.weather_code[i];
        const dRain = d.precipitation_probability_max ? d.precipitation_probability_max[i] : 0;
        const minTRaw = Math.min(...d.temperature_2m_min);
        const maxTRaw = Math.max(...d.temperature_2m_max);
        const minT = convertTemp(minTRaw);
        const maxT = convertTemp(maxTRaw);
        const barWidth = ((convertTemp(high) - convertTemp(low)) / (maxT - minT || 1)) * 100;
        dailyHtml += '<div class="wdaily-item wanimate" style="animation-delay:' + (i * 0.05) + 's">' +
            '<div class="wdaily-name' + (isToday ? ' today' : '') + '">' + shortName + '</div>' +
            '<div class="wdaily-icon">' + wmoIcon(dCode) + '</div>' +
            '<div class="wdaily-temps"><span class="wdaily-low">' + convertTemp(low) + tempUnit() + '</span></div>' +
            '<div class="wdaily-bar-wrap"><div class="wdaily-bar" style="width:' + Math.max(barWidth, 4) + '%"></div></div>' +
            '<div class="wdaily-temps"><span class="wdaily-high">' + convertTemp(high) + tempUnit() + '</span></div>' +
            (dRain !== undefined ? '<div class="wdaily-rain">' + dRain + '%</div>' : '') +
            '</div>';
    }

    const uv = c.uv_index !== undefined ? c.uv_index : null;
    const vis = c.visibility !== undefined ? c.visibility : null;
    const press = c.pressure_msl !== undefined ? c.pressure_msl : null;
    const humid = c.relative_humidity_2m !== undefined ? c.relative_humidity_2m : null;
    const wind = c.wind_speed_10m !== undefined ? c.wind_speed_10m : null;
    const gust = c.wind_gusts_10m !== undefined ? c.wind_gusts_10m : null;
    const precip = c.precipitation !== undefined ? c.precipitation : null;
    const wdir = c.wind_direction_10m !== undefined ? c.wind_direction_10m : null;
    const dew = h.dew_point_2m ? Math.round(h.dew_point_2m[0]) : null;
    const sunrise = d.sunrise ? d.sunrise[0] : null;
    const sunset = d.sunset ? d.sunset[0] : null;

    let detailsHtml = '';
    if (humid !== null) detailsHtml += '<div class="wdetail-item"><div class="wdetail-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="wdetail-label">' + _('humidity') + '</div><div class="wdetail-value">' + humid + '<span class="wdetail-unit">%</span></div></div>';
    if (wind !== null) detailsHtml += '<div class="wdetail-item"><div class="wdetail-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg></div><div class="wdetail-label">' + _('wind') + '</div><div class="wdetail-value">' + convertWind(wind) + '<span class="wdetail-unit">' + windUnit() + '</span></div>' + (wdir ? '<div class="wdetail-sub">' + windDirArrow(wdir) + ' ' + windDir(wdir) + (gust ? ', ' + _('gust') + ' ' + convertWind(gust) + windUnit() : '') + '</div>' : '') + '</div>';
    if (uv !== null) {
        const uvDesc = uv <= 2 ? _('low') : uv <= 5 ? _('moderate') : uv <= 7 ? _('high') : _('extreme');
        detailsHtml += '<div class="wdetail-item"><div class="wdetail-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="wdetail-label">' + _('uv') + '</div><div class="wdetail-value">' + uv + '</div><div class="wdetail-sub ' + (uv <= 2 ? 'good' : uv <= 5 ? 'moderate' : 'bad') + '">' + uvDesc + '</div></div>';
    }
    if (press !== null) detailsHtml += '<div class="wdetail-item"><div class="wdetail-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></div><div class="wdetail-label">' + _('pressure') + '</div><div class="wdetail-value">' + Math.round(press) + '<span class="wdetail-unit">' + _('hPa') + '</span></div></div>';
    if (vis !== null) detailsHtml += '<div class="wdetail-item"><div class="wdetail-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg></div><div class="wdetail-label">' + _('visibility') + '</div><div class="wdetail-value">' + (vis / 1000).toFixed(1) + '<span class="wdetail-unit">' + _('km') + '</span></div></div>';
    if (precip !== null && precip > 0) detailsHtml += '<div class="wdetail-item"><div class="wdetail-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="wdetail-label">' + _('precip') + '</div><div class="wdetail-value">' + convertPrecip(precip) + '<span class="wdetail-unit">' + precipUnit() + '</span></div></div>';
    if (dew !== null) detailsHtml += '<div class="wdetail-item"><div class="wdetail-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="wdetail-label">' + _('dew') + '</div><div class="wdetail-value">' + dew + '<span class="wdetail-unit">°</span></div></div>';
    if (sunrise) {
        const sr = new Date(sunrise + 'Z');
        const ss = sunset ? new Date(sunset + 'Z') : null;
        detailsHtml += '<div class="wdetail-item"><div class="wdetail-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></div><div class="wdetail-label">' + _('sunrise') + '</div><div class="wdetail-value">' + String(sr.getHours()).padStart(2, '0') + ':' + String(sr.getMinutes()).padStart(2, '0') + '</div>' + (ss ? '<div class="wdetail-sub">' + _('sunset') + ' ' + String(ss.getHours()).padStart(2, '0') + ':' + String(ss.getMinutes()).padStart(2, '0') + '</div>' : '') + '</div>';
    }

    wc.innerHTML =
        '<div class="weather-card wcurrent wanimate">' +
        '<div class="wcurrent-location">' + _('current') + '</div>' +
        '<div class="wcurrent-city">' + cityName + '</div>' +
        '<div class="wcurrent-main">' +
        '<div>' +
        '<div class="wcurrent-temp-group"><span class="wcurrent-temp">' + convertTemp(temp) + '</span><span class="wcurrent-temp-unit">' + tempUnit() + '</span></div>' +
        '<div class="wcurrent-condition">' + icon + ' ' + desc + '</div>' +
        '<div class="wcurrent-feels">' + _('feels') + ' ' + convertTemp(feels) + tempUnit() + '</div>' +
        '</div>' +
        '<div class="wcurrent-icon" style="font-size:4rem;">' + icon + '</div>' +
        '</div>' +
        '<div class="wcurrent-stats">' +
        (wind !== null ? '<div class="wcurrent-stat"><div class="wcurrent-stat-val">' + convertWind(wind) + '<span style="font-size:0.7rem;opacity:0.5;">' + windUnit() + '</span></div><div class="wcurrent-stat-label">' + _('wind') + '</div></div>' : '') +
        (humid !== null ? '<div class="wcurrent-stat"><div class="wcurrent-stat-val">' + humid + '<span style="font-size:0.7rem;opacity:0.5;">%</span></div><div class="wcurrent-stat-label">' + _('humidity') + '</div></div>' : '') +
        (uv !== null ? '<div class="wcurrent-stat"><div class="wcurrent-stat-val">' + uv + '</div><div class="wcurrent-stat-label">' + _('uvS') + '</div></div>' : '') +
        (d.precipitation_probability_max ? '<div class="wcurrent-stat"><div class="wcurrent-stat-val">' + d.precipitation_probability_max[0] + '<span style="font-size:0.7rem;opacity:0.5;">%</span></div><div class="wcurrent-stat-label">' + _('precip') + '</div></div>' : '') +
        '</div>' +
        '</div>' +
        '<div class="wsection wanimate" style="animation-delay:0.1s">' +
        '<div class="wsection-title">' + _('hourly') + '</div>' +
        '<div class="whourly-wrap">' +
        '<button class="whourly-btn whourly-btn-prev" aria-label="' + _('prev') + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg></button>' +
        '<div class="whourly-scroll">' + hourlyHtml + '</div>' +
        '<button class="whourly-btn whourly-btn-next" aria-label="' + _('next') + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg></button>' +
        '</div>' +
        '</div>' +
        '<div class="wsection wanimate" style="animation-delay:0.15s">' +
        '<div class="wsection-title">' + _('daily') + '</div>' +
        '<div class="wdaily-header">' +
        '<span class="wdaily-header-name">' + _('day') + '</span>' +
        '<span class="wdaily-header-icon"></span>' +
        '<span class="wdaily-header-min">' + _('min') + '</span>' +
        '<span class="wdaily-header-bar">' + _('range') + '</span>' +
        '<span class="wdaily-header-max">' + _('max') + '</span>' +
        '<span class="wdaily-header-rain">' + _('rain') + '</span>' +
        '</div>' +
        '<div class="wdaily-grid">' + dailyHtml + '</div>' +
        '</div>' +
        '<div class="wsection wanimate" style="animation-delay:0.2s">' +
        '<div class="wsection-title">' + _('details') + '</div>' +
        '<div class="wdetails-grid">' + detailsHtml + '</div>' +
        '</div>';

    var scroll = document.querySelector('.whourly-scroll');
    if (scroll) {
        var active = scroll.querySelector('.whourly-item.active');
        if (active) {
            var sr = scroll.getBoundingClientRect();
            var ar = active.getBoundingClientRect();
            var off = ar.left - sr.left;
            var target = scroll.scrollLeft + off - (sr.width / 2) + (ar.width / 2);
            scroll.scrollTo({ left: target, behavior: 'smooth' });
        }
    }

    wc.querySelectorAll('.whourly-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var wrap = this.closest('.whourly-wrap');
            var scroller = wrap.querySelector('.whourly-scroll');
            var firstItem = scroller.querySelector('.whourly-item');
            if (!firstItem) return;
            var step = (firstItem.offsetWidth + 10) * 3;
            if (this.classList.contains('whourly-btn-prev')) {
                scroller.scrollBy({ left: -step, behavior: 'smooth' });
            } else {
                scroller.scrollBy({ left: step, behavior: 'smooth' });
            }
        });
    });
}

function detectInputLang(text) {
    return /[Ѐ-ӿ]/.test(text) ? 'ru' : 'en';
}

function fetchWeather(lat, lon, name, save) {
    if (save !== false) {
        saveLocation(lat, lon, name);
    }
    showLoading(_('loading'));
    const params = new URLSearchParams({
        latitude: lat, longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,uv_index,visibility,precipitation',
        hourly: 'temperature_2m,weather_code,precipitation_probability,dew_point_2m',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,sunrise,sunset',
        timezone: 'auto', forecast_days: '7'
    });
    fetch('https://api.open-meteo.com/v1/forecast?' + params.toString())
        .then(function(r) { return r.json(); })
        .then(function(data) {
            renderWeather(data, name, lat, lon);
        })
        .catch(function() {
            showContent();
            document.getElementById('wcontent').innerHTML = '<div class="wloading"><div style="font-size:2rem;margin-bottom:12px;">❌</div><div>' + _('error') + '</div></div>';
        });
}

function searchLocations(query) {
    const ac = document.getElementById('wloc-ac');
    if (query.length < 2) { ac.classList.remove('active'); return; }
    const lang = detectInputLang(query);
    fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(query) + '&count=6&language=' + lang + '&format=json')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            ac.innerHTML = '';
            if (data.results && data.results.length > 0) {
                data.results.forEach(function(r) {
                    const div = document.createElement('div');
                    div.className = 'wloc-ac-item';
                    div.innerHTML = '<div><div class="wloc-ac-name">' + r.name + (r.admin1 ? ', ' + r.admin1 : '') + '</div><div class="wloc-ac-country">' + (r.country || '') + '</div></div><div class="wloc-ac-coords">' + r.latitude.toFixed(2) + ', ' + r.longitude.toFixed(2) + '</div>';
                    div.addEventListener('click', function() {
                        document.getElementById('wloc-input').value = r.name + (r.admin1 ? ', ' + r.admin1 : '');
                        ac.classList.remove('active');
                        document.getElementById('wloc-clear').classList.add('show');
                    autoUnits = detectUnits(r.country_code);
                    applyUnitsUI();
                        fetchWeather(r.latitude, r.longitude, r.name + (r.admin1 ? ', ' + r.admin1 : ''));
                    });
                    ac.appendChild(div);
                });
                ac.classList.add('active');
            } else {
                ac.classList.remove('active');
            }
        })
        .catch(function() { ac.classList.remove('active'); });
}

function detectLocation() {
    if (!navigator.geolocation) {
        showLoading(_('geoNotSupported'));
        return;
    }
    showLoading(_('geoDetecting'));
    navigator.geolocation.getCurrentPosition(function(pos) {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        fetch('https://geocoding-api.open-meteo.com/v1/reverse?latitude=' + lat + '&longitude=' + lon + '&language=' + getCurrentLang() + '&format=json')
            .then(function(r) { return r.json(); })
            .then(function(data) {
                let name = lat.toFixed(2) + ', ' + lon.toFixed(2);
                if (data.results && data.results.length > 0) {
                    const r = data.results[0];
                    name = r.name + (r.admin1 ? ', ' + r.admin1 : '');
                    document.getElementById('wloc-input').value = name;
                    document.getElementById('wloc-clear').classList.add('show');
                    autoUnits = detectUnits(data.results[0].country_code);
                    applyUnitsUI();
                }
                fetchWeather(lat, lon, name);
            })
            .catch(function() {
                document.getElementById('wloc-input').value = lat.toFixed(2) + ', ' + lon.toFixed(2);
                document.getElementById('wloc-clear').classList.add('show');
                fetchWeather(lat, lon, lat.toFixed(2) + ', ' + lon.toFixed(2));
            });
    }, function() {
        showLoading(_('geoFailed'));
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const navMoreToggle = document.getElementById('nav-more-toggle');
    const navMoreMenu = document.getElementById('nav-more-menu');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() { nav.classList.toggle('active'); });
        document.addEventListener('click', function(e) { if (!nav.contains(e.target) && !menuToggle.contains(e.target)) nav.classList.remove('active'); });
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
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
        navMoreToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMoreToggle.classList.toggle('active');
            navMoreMenu.classList.toggle('active');
            if (navMoreMenu.classList.contains('active')) positionPopup();
        });
        document.addEventListener('click', function() { navMoreToggle.classList.remove('active'); navMoreMenu.classList.remove('active'); });
        window.addEventListener('resize', positionPopup);
    }

    const langBtn = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-dropdown-menu');
    document.querySelectorAll('.nav-lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const parts = btn.getAttribute('href').split('/');
            for (const part of parts) {
                const clean = part.replace('.html', '');
                if (langOrder.includes(clean)) { localStorage.setItem('b1ack-lang', clean); break; }
            }
        });
    });
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', function(e) { e.stopPropagation(); langMenu.classList.toggle('active'); });
        document.addEventListener('click', function() { langMenu.classList.remove('active'); });
        const currentLang = getCurrentLang();
        langMenu.querySelectorAll('.lang-dropdown-item').forEach(function(item) {
            if (item.dataset.lang === currentLang) item.classList.add('active');
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const lang = item.dataset.lang;
                const page = getPageName();
                localStorage.setItem('b1ack-lang', lang);
                window.location.href = '../' + lang + '/' + page + window.location.hash;
            });
        });
    }

    if (!localStorage.getItem('cookie-consent')) {
        const el = document.getElementById('cookie-consent');
        if (el) setTimeout(function() { el.classList.add('show'); }, 500);
    }

    const input = document.getElementById('wloc-input');
    const clearBtn = document.getElementById('wloc-clear');
    const detectBtn = document.getElementById('wloc-detect');
    const ac = document.getElementById('wloc-ac');

    if (input) {
        input.addEventListener('input', function() {
            const val = this.value.trim();
            if (val.length > 0) { clearBtn.classList.add('show'); } else { clearBtn.classList.remove('show'); }
            if (acTimeout) clearTimeout(acTimeout);
            acTimeout = setTimeout(function() { searchLocations(val); }, 300);
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') ac.classList.remove('active');
            if (e.key === 'Enter') {
                const first = ac.querySelector('.wloc-ac-item');
                if (first) first.click();
            }
        });
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.wloc-input-wrap')) ac.classList.remove('active');
        });
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            input.value = '';
            input.focus();
            clearBtn.classList.remove('show');
            ac.classList.remove('active');
        });
    }
    if (detectBtn) {
        detectBtn.addEventListener('click', detectLocation);
    }

    applyUnitsUI();

    document.querySelectorAll('.wunits-btns button').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const group = this.closest('.wunits-group');
            const unit = group.querySelector('.wunits-btns').dataset.unit;
            const value = this.dataset.value;
            setUnit(unit, value);
            applyUnitsUI();
            if (weatherData) {
                renderWeather(weatherData, weatherCity, weatherLat, weatherLon);
            }
        });
    });

    if (window.location.hash && window.location.hash.length > 1) {
        handleHashLocation();
    } else {
        const saved = localStorage.getItem('location');
        if (saved) {
            try {
                const loc = JSON.parse(saved);
                if (loc.lat && loc.lon && loc.name) {
                    document.getElementById('wloc-input').value = loc.name;
                    document.getElementById('wloc-clear').classList.add('show');
                    fetchWeather(loc.lat, loc.lon, loc.name);
                }
            } catch(e) {}
        }
    }
});

window.addEventListener('hashchange', function() {
    if (window.location.hash && window.location.hash.length > 1) {
        handleHashLocation();
    }
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.src = theme === 'dark' ? '../img/icons/dark.png' : '../img/icons/light.png';
    }
}

function handleHashLocation() {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return;
    if (hash.includes(',')) {
        const parts = hash.split(',', 2);
        const lat = parseFloat(parts[0].trim());
        const lon = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lon)) {
            const name = lat.toFixed(2) + ', ' + lon.toFixed(2);
            document.getElementById('wloc-input').value = name;
            document.getElementById('wloc-clear').classList.add('show');
            fetchWeather(lat, lon, name, false);
            return;
        }
    }
    fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(hash) + '&count=1&language=' + getCurrentLang() + '&format=json')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.results && data.results.length > 0) {
                const r = data.results[0];
                const name = r.name + (r.admin1 ? ', ' + r.admin1 : '');
                document.getElementById('wloc-input').value = name;
                document.getElementById('wloc-clear').classList.add('show');
                fetchWeather(r.latitude, r.longitude, name, false);
            }
        })
        .catch(function() {});
}

function acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted');
    const el = document.getElementById('cookie-consent');
    if (el) {
        el.classList.remove('show');
        setTimeout(function() { el.style.display = 'none'; }, 500);
    }
}
