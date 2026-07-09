const langOrder = ['en', 'ru', 'de', 'fr', 'ge'];

function getCurrentLang() {
    var path = window.location.pathname;
    var parts = path.split('/');
    for (var i = 0; i < parts.length; i++) {
        if (langOrder.indexOf(parts[i]) !== -1) return parts[i];
    }
    return 'en';
}

function getPageName() {
    var path = window.location.pathname;
    var parts = path.split('/');
    return parts[parts.length - 1] || 'index.html';
}

var routeLine = null;
var mapAcTimeout = null;
var mapNominatimBase = 'https://nominatim.openstreetmap.org';
var mapOsrmBase = 'https://router.project-osrm.org';
var currentRouteMode = 'driving';
var escPinData = null;
var mapClickShouldBlur = false;
var stops = [];
var MAX_STOPS = 7;
var stopInputTimeouts = {};

function detectInputLang(text) {
    return /[Ѐ-ӿ]/.test(text) ? 'ru' : 'en';
}

function getStopByType(type) {
    for (var i = 0; i < stops.length; i++) {
        if (stops[i].type === type) return stops[i];
    }
    return null;
}

function getStopIndex(stop) {
    for (var i = 0; i < stops.length; i++) {
        if (stops[i] === stop) return i;
    }
    return -1;
}

function originStop() { return stops.length > 0 ? stops[stops.length - 1] : null; }

function destStop() { return stops.length > 0 ? stops[0] : null; }

function viaCount() { return Math.max(0, stops.length - 2); }

function buildStopLabel(type, index) {
    if (type === 'dest') return 'Куда';
    if (type === 'origin') return 'Откуда';
    return 'Через ' + index;
}

function makePinIcon(isFrom) {
    var fill = isFrom ? '%233b82f6' : '%23ef4444';
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36"%3E%3Cpath d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="' + fill + '" stroke="white" stroke-width="2"/%3E%3Ccircle cx="12" cy="12" r="5" fill="white"/%3E%3C/svg%3E';
}

function buildURL() {
    var url = new URL(window.location);
    var hashParts = [];
    for (var i = 0; i < stops.length; i++) {
        var s = stops[i];
        if (s.lat != null && s.lon != null) {
            hashParts.push('@' + s.lat.toFixed(4) + ',' + s.lon.toFixed(4));
        }
    }
    if (hashParts.length >= 2) {
        url.searchParams.delete('q');
        url.hash = hashParts.join(';');
        url.searchParams.set('mode', currentRouteMode);
    } else if (hashParts.length === 1) {
        url.searchParams.delete('q');
        url.hash = hashParts[0];
        url.searchParams.delete('mode');
    } else {
        url.searchParams.delete('mode');
        url.hash = '';
        var qVal = document.getElementById('map-search-input');
        if (qVal && qVal.value.trim()) {
            url.searchParams.set('q', qVal.value.trim());
        } else {
            url.searchParams.delete('q');
        }
    }
    return url.toString();
}

function updateURL() {
    window.history.replaceState(null, '', buildURL());
}

function removeMarker(stop) {
    if (stop && stop.marker && window.map) {
        window.map.removeLayer(stop.marker);
        stop.marker = null;
    }
}

function clearAllPins() {
    for (var i = 0; i < stops.length; i++) {
        removeMarker(stops[i]);
        stops[i].lat = null;
        stops[i].lon = null;
        stops[i].title = null;
    }
}

function placeStopPin(stop, lat, lon, title) {
    if (!window.map) return;
    removeMarker(stop);
    stop.lat = lat;
    stop.lon = lon;
    stop.title = title || (lat.toFixed(4) + ', ' + lon.toFixed(4));
    var isFrom = (stop.type === 'origin');
    var icon = L.icon({
        iconUrl: makePinIcon(isFrom),
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        popupAnchor: [0, -36]
    });
    var marker = L.marker([lat, lon], { icon: icon }).addTo(window.map);
    if (stop.title) {
        marker.bindPopup(stop.title).openPopup();
    }
    stop.marker = marker;
    if (stop.type === 'dest' || stop.type === 'origin') {
        window.map.setView([lat, lon], Math.max(window.map.getZoom(), 12));
    }
}

function getRoutePoints() {
    var points = [];
    for (var i = 0; i < stops.length; i++) {
        if (stops[i].lat != null && stops[i].lon != null) {
            points.push(stops[i]);
        }
    }
    return points;
}

function clearRouteLine() {
    if (routeLine && window.map) {
        window.map.removeLayer(routeLine);
        routeLine = null;
    }
}

