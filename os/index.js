const langOrder = ['en', 'ru', 'de', 'fr', 'ge'];

function getCurrentLang() {
    const path = window.location.pathname;
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang === 'ka') return 'ge';
    if (langOrder.includes(htmlLang)) return htmlLang;
    const parts = path.split('/');
    for (const part of parts) {
        if (langOrder.includes(part)) return part;
    }
    return 'en';
}

const currentLang = getCurrentLang();

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('tab-' + tabName).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const themeIcon = document.getElementById('theme-icon');
    const backToTopBtn = document.getElementById('backToTop');
    const askQuestionBtn = document.getElementById('askQuestionBtn');
    const issueModal = document.getElementById('issueModal');
    const successModal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close-modal');
    const issueForm = document.getElementById('issueForm');
    const labelOptions = document.querySelectorAll('.label-option');
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');
    const descriptionTextarea = document.getElementById('issueDescription');
    const navMoreToggle = document.getElementById('nav-more-toggle');
    const navMoreMenu = document.getElementById('nav-more-menu');
    let selectedLabels = [];

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
    const langIcon = document.getElementById('lang-icon');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            langMenu.classList.remove('active');
        });

        langMenu.querySelectorAll('.lang-dropdown-item').forEach(item => {
            if (item.dataset.lang === currentLang) {
                item.classList.add('active');
            }
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = item.dataset.lang;
                localStorage.setItem('b1ack-lang', lang);
                window.location.href = '/' + lang + window.location.hash;
            });
        });
    }

    document.querySelectorAll('.nav-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const href = btn.getAttribute('href');
            const parts = href.split('/');
            const lang = parts[parts.length - 1] || 'en';
            localStorage.setItem('b1ack-lang', lang);
        });
    });

    if (!localStorage.getItem('cookie-consent')) {
        const el = document.getElementById('cookie-consent');
        if (el) {
            setTimeout(() => el.classList.add('show'), 500);
        }
    }

    loadGitHubIssues();
    loadHashes();

    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }

    document.querySelectorAll('.environment-command').forEach((commandElement) => {
        commandElement.addEventListener('click', function () {
            const command = this.getAttribute('data-command');
            navigator.clipboard.writeText(command).then(() => {
                this.classList.add('copied');
                setTimeout(() => {
                    this.classList.remove('copied');
                }, 2000);
            });
        });
    });

    document.querySelectorAll('.hash-icon').forEach((hashIcon) => {
        hashIcon.addEventListener('click', function () {
            const hash = this.getAttribute('data-hash');
            navigator.clipboard.writeText(hash).then(() => {
                this.classList.add('copied');
                setTimeout(() => {
                    this.classList.remove('copied');
                }, 2000);
            });
        });
    });

    if (askQuestionBtn && issueModal) {
        askQuestionBtn.addEventListener('click', function() {
            issueModal.style.display = 'block';
        });
    }

    if (closeModal && issueModal) {
        closeModal.addEventListener('click', function() {
            issueModal.style.display = 'none';
        });
    }

    if (issueModal && successModal) {
        window.addEventListener('click', function(event) {
            if (event.target === issueModal) {
                issueModal.style.display = 'none';
            }
            if (event.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }

    if (labelOptions.length) {
        labelOptions.forEach(option => {
            option.addEventListener('click', function() {
                const label = this.getAttribute('data-label');
                if (selectedLabels.includes(label)) {
                    selectedLabels = selectedLabels.filter(l => l !== label);
                    this.classList.remove('selected');
                } else {
                    selectedLabels.push(label);
                    this.classList.add('selected');
                }
            });
        });
    }

    if (toolbarBtns.length && descriptionTextarea) {
        toolbarBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const format = this.getAttribute('data-format');
                const start = descriptionTextarea.selectionStart;
                const end = descriptionTextarea.selectionEnd;
                const selectedText = descriptionTextarea.value.substring(start, end);
                
                let formattedText = '';
                
                switch(format) {
                    case 'bold':
                        formattedText = `**${selectedText}**`;
                        break;
                    case 'italic':
                        formattedText = `*${selectedText}*`;
                        break;
                    case 'code':
                        formattedText = `\`${selectedText}\``;
                        break;
                    case 'link':
                        formattedText = `[${selectedText}](url)`;
                        break;
                    case 'quote':
                        formattedText = `> ${selectedText}`;
                        break;
                    case 'list':
                        formattedText = `- ${selectedText}`;
                        break;
                    case 'image':
                        formattedText = `![${selectedText}](image-url)`;
                        break;
                }
                
                descriptionTextarea.setRangeText(formattedText, start, end, 'select');
                descriptionTextarea.focus();
            });
        });
    }

    if (issueForm) {
        issueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('issueTitle').value;
            const description = document.getElementById('issueDescription').value;
            const submitBtn = document.getElementById('submitIssue');
            
            if (!title.trim()) {
                alert(langSubmitError());
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = langCreating();
            
            const GITHUB_TOKEN = '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';
            const GITHUB_OWNER = 'b1-ack';
            const GITHUB_REPO = 'operating-system';
            
            fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    title: title,
                    body: description,
                    labels: selectedLabels.length > 0 ? selectedLabels : ['question']
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.html_url) {
                    issueModal.style.display = 'none';
                    successModal.style.display = 'block';
                    issueForm.reset();
                    selectedLabels = [];
                    labelOptions.forEach(option => option.classList.remove('selected'));
                    loadGitHubIssues();
                    
                    setTimeout(() => {
                        successModal.style.display = 'none';
                    }, 2000);
                } else {
                    throw new Error(data.message || langIssueError());
                }
            })
            .catch(error => {
                alert(langCreateError() + error.message);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = langCreateBtn();
            });
        });
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentImageIndex = 0;

    const environmentImages = document.querySelectorAll('.environment-image');
    environmentImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(img.src);
        });
    });

    function openLightbox(src) {
        if (lightboxImg) lightboxImg.src = src;
        if (lightbox) lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    if (lightboxPrev && lightbox) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + environmentImages.length) % environmentImages.length;
            lightboxImg.src = environmentImages[currentImageIndex].src;
        });
    }

    if (lightboxNext && lightbox) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % environmentImages.length;
            lightboxImg.src = environmentImages[currentImageIndex].src;
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + environmentImages.length) % environmentImages.length;
            lightboxImg.src = environmentImages[currentImageIndex].src;
        }
        if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % environmentImages.length;
            lightboxImg.src = environmentImages[currentImageIndex].src;
        }
    });
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.src = theme === 'dark' ? 'https://b1ack.net/img/icons/dark.png' : 'https://b1ack.net/img/icons/light.png';
    }
}

function acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted');
    const consent = document.getElementById('cookie-consent');
    if (consent) {
        consent.classList.remove('show');
        setTimeout(() => consent.style.display = 'none', 500);
    }
}

function toggleCinnamon(button) {
    const row = button.closest('.environment-row');
    const img = row.querySelector('.environment-dynamic-image');
    const cmd = row.querySelector('.environment-command');
    const cinnamonDownloadButtons = row.querySelector('.cinnamon-download-buttons');
    const cinnamonCommand = row.querySelector('.cinnamon-command');
    const starIcon = document.getElementById('cinnamon-star-icon');
    const isCurrentlyB1ack = row.classList.contains('gold-theme');
    
    if (isCurrentlyB1ack) {
        row.classList.remove('gold-theme');
        button.classList.remove('active');
        img.src = 'https://b1ack.net/img/cinnamon.png';
        if (starIcon) starIcon.src = 'https://b1ack.net/img/icons/star-vector.png';
        if (cinnamonCommand) cinnamonCommand.style.display = '';
        if (cinnamonDownloadButtons) cinnamonDownloadButtons.style.display = 'none';
    } else {
        row.classList.add('gold-theme');
        button.classList.add('active');
        img.src = 'https://b1ack.net/img/b1ack-cinnamon.png';
        if (starIcon) starIcon.src = 'https://b1ack.net/img/icons/star.png';
        if (cinnamonCommand) cinnamonCommand.style.display = 'none';
        if (cinnamonDownloadButtons) cinnamonDownloadButtons.style.display = '';
    }
}

function switchEnvironment(button) {
    const content = button.closest('.environment-content');
    const row = button.closest('.environment-row');

    row.querySelectorAll('.environment-toggle-btn')
        .forEach(btn => btn.classList.remove('active'));

    button.classList.add('active');

    const imgSrc = button.getAttribute('data-img');
    const cmd = button.getAttribute('data-cmd');
    const title = button.getAttribute('data-title');
    const subtitle = button.getAttribute('data-subtitle');
    const desc = button.getAttribute('data-desc');

    if (imgSrc) row.querySelector('.environment-dynamic-image').src = imgSrc;
    if (title) row.querySelector('.environment-title').textContent = title;
    if (subtitle) row.querySelector('.environment-subtitle').textContent = subtitle;
    if (desc) row.querySelector('.environment-description').textContent = desc;

    const commandBlock = content.querySelector('.environment-command');
    if (cmd && commandBlock) {
        commandBlock.dataset.command = cmd;
        commandBlock.textContent = cmd;
    }
}

async function loadGitHubIssues() {
    const GITHUB_OWNER = 'b1-ack';
    const GITHUB_REPO = 'operating-system';
    const GITHUB_TOKEN = ``;

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`;
    const headers = {
        Accept: 'application/vnd.github+json',
        ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        const container = document.getElementById('issuesContainer');
        if (!container) return;
        container.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="no-issues">
                    <p>🎉 ${langNoIssues()}</p>
                </div>`;
            return;
        }

        const issuesList = document.createElement('div');
        issuesList.className = 'issues-list';

        data.forEach((issue) => {
            const issueItem = document.createElement('div');
            issueItem.className = 'issue-item';
            
            const issueHeader = document.createElement('div');
            issueHeader.className = 'issue-header';
            
            const issueTitle = document.createElement('div');
            issueTitle.className = 'issue-title';
            
            const titleLink = document.createElement('a');
            titleLink.href = issue.html_url;
            titleLink.target = '_blank';
            titleLink.textContent = issue.title;
            
            issueTitle.appendChild(titleLink);
            
            const issueMeta = document.createElement('div');
            issueMeta.className = 'issue-meta';
            
            const issueNumber = document.createElement('span');
            issueNumber.className = 'issue-number';
            issueNumber.textContent = `#${issue.number}`;
            
            const issueDate = document.createElement('span');
            issueDate.className = 'issue-date';
            issueDate.textContent = new Date(issue.created_at).toLocaleDateString();
            
            issueMeta.appendChild(issueNumber);
            issueMeta.appendChild(issueDate);
            
            issueHeader.appendChild(issueTitle);
            issueHeader.appendChild(issueMeta);
            
            const issueBody = document.createElement('div');
            issueBody.className = 'issue-body';
            issueBody.textContent = issue.body ? issue.body.substring(0, 200) + '...' : langNoDescription();
            
            const issueLabels = document.createElement('div');
            issueLabels.className = 'issue-labels';
            
            if (issue.labels && issue.labels.length > 0) {
                issue.labels.forEach(label => {
                    const labelElement = document.createElement('span');
                    labelElement.className = `issue-label label-${label.name.replace(/\s+/g, '-')}`;
                    labelElement.textContent = label.name;
                    labelElement.style.backgroundColor = '#' + (label.color || '333');
                    issueLabels.appendChild(labelElement);
                });
            }
            
            issueItem.appendChild(issueHeader);
            issueItem.appendChild(issueBody);
            issueItem.appendChild(issueLabels);
            
            issuesList.appendChild(issueItem);
        });

        container.appendChild(issuesList);
    } catch (err) {
        console.error('Error loading GitHub issues:', err);
        const container = document.getElementById('issuesContainer');
        if (container) {
            container.innerHTML = `
                <div class="no-issues">
                    <p>❌ ${langLoadError()}</p>
                </div>`;
        }
    }
}