function fetchRoute() {
    clearRouteLine();
    var points = getRoutePoints();
    if (points.length < 2) {
        var summaryEl = document.getElementById('maps-route-summary');
        if (summaryEl) summaryEl.textContent = '';
        return;
    }

    var coordsStr = '';
    for (var i = points.length - 1; i >= 0; i--) {
        if (coordsStr) coordsStr += ';';
        coordsStr += points[i].lon + ',' + points[i].lat;
    }

    var profile = currentRouteMode;
    if (profile === 'transit') profile = 'driving';
    var url = mapOsrmBase + '/route/v1/' + profile + '/' + coordsStr + '?geometries=geojson&overview=full&steps=false&alternatives=false';
    fetch(url, { headers: { 'User-Agent': 'B1ackMaps/1.0' } })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data && data.code === 'Ok' && data.routes && data.routes.length > 0) {
                var route = data.routes[0];
                var coords = route.geometry.coordinates.map(function(c) { return [c[1], c[0]]; });
                routeLine = L.polyline(coords, {
                    color: '#3b82f6',
                    weight: 4,
                    opacity: 0.8,
                    dashArray: currentRouteMode === 'transit' ? '8, 6' : null
                }).addTo(window.map);
                var dist = route.distance;
                var dur = route.duration;
                var distText = dist >= 1000 ? (dist / 1000).toFixed(1) + ' км' : Math.round(dist) + ' м';
                var durText = dur >= 3600 ? Math.floor(dur / 3600) + ' ч ' + Math.round((dur % 3600) / 60) + ' мин' : Math.round(dur / 60) + ' мин';
                var summaryEl = document.getElementById('maps-route-summary');
                if (summaryEl) summaryEl.textContent = distText + ' · ' + durText;
                var bounds = routeLine.getBounds();
                if (bounds.isValid()) window.map.fitBounds(bounds, { padding: [40, 40] });
            }
        })
        .catch(function() {});
}

function searchMapLocations(query, acEl, inputEl, clearEl, callback) {
    if (!acEl) return;
    if (query.length < 2) { acEl.classList.remove('active'); return; }
    var lang = detectInputLang(query);
    var url = mapNominatimBase + '/search?q=' + encodeURIComponent(query) + '&format=jsonv2&limit=5&accept-language=' + lang;
    fetch(url, { headers: { 'User-Agent': 'B1ackMaps/1.0' } })
        .then(function(r) { return r.json(); })
        .then(function(data) {
            acEl.innerHTML = '';
            if (data && data.length > 0) {
                data.forEach(function(r) {
                    var div = document.createElement('div');
                    div.className = 'map-ac-item';
                    var parts = r.display_name.split(',');
                    var name = parts[0];
                    var addr = parts.slice(1).join(',').trim();
                    div.innerHTML = '<div class="map-ac-name">' + name + '</div><div class="map-ac-addr">' + addr + '</div>';
                    div.addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (inputEl) inputEl.value = r.display_name;
                        acEl.classList.remove('active');
                        if (clearEl) clearEl.classList.add('show');
                        if (callback) callback(parseFloat(r.lat), parseFloat(r.lon), r.display_name);
                    });
                    acEl.appendChild(div);
                });
                acEl.classList.add('active');
            } else {
                acEl.classList.remove('active');
            }
        })
        .catch(function() { acEl.classList.remove('active'); });
}