function langSubmitError() {
    const msgs = {
        'ru': 'Пожалуйста, введите заголовок вопроса',
        'en': 'Please enter issue title',
        'de': 'Bitte geben Sie einen Titel ein',
        'fr': 'Veuillez saisir un titre',
        'ge': 'გთხოვთ შეიყვანოთ სათაური'
    };
    return msgs[currentLang] || msgs['en'];
}

function langCreating() {
    const msgs = {
        'ru': 'Создание...',
        'en': 'Creating...',
        'de': 'Erstelle...',
        'fr': 'Création...',
        'ge': 'იქმნება...'
    };
    return msgs[currentLang] || msgs['en'];
}

function langIssueError() {
    const msgs = {
        'ru': 'Ошибка создания вопроса',
        'en': 'Error creating issue',
        'de': 'Fehler beim Erstellen',
        'fr': 'Erreur de création',
        'ge': 'შეცდომა შექმნისას'
    };
    return msgs[currentLang] || msgs['en'];
}

function langCreateError() {
    const msgs = {
        'ru': 'Ошибка при создании вопроса: ',
        'en': 'Error creating issue: ',
        'de': 'Fehler beim Erstellen des Issues: ',
        'fr': 'Erreur lors de la création: ',
        'ge': 'შეცდომა საკითხის შექმნისას: '
    };
    return msgs[currentLang] || msgs['en'];
}

function langCreateBtn() {
    const msgs = {
        'ru': 'Создать вопрос',
        'en': 'Create Issue',
        'de': 'Issue erstellen',
        'fr': 'Créer un ticket',
        'ge': 'საკითხის შექმნა'
    };
    return msgs[currentLang] || msgs['en'];
}

function langNoIssues() {
    const msgs = {
        'ru': 'Нет открытых вопросов',
        'en': 'No open issues',
        'de': 'Keine offenen Issues',
        'fr': 'Aucun ticket ouvert',
        'ge': 'ღია საკითხები არ არის'
    };
    return msgs[currentLang] || msgs['en'];
}

function langNoDescription() {
    const msgs = {
        'ru': 'Нет описания',
        'en': 'No description',
        'de': 'Keine Beschreibung',
        'fr': 'Pas de description',
        'ge': 'აღწერა არ არის'
    };
    return msgs[currentLang] || msgs['en'];
}

function langLoadError() {
    const msgs = {
        'ru': 'Ошибка загрузки вопросов',
        'en': 'Failed to load issues',
        'de': 'Fehler beim Laden der Issues',
        'fr': 'Échec du chargement',
        'ge': 'ჩატვირთვის შეცდომა'
    };
    return msgs[currentLang] || msgs['en'];
}

async function loadHashes() {
    try {
        const response = await fetch('hash.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('table tr');

        const hashMap = {};
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 2) {
                const filename = cells[0].textContent.trim();
                const hash = cells[1].textContent.trim();
                if (filename && hash) {
                    hashMap[filename] = hash;
                }
            }
        });

        document.querySelectorAll('.hash-icon').forEach(icon => {
            const card = icon.closest('.os-card');
            const downloadBtn = card.querySelector('.download-btn');
            if (downloadBtn) {
                const href = downloadBtn.getAttribute('href');
                const filename = href.split('/').pop();
                const hash = hashMap[filename];
                if (hash) {
                    const fullHash = 'sha256:' + hash;
                    icon.setAttribute('data-hash', fullHash);
                    const tooltip = icon.querySelector('.hash-tooltip');
                    if (tooltip) {
                        tooltip.textContent = fullHash;
                    }
                }
            }
        });
    } catch (err) {
        console.error('Error loading hashes:', err);
    }
}