function createStopRow(stop) {
    var row = document.createElement('div');
    row.className = 'maps-search-row maps-stop-row' + (stop.type === 'origin' ? ' maps-stop-row-origin' : '') + (stop.type === 'via' ? ' maps-stop-row-via' : '');
    row.dataset.stopType = stop.type;

    if (stop.type === 'dest') {
        var label = document.createElement('span');
        label.className = 'maps-stop-label';
        row.appendChild(label);
    }

    var input = document.createElement('input');
    input.className = 'maps-search-input maps-input-stop';
    input.type = 'text';
    input.placeholder = stop.type === 'dest' ? 'Поиск места...' : (stop.type === 'origin' ? 'Откуда...' : 'Через...');
    input.autocomplete = 'off';
    if (stop.title) input.value = stop.title;
    row.appendChild(input);
    stop.inputEl = input;

    if (stop.type !== 'origin') {
        var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'maps-search-icon');
        icon.setAttribute('width', '18');
        icon.setAttribute('height', '18');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.innerHTML = '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>';
        icon.style.cssText = 'fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;';
        row.appendChild(icon);
    }

    if (stop.type === 'origin') {
        var geoBtn = document.createElement('button');
        geoBtn.className = 'maps-geolocate-btn maps-geolocate-stop';
        geoBtn.type = 'button';
        geoBtn.title = 'Моё местоположение';
        geoBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>';
        row.appendChild(geoBtn);
        stop.geolocateEl = geoBtn;
    }

    var clear = document.createElement('button');
    clear.className = 'maps-search-clear maps-clear-stop';
    clear.innerHTML = '&times;';
    if (stop.title) clear.classList.add('show');
    row.appendChild(clear);
    stop.clearEl = clear;

    var ac = document.createElement('div');
    ac.className = 'maps-search-ac map-ac-stop';
    row.appendChild(ac);
    stop.acEl = ac;

    input.addEventListener('focus', function() {
        var rs = document.getElementById('maps-search-route');
        if (rs && !rs.classList.contains('open')) {
            rs.style.display = 'block';
            requestAnimationFrame(function() { rs.classList.add('open'); });
        }
    });

    input.addEventListener('input', function() {
        var val = input.value.trim();
        clear.classList.toggle('show', val.length > 0);

        var geoEl = row.querySelector('.maps-geolocate-btn');
        if (geoEl) geoEl.style.display = val.length > 0 ? 'none' : '';

        if (val.length > 0 && stop.type === 'via') {
            var cKey = 'cleanup_' + getStopIndex(stop);
            if (viaCleanupTimers[cKey]) clearTimeout(viaCleanupTimers[cKey]);
        }

        var key = 'stop_' + getStopIndex(stop);
        if (stopInputTimeouts[key]) clearTimeout(stopInputTimeouts[key]);
        stopInputTimeouts[key] = setTimeout(function() {
            if (val.length >= 2) {                    searchMapLocations(val, ac, input, clear, function(lat, lon, name) {
                        placeStopPin(stop, lat, lon, name);
                        input.value = name;
                        clear.classList.add('show');
                        updateURL();
                        fetchRoute();
                        if (stop.type === 'via') promoteViaToOrigin();
                    });
            } else {
                ac.classList.remove('active');
                if (val.length === 0 && stop.lat != null) {
                    removeMarker(stop);
                    stop.lat = null;
                    stop.lon = null;
                    stop.title = null;
                    updateURL();
                    fetchRoute();
                    if (stop.type === 'via') {
                        scheduleViaCleanup(stop);
                    }
                }
            }
        }, 300);
    });

    input.addEventListener('blur', function() {
        if (stop.type === 'via' && input.value.trim() === '' && stop.lat == null) {
            var cKey = 'cleanup_' + getStopIndex(stop);
            if (viaCleanupTimers[cKey]) clearTimeout(viaCleanupTimers[cKey]);
            viaCleanup(stop);
        }
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            input.blur();
            ac.classList.remove('active');
            e.stopPropagation();
        }
        if (e.key === 'Enter') {
            var first = ac.querySelector('.map-ac-item');
            if (first) first.click();
        }
    });

    clear.addEventListener('click', function(e) {
        e.stopPropagation();
        input.value = '';
        clear.classList.remove('show');
        ac.classList.remove('active');
        removeMarker(stop);
        stop.lat = null;
        stop.lon = null;
        stop.title = null;
        var geoEl = row.querySelector('.maps-geolocate-btn');
        if (geoEl) geoEl.style.display = '';
        updateURL();
        fetchRoute();
        input.focus();
        if (stop.type === 'via') {
            scheduleViaCleanup(stop);
        }
    });

    if (stop.geolocateEl) {
        stop.geolocateEl.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!navigator.geolocation) {
                stop.geolocateEl.classList.add('error');
                setTimeout(function(el) { el.classList.remove('error'); }, 2000, stop.geolocateEl);
                return;
            }
            if (stop.geolocateEl.classList.contains('loading')) return;
            stop.geolocateEl.classList.add('loading');
            navigator.geolocation.getCurrentPosition(
                function(pos) {
                    stop.geolocateEl.classList.remove('loading');
                    var lat = pos.coords.latitude;
                    var lon = pos.coords.longitude;
                    input.value = lat.toFixed(4) + ', ' + lon.toFixed(4);
                    clear.classList.add('show');
                    placeStopPin(stop, lat, lon, null);
                    updateURL();
                    fetchRoute();
                    if (stop.type === 'via') promoteViaToOrigin();
                },
                function() {
                    stop.geolocateEl.classList.remove('loading');
                    stop.geolocateEl.classList.add('error');
                    setTimeout(function(el) { el.classList.remove('error'); }, 2000, stop.geolocateEl);
                },
                { enableHighAccuracy: false, timeout: 15000 }
            );
        });
    }

    return row;
}

var viaCleanupTimers = {};

function scheduleViaCleanup(stop) {
    var key = 'cleanup_' + getStopIndex(stop);
    if (viaCleanupTimers[key]) clearTimeout(viaCleanupTimers[key]);
    viaCleanupTimers[key] = setTimeout(function() {
        viaCleanup(stop);
    }, 200);
}

function viaCleanup(stop) {
    if (stop.type !== 'via') return;
    var input = stop.inputEl;
    if (input && input.value.trim() === '' && stop.lat == null) {
        removeStop(getStopIndex(stop));
    }
}

function promoteViaToOrigin() {
    if (stops.length < 2) return;
    var origin = stops[stops.length - 1];
    if (origin.type !== 'origin') return;
    var isEmpty = (origin.lat == null || origin.title == null) &&
                  (!origin.inputEl || origin.inputEl.value.trim() === '');
    if (!isEmpty) return;
    for (var i = stops.length - 2; i >= 1; i--) {
        var via = stops[i];
        if (via.lat != null && via.lon != null) {
            removeMarker(origin);
            via.type = 'origin';
            if (via.marker) {
                var icon = L.icon({
                    iconUrl: makePinIcon(true),
                    iconSize: [24, 36],
                    iconAnchor: [12, 36],
                    popupAnchor: [0, -36]
                });
                via.marker.setIcon(icon);
            }
            stops.splice(stops.length - 1, 1);
            renderAllStops();
            updateURL();
            fetchRoute();
            return;
        }
    }
}

function cleanupEmptyVias() {
    for (var i = stops.length - 2; i >= 1; i--) {
        var s = stops[i];
        if (s.type === 'via' && s.inputEl && s.inputEl.value.trim() === '' && s.lat == null) {
            removeStop(i);
        }
    }
    promoteViaToOrigin();
}

function removeStop(idx) {
    if (idx <= 0 || idx >= stops.length - 1) return;
    var stop = stops[idx];
    removeMarker(stop);
    if (stop.inputEl) {
        var row = stop.inputEl.closest('.maps-stop-row');
        if (row) row.remove();
    }
    var key = 'stop_' + idx;
    if (stopInputTimeouts[key]) clearTimeout(stopInputTimeouts[key]);
    stops.splice(idx, 1);
    updateStopLabels();
    updateURL();
    fetchRoute();
    updateAddButton();
    promoteViaToOrigin();
}

function addStop() {
    if (stops.length >= MAX_STOPS) return;
    var oldOrigin = stops[stops.length - 1];
    oldOrigin.type = 'via';
    var newOrigin = { type: 'origin', lat: null, lon: null, title: null, marker: null, inputEl: null, clearEl: null, acEl: null, geolocateEl: null };
    stops.push(newOrigin);
    renderAllStops();
    updateURL();
    requestAnimationFrame(function() {
        if (newOrigin.inputEl) newOrigin.inputEl.focus();
    });
}

function updateStopLabels() {
    var wrapper = document.getElementById('maps-stops-wrapper');
    if (!wrapper) return;
    var rows = wrapper.querySelectorAll('.maps-stop-row');
    rows.forEach(function(row) {
        var label = row.querySelector('.maps-stop-label');
        var type = row.dataset.stopType;
        if (label && type) {
            var idx = Array.prototype.indexOf.call(rows, row) + 1;
            label.textContent = buildStopLabel(type, idx);
        }
    });
}

function updateAddButton() {
    var btn = document.getElementById('maps-stop-add');
    if (!btn) return;
    btn.classList.toggle('hidden', stops.length >= MAX_STOPS);
}

function renderAllStops() {
    var wrapper = document.getElementById('maps-stops-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';
    for (var i = 1; i < stops.length; i++) {
        var row = createStopRow(stops[i]);
        if (row) wrapper.appendChild(row);
    }
    updateAddButton();
    updateStopLabels();
}

function clearAll() {
    clearRouteLine();
    for (var i = 0; i < stops.length; i++) {
        removeMarker(stops[i]);
        stops[i].lat = null;
        stops[i].lon = null;
        stops[i].title = null;
        if (stops[i].inputEl) stops[i].inputEl.value = '';
        if (stops[i].clearEl) stops[i].clearEl.classList.remove('show');
    }
    var summaryEl = document.getElementById('maps-route-summary');
    if (summaryEl) summaryEl.textContent = '';
    updateURL();
}

function getAllData() {
    var data = [];
    for (var i = 0; i < stops.length; i++) {
        var s = stops[i];
        data.push({
            type: s.type,
            lat: s.lat,
            lon: s.lon,
            title: s.title
        });
    }
    return data;
}

function restoreAllData(data) {
    for (var i = 0; i < stops.length; i++) {
        removeMarker(stops[i]);
    }
    for (var i = 0; i < data.length && i < stops.length; i++) {
        var s = stops[i];
        var d = data[i];
        s.lat = d.lat;
        s.lon = d.lon;
        s.title = d.title;
        if (s.inputEl) s.inputEl.value = d.title || '';
        if (s.clearEl) {
            s.clearEl.classList.toggle('show', !!(d.title));
        }
        if (d.lat != null && d.lon != null) {
            placeStopPin(s, d.lat, d.lon, d.title);
        }
    }
    fetchRoute();
    updateURL();
}

document.addEventListener('DOMContentLoaded', function() {
    var themeToggle = document.getElementById('theme-toggle');
    var menuToggle = document.getElementById('menu-toggle');
    var nav = document.getElementById('nav');
    var navMoreToggle = document.getElementById('nav-more-toggle');
    var navMoreMenu = document.getElementById('nav-more-menu');
    var themeIcon = document.getElementById('theme-icon');

    var savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme') || 'dark';
            var next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
            localStorage.setItem('theme', next);
            var mapEl = document.getElementById('map');
            if (mapEl && window.osm && window.map && window.map.hasLayer(window.osm)) {
                mapEl.classList.toggle('theme-dark', next === 'dark');
                mapEl.style.backgroundColor = next === 'dark' ? '#0a0a0a' : '';
            }
        });
    }

    function positionPopup() {
        var homeLink = document.querySelector('.nav > .nav-link');
        if (!navMoreMenu || !homeLink || !navMoreToggle) return;
        var homeRect = homeLink.getBoundingClientRect();
        var toggleRect = navMoreToggle.getBoundingClientRect();
        var isMobile = window.innerWidth < 768;
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
            if (navMoreMenu.classList.contains('active')) {
                positionPopup();
            }
        });
        document.addEventListener('click', function() {
            navMoreToggle.classList.remove('active');
            navMoreMenu.classList.remove('active');
        });
        window.addEventListener('resize', positionPopup);
    }

    var langBtn = document.getElementById('lang-toggle');
    var langMenu = document.getElementById('lang-dropdown-menu');
    var langIcon = document.getElementById('lang-icon');

    document.querySelectorAll('.nav-lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var parts = btn.getAttribute('href').split('/');
            for (var i = 0; i < parts.length; i++) {
                var clean = parts[i].replace('.html', '');
                if (langOrder.indexOf(clean) !== -1) {
                    localStorage.setItem('b1ack-lang', clean);
                    break;
                }
            }
        });
    });

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            langMenu.classList.toggle('active');
        });
        document.addEventListener('click', function() {
            langMenu.classList.remove('active');
        });
        var currentLang = getCurrentLang();
        langMenu.querySelectorAll('.lang-dropdown-item').forEach(function(item) {
            if (item.dataset.lang === currentLang) {
                item.classList.add('active');
            }
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                var lang = item.dataset.lang;
                var page = getPageName();
                localStorage.setItem('b1ack-lang', lang);
                window.location.href = '../' + lang + '/' + page + window.location.search + window.location.hash;
            });
        });
    }

    if (!localStorage.getItem('cookie-consent')) {
        var el = document.getElementById('cookie-consent');
        if (el) {
            setTimeout(function() { el.classList.add('show'); }, 500);
        }
    }

    var searchInput = document.getElementById('map-search-input');
    var searchClear = document.getElementById('map-search-clear');
    var searchAc = document.getElementById('map-ac');
    var searchWrap = document.getElementById('maps-search-wrap');
    var inputWrap = document.getElementById('maps-search-input-wrap');
    var routeSection = document.getElementById('maps-search-route');
    var routeBtns = document.querySelectorAll('.maps-route-btn');

    if (searchWrap && window.L) {
        L.DomEvent.disableClickPropagation(searchWrap);
    }

    stops = [
        { type: 'dest', lat: null, lon: null, title: null, marker: null, inputEl: null, clearEl: null, acEl: null, geolocateEl: null },
        { type: 'origin', lat: null, lon: null, title: null, marker: null, inputEl: null, clearEl: null, acEl: null, geolocateEl: null }
    ];
    var destStop = stops[0];
    var originStopForRef = stops[1];

    renderAllStops();

    if (searchInput && destStop) {
        destStop.inputEl = searchInput;
        destStop.clearEl = searchClear;
        destStop.acEl = searchAc;

        searchInput.addEventListener('focus', function() {
            if (routeSection) {
                routeSection.style.display = 'block';
                requestAnimationFrame(function() {
                    routeSection.classList.add('open');
                });
            }
        });

        searchInput.addEventListener('input', function() {
            var val = this.value.trim();
            searchClear.classList.toggle('show', val.length > 0);
            var iconEl = document.querySelector('.maps-row-dest .maps-search-icon');
            if (iconEl) {
                iconEl.style.display = val.length > 0 ? 'none' : '';
            }

            if (mapAcTimeout) clearTimeout(mapAcTimeout);
            mapAcTimeout = setTimeout(function() {
                updateURL();
                if (val.length >= 2) {
                    searchMapLocations(val, searchAc, searchInput, searchClear, function(lat, lon, name) {
                        placeStopPin(destStop, lat, lon, name);
                        searchInput.value = name;
                        searchClear.classList.add('show');
                        updateURL();
                        fetchRoute();
                    });
                } else {
                    searchAc.classList.remove('active');
                    if (val.length === 0 && destStop.lat != null) {
                        removeMarker(destStop);
                        destStop.lat = null;
                        destStop.lon = null;
                        destStop.title = null;
                        updateURL();
                        fetchRoute();
                    }
                }
            }, 300);
        });

        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                searchInput.blur();
                searchAc.classList.remove('active');
                e.stopPropagation();
            }
            if (e.key === 'Enter') {
                var first = searchAc.querySelector('.map-ac-item');
                if (first) first.click();
            }
        });

        searchInput.addEventListener('blur', function(e) {
            setTimeout(function() {
                if (routeSection) {
                    var anyStopFocused = false;
                    for (var i = 0; i < stops.length; i++) {
                        if (stops[i].inputEl && document.activeElement === stops[i].inputEl) {
                            anyStopFocused = true;
                            break;
                        }
                    }
                    var focusOnFooterBtn = document.activeElement && routeSection.contains(document.activeElement) &&
                        !document.activeElement.closest('.maps-stop-row');
                    if (!anyStopFocused && !focusOnFooterBtn) {
                        var hasOtherData = false;
                        for (var i = 1; i < stops.length; i++) {
                            if (stops[i].inputEl && stops[i].inputEl.value.trim()) {
                                hasOtherData = true;
                                break;
                            }
                        }
                        if (!hasOtherData) {
                            routeSection.classList.remove('open');
                            setTimeout(function() {
                                routeSection.style.display = 'none';
                            }, 200);
                        }
                    }
                }
            }, 150);
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', function(e) {
            e.stopPropagation();
            searchInput.value = '';
            searchClear.classList.remove('show');
            searchAc.classList.remove('active');
            removeMarker(destStop);
            destStop.lat = null;
            destStop.lon = null;
            destStop.title = null;
            var iconEl = document.querySelector('.maps-row-dest .maps-search-icon');
            if (iconEl) iconEl.style.display = '';
            updateURL();
            fetchRoute();
            searchInput.focus();
        });
    }

    var addBtn = document.getElementById('maps-stop-add');
    if (addBtn) {
        addBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            addStop();
        });
    }

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.maps-search-input-wrap')) {
            for (var i = 0; i < stops.length; i++) {
                if (stops[i].acEl) stops[i].acEl.classList.remove('active');
            }
        }
    });

    routeBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            routeBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentRouteMode = btn.dataset.mode;
            try { localStorage.setItem('maps-route-mode', currentRouteMode); } catch(e) {}
            fetchRoute();
            updateURL();
        });
    });

    var shareBtn = document.getElementById('maps-share-btn');
    if (shareBtn) {
        function showCopyToast() {
            var existing = document.querySelector('.maps-toast');
            if (existing) existing.remove();
            var toast = document.createElement('div');
            toast.className = 'maps-toast';
            toast.textContent = 'Ссылка скопирована';
            searchWrap.appendChild(toast);
            requestAnimationFrame(function() {
                toast.classList.add('show');
            });
            setTimeout(function() {
                toast.classList.remove('show');
                setTimeout(function() { toast.remove(); }, 300);
            }, 2000);
        }
        shareBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navigator.clipboard.writeText(window.location.href).then(showCopyToast).catch(function() {});
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape') return;
        for (var i = 0; i < stops.length; i++) {
            if (stops[i].inputEl && document.activeElement === stops[i].inputEl) return;
        }
        var hasPins = false;
        for (var i = 0; i < stops.length; i++) {
            if (stops[i].lat != null) { hasPins = true; break; }
        }
        if (hasPins) {
            escPinData = JSON.stringify(getAllData());
            clearAll();
        } else if (escPinData) {
            var data = JSON.parse(escPinData);
            restoreAllData(data);
            escPinData = null;
        }
    });

    if (window.map) {
        window.map.on('mousedown', function() {
            var anyFocused = false;
            for (var i = 0; i < stops.length; i++) {
                if (stops[i].inputEl && document.activeElement === stops[i].inputEl) {
                    anyFocused = true;
                    break;
                }
            }
            mapClickShouldBlur = anyFocused;
        });

        window.map.on('click', function(e) {
            cleanupEmptyVias();
            if (mapClickShouldBlur) {
                for (var i = 0; i < stops.length; i++) {
                    if (stops[i].inputEl && document.activeElement === stops[i].inputEl) {
                        stops[i].inputEl.blur();
                    }
                }
                mapClickShouldBlur = false;
                var hasOtherData = false;
                for (var i = 1; i < stops.length; i++) {
                    if (stops[i].inputEl && stops[i].inputEl.value.trim()) {
                        hasOtherData = true;
                        break;
                    }
                }
                if (!hasOtherData && routeSection) {
                    routeSection.classList.remove('open');
                    setTimeout(function() {
                        routeSection.style.display = 'none';
                    }, 200);
                }
                return;
            }

            if (destStop.lat != null) {
                var otherPins = false;
                for (var i = 1; i < stops.length; i++) {
                    if (stops[i].lat != null) { otherPins = true; break; }
                }
                if (!otherPins) {
                    removeMarker(destStop);
                    destStop.lat = null;
                    destStop.lon = null;
                    destStop.title = null;
                    if (destStop.inputEl) destStop.inputEl.value = '';
                    if (destStop.clearEl) destStop.clearEl.classList.remove('show');
                    var iconEl = document.querySelector('.maps-row-dest .maps-search-icon');
                    if (iconEl) iconEl.style.display = '';
                    updateURL();
                    return;
                }
            }

            var lat = e.latlng.lat;
            var lon = e.latlng.lng;
            fetch(mapNominatimBase + '/reverse?lat=' + lat + '&lon=' + lon + '&format=jsonv2', { headers: { 'User-Agent': 'B1ackMaps/1.0' } })
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    var name = lat.toFixed(4) + ', ' + lon.toFixed(4);
                    if (data && data.display_name) name = data.display_name;
                    if (destStop.inputEl) destStop.inputEl.value = name;
                    if (destStop.clearEl) destStop.clearEl.classList.add('show');
                    var iconEl = document.querySelector('.maps-row-dest .maps-search-icon');
                    if (iconEl) iconEl.style.display = 'none';
                    placeStopPin(destStop, lat, lon, name);
                    updateURL();
                    fetchRoute();
                })
                .catch(function() {
                    var name = lat.toFixed(4) + ', ' + lon.toFixed(4);
                    if (destStop.inputEl) destStop.inputEl.value = name;
                    if (destStop.clearEl) destStop.clearEl.classList.add('show');
                    var iconEl = document.querySelector('.maps-row-dest .maps-search-icon');
                    if (iconEl) iconEl.style.display = 'none';
                    placeStopPin(destStop, lat, lon, name);
                    updateURL();
                    fetchRoute();
                });
        });
    }

    handleMapURL();
    window.addEventListener('popstate', handleMapURL);
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var icon = document.getElementById('theme-icon');
    if (icon) {
        icon.src = theme === 'dark' ? '../img/icons/dark.png' : '../img/icons/light.png';
    }
}

function acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted');
    var el = document.getElementById('cookie-consent');
    if (el) {
        el.classList.remove('show');
        setTimeout(function() { el.style.display = 'none'; }, 500);
    }
}

function handleMapURL() {
    var params = new URLSearchParams(window.location.search);
    var hash = window.location.hash.replace('#', '');
    var mode = params.get('mode');
    if (mode && ['driving', 'cycling', 'walking', 'transit'].indexOf(mode) !== -1) {
        currentRouteMode = mode;
        var btns = document.querySelectorAll('.maps-route-btn');
        btns.forEach(function(b) {
            b.classList.toggle('active', b.dataset.mode === mode);
        });
    } else {
        var savedMode;
        try { savedMode = localStorage.getItem('maps-route-mode'); } catch(e) {}
        if (savedMode && ['driving', 'cycling', 'walking', 'transit'].indexOf(savedMode) !== -1) {
            currentRouteMode = savedMode;
            var btns = document.querySelectorAll('.maps-route-btn');
            btns.forEach(function(b) {
                b.classList.toggle('active', b.dataset.mode === savedMode);
            });
        }
    }

    var coordsList = hash.split(';');
    var parsedCoords = [];
    coordsList.forEach(function(part) {
        if (part.indexOf('@') === 0) {
            var c = part.slice(1).split(',');
            if (c.length === 2) {
                var lat = parseFloat(c[0]);
                var lon = parseFloat(c[1]);
                if (!isNaN(lat) && !isNaN(lon)) {
                    parsedCoords.push({ lat: lat, lon: lon });
                }
            }
        }
    });

    if (parsedCoords.length >= 2) {
        if (window.map) {
            window.map.setView([parsedCoords[0].lat, parsedCoords[0].lon], Math.max(window.map.getZoom(), 12));
        }
        if (stops.length < 2) {
            stops = [
                { type: 'dest', lat: null, lon: null, title: null, marker: null, inputEl: null, clearEl: null, acEl: null, geolocateEl: null },
                { type: 'origin', lat: null, lon: null, title: null, marker: null, inputEl: null, clearEl: null, acEl: null, geolocateEl: null }
            ];
        }
        var destStop = stops[0];
        destStop.inputEl = document.getElementById('map-search-input');
        destStop.clearEl = document.getElementById('map-search-clear');
        destStop.acEl = document.getElementById('map-ac');
        while (stops.length < parsedCoords.length) {
            var ns = { type: 'via', lat: null, lon: null, title: null, marker: null, inputEl: null, clearEl: null, acEl: null, geolocateEl: null };
            stops.splice(stops.length - 1, 0, ns);
        }
        renderAllStops();
        for (var i = 0; i < parsedCoords.length && i < stops.length; i++) {
            (function(idx, lat, lon) {
                var stop = stops[idx];
                fetch(mapNominatimBase + '/reverse?lat=' + lat + '&lon=' + lon + '&format=jsonv2', { headers: { 'User-Agent': 'B1ackMaps/1.0' } })
                    .then(function(r) { return r.json(); })
                    .then(function(data) {
                        var name = lat.toFixed(4) + ', ' + lon.toFixed(4);
                        if (data && data.display_name) name = data.display_name;
                        if (stop.inputEl) stop.inputEl.value = name;
                        if (stop.clearEl) stop.clearEl.classList.add('show');
                        placeStopPin(stop, lat, lon, name);
                        var allDone = true;
                        for (var j = 0; j < stops.length; j++) {
                            if (stops[j].lat == null) { allDone = false; break; }
                        }
                        if (allDone) {
                            var routeSection = document.getElementById('maps-search-route');
                            if (routeSection) {
                                routeSection.style.display = 'block';
                                requestAnimationFrame(function() { routeSection.classList.add('open'); });
                            }
                            fetchRoute();
                        }
                    })
                    .catch(function() {
                        var name = lat.toFixed(4) + ', ' + lon.toFixed(4);
                        if (stop.inputEl) stop.inputEl.value = name;
                        if (stop.clearEl) stop.clearEl.classList.add('show');
                        placeStopPin(stop, lat, lon, name);
                        var allDone = true;
                        for (var j = 0; j < stops.length; j++) {
                            if (stops[j].lat == null) { allDone = false; break; }
                        }
                        if (allDone) {
                            var routeSection = document.getElementById('maps-search-route');
                            if (routeSection) {
                                routeSection.style.display = 'block';
                                requestAnimationFrame(function() { routeSection.classList.add('open'); });
                            }
                            fetchRoute();
                        }
                    });
            })(i, parsedCoords[i].lat, parsedCoords[i].lon);
        }
        updateURL();
        return;
    }

    if (parsedCoords.length === 1) {
        if (stops.length < 2) {
            stops = [
                { type: 'dest', lat: null, lon: null, title: null, marker: null, inputEl: null, clearEl: null, acEl: null, geolocateEl: null },
                { type: 'origin', lat: null, lon: null, title: null, marker: null, inputEl: null, clearEl: null, acEl: null, geolocateEl: null }
            ];
        }
        var destStop = stops[0];
        destStop.inputEl = document.getElementById('map-search-input');
        destStop.clearEl = document.getElementById('map-search-clear');
        destStop.acEl = document.getElementById('map-ac');
        var lat = parsedCoords[0].lat;
        var lon = parsedCoords[0].lon;
        if (window.map) {
            window.map.setView([lat, lon], Math.max(window.map.getZoom(), 12));
        }
        fetch(mapNominatimBase + '/reverse?lat=' + lat + '&lon=' + lon + '&format=jsonv2', { headers: { 'User-Agent': 'B1ackMaps/1.0' } })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                var name = lat.toFixed(4) + ', ' + lon.toFixed(4);
                if (data && data.display_name) name = data.display_name;
                var inp = document.getElementById('map-search-input');
                var clr = document.getElementById('map-search-clear');
                if (inp) inp.value = name;
                if (clr) clr.classList.add('show');
                placeStopPin(destStop, lat, lon, name);
            })
            .catch(function() {
                var name = lat.toFixed(4) + ', ' + lon.toFixed(4);
                var inp = document.getElementById('map-search-input');
                var clr = document.getElementById('map-search-clear');
                if (inp) inp.value = name;
                if (clr) clr.classList.add('show');
                placeStopPin(destStop, lat, lon, name);
            });
        return;
    }

    var q = params.get('q');
    if (q) {
        if (stops.length < 2) {
            stops = [
                { type: 'dest', lat: null, lon: null, title: null, marker: null, inputEl: null, clearEl: null, acEl: null, geolocateEl: null },
                { type: 'origin', lat: null, lon: null, title: null, marker: null, inputEl: null, clearEl: null, acEl: null, geolocateEl: null }
            ];
        }
        var destStop = stops[0];
        destStop.inputEl = document.getElementById('map-search-input');
        destStop.clearEl = document.getElementById('map-search-clear');
        destStop.acEl = document.getElementById('map-ac');
        var inp = document.getElementById('map-search-input');
        var clr = document.getElementById('map-search-clear');
        if (inp) inp.value = q;
        if (clr) clr.classList.add('show');
        searchMapLocations(q, document.getElementById('map-ac'), document.getElementById('map-search-input'), document.getElementById('map-search-clear'), function(lat, lon, name) {
            placeStopPin(destStop, lat, lon, name);
            updateURL();
        });
    }
}
