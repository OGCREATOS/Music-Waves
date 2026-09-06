// ── Theme toggle ──
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) {
    html.setAttribute('data-theme', saved);
    themeBtn.textContent = saved === 'dark' ? '🌙' : '☀️';
}

themeBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('theme', next);
    // Flip animation
    themeBtn.classList.remove('spin');
    void themeBtn.offsetWidth;
    themeBtn.classList.add('spin');
});

// Background music — muted by default, click icon to play
const bgMusic = document.getElementById('bgMusic');
const volIcon = document.getElementById('volIcon');
let musicPlaying = false;

if (bgMusic) {
    bgMusic.volume = 0;
    volIcon.style.color = '#666';

    volIcon.addEventListener('click', e => {
        e.stopPropagation();
        if (musicPlaying) {
            bgMusic.pause();
            volIcon.classList.remove('playing');
            volIcon.style.color = '#666';
            musicPlaying = false;
        } else {
            bgMusic.volume = 0.05;
            bgMusic.play().then(() => {
                volIcon.classList.add('playing');
                volIcon.style.color = '#fff';
                musicPlaying = true;
            }).catch(() => { });
        }
    });
}

// Mobile nav
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    html.classList.toggle('menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav when clicking outside
document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !burger.contains(e.target)) {
        navLinks.classList.remove('open');
        html.classList.remove('menu-open');
        document.body.style.overflow = '';
    }
});

// Search dropdown
const searchBtn = document.getElementById('searchBtn');
const searchDropdown = document.getElementById('searchDropdown');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const searchPages = [
    { label: '🎹 Piano', href: '#courses', kw: 'music keyboard keys' },
    { label: '🎸 Guitar', href: '#courses', kw: 'acoustic electric bass strings' },
    { label: '🎻 Violin', href: '#courses', kw: 'bow strings classical' },
    { label: '🥁 Drums', href: '#courses', kw: 'percussion beats kit' },
    { label: '🎤 Vocals', href: '#courses', kw: 'singing voice hindustani carnatic western' },
    { label: '✏️ Drawing', href: '#courses', kw: 'sketching shading pencil' },
    { label: '🎨 Painting', href: '#courses', kw: 'watercolour acrylic oil canvas art' },
    { label: 'Subjects & Courses', href: '#courses', kw: 'learn class syllabus curriculum' },
    { label: 'Teachers & Mentors', href: '#teachers', kw: 'tutor instructor guru mentor guide' },
    { label: 'Pricing & Plans', href: '#pricing', kw: 'fees cost price money rupees plan monthly' },
    { label: 'Reviews & Testimonials', href: '#reviews', kw: 'feedback rating stars experience' },
    { label: 'FAQ / Help', href: '#faq', kw: 'help question answer doubt age eligibility instrument' },
    { label: 'Enroll / Admission', href: '#enroll', kw: 'register join signup apply admission booking' },
    { label: 'Contact / Location', href: '#contact', kw: 'address phone email whatsapp map direction' },
    { label: 'Why Music Waves', href: '#whyus', kw: 'about us features benefits certified small batches stage shows' }
];

function openSearch() {
    searchDropdown.classList.add('open');
    html.classList.add('search-open');
    if (window.innerWidth <= 950) document.body.style.overflow = 'hidden';
    searchInput.value = '';
    searchResults.innerHTML = '';
    setTimeout(() => searchInput.focus(), 100);
}

function closeSearch() {
    searchDropdown.classList.remove('open');
    html.classList.remove('search-open');
    if (window.innerWidth <= 950) document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
}

searchBtn.addEventListener('click', () => {
    if (searchDropdown.classList.contains('open')) {
        closeSearch();
    } else {
        openSearch();
    }
});
searchClose.addEventListener('click', closeSearch);

// Close search when clicking outside the search container
document.addEventListener('click', e => {
    if (!searchDropdown.classList.contains('open')) return;
    if (searchDropdown.contains(e.target) || searchBtn.contains(e.target)) return;
    closeSearch();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = ''; return; }
    const matches = searchPages.filter(p =>
        p.label.toLowerCase().includes(q) || (p.kw && p.kw.toLowerCase().includes(q))
    );
    if (matches.length === 0) {
        searchResults.innerHTML = '<div class="no-result">No results found</div>';
        return;
    }
    searchResults.innerHTML = matches.map(m =>
        `<a href="${m.href}" onclick="closeSearch()">${m.label}</a>`
    ).join('');
});

// Close search on scroll
let lastScrollY = scrollY;
window.addEventListener('scroll', () => {
    if (scrollY > lastScrollY && searchDropdown.classList.contains('open')) {
        closeSearch();
    }
    lastScrollY = scrollY;
}, { passive: true });

// Smooth animated scroll with easing + header offset
const headerEl = document.querySelector('.nav');
function headerOffset() { return (headerEl?.offsetHeight || 92) + 8; }
function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function smoothScrollTo(targetY, dur = 800) {
    const startY = scrollY, dist = targetY - startY;
    if (Math.abs(dist) < 2) return;
    let start = null;
    function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        scrollTo(0, startY + dist * easeInOut(p));
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
function goToHash(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    smoothScrollTo(Math.max(el.getBoundingClientRect().top + scrollY - headerOffset(), 0));
}

// Header quick-access buttons: animate to section on click
navLinks.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    navLinks.classList.remove('open');
    html.classList.remove('menu-open');
    document.body.style.overflow = '';
    a.classList.remove('clicked');
    void a.offsetWidth; // restart pop animation
    a.classList.add('clicked');
    goToHash(a.getAttribute('href'));
    history.replaceState(null, '', a.getAttribute('href'));
}));

// Precise active link via IntersectionObserver (accounts for sticky header)
const sections = [...document.querySelectorAll('section[id]')];
const navA = [...document.querySelectorAll('.links a[href^="#"]')];
function setActive(id) {
    navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
}
const secObs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
}, { rootMargin: `-${headerOffset()}px 0px -60% 0px`, threshold: 0 });
sections.forEach(s => secObs.observe(s));

// Progress bar + nav shadow + back-to-top
const progress = document.getElementById('progress');
const topFloat = document.getElementById('topFloat');
window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    document.querySelector('.nav')?.classList.toggle('scrolled', scrollY > 10);
    topFloat?.classList.toggle('show', scrollY > 600);
}, { passive: true });
topFloat?.addEventListener('click', () => smoothScrollTo(0, 900));

// Animated counters
const counters = document.querySelectorAll('[data-count]');
const cObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count; let n = 0;
    const t = setInterval(() => { n += Math.ceil(end / 40); if (n >= end) { n = end + '+'; clearInterval(t); } el.textContent = n; }, 40);
    cObs.unobserve(el);
}), { threshold: .5 });
counters.forEach(c => cObs.observe(c));

// Reveal on scroll
const rObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rObs.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => rObs.observe(el));

// Testimonials
const quotes = [
    '“My son learned guitar from zero in 4 months. Teachers are patient and classes are fun.”|— Priya, Parent',
    '“Best decision! Piano classes are super clear and practice material helps a lot.”|— Rahul, Student',
    '“Performed on stage in 3 months. Drums batch is energetic and Vikram sir is amazing!”|— Aditya, Student'
];
const quoteEl = document.getElementById('quote');
const dots = document.querySelectorAll('.dots button');
let qi = 0, qTimer = setInterval(nextQ, 4000);
function showQ(i) {
    qi = i;
    const [t, c] = quotes[i].split('|');
    quoteEl.innerHTML = t + '<cite>' + c + '</cite>';
    dots.forEach((d, j) => d.classList.toggle('on', j === i));
}
function nextQ() { showQ((qi + 1) % quotes.length); }
dots.forEach(d => d.addEventListener('click', () => { clearInterval(qTimer); showQ(+d.dataset.q); qTimer = setInterval(nextQ, 4000); }));

// All other in-page links (hero buttons, cards, footer, scroll hint): same smooth animation
document.querySelectorAll('a[href^="#"]:not(.links a)').forEach(a => a.addEventListener('click', e => {
    const hash = a.getAttribute('href');
    if (hash.length < 2 || !document.querySelector(hash)) return;
    e.preventDefault();
    goToHash(hash);
    history.replaceState(null, '', hash);
}));

// Pre-select course / plan from card buttons
const chips = [...document.querySelectorAll('#courseChips input')];
document.querySelectorAll('[data-course]').forEach(a => a.addEventListener('click', () => {
    const c = chips.find(x => x.value === a.dataset.course);
    if (c) c.checked = true;
    document.querySelector('.course-picker')?.classList.remove('invalid');
}));
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => {
    const msg = document.querySelector('textarea[name="msg"]');
    msg.value = 'Interested in ' + a.dataset.plan + ' plan. ';
}));

// Name: letters + spaces only
const nameInput = document.getElementById('nameInput');
nameInput.addEventListener('input', () => {
    nameInput.value = nameInput.value.replace(/[^A-Za-z\s]/g, '');
    nameInput.closest('.field').classList.remove('invalid');
});

// Phone: numbers only, max 10 digits
const phoneInput = document.getElementById('phoneInput');
phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10)
    phoneInput.closest('.field').classList.remove('invalid');
});

// Clear course error on change
chips.forEach(c => c.addEventListener('change', () => document.querySelector('.course-picker').classList.remove('invalid')));

// Form
document.getElementById('enrollForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const picked = chips.filter(c => c.checked).map(c => c.value);
    let ok = true;

    if (!/^[A-Za-z][A-Za-z\s]{1,49}$/.test(name)) {
        nameInput.closest('.field').classList.add('invalid');
        ok = false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
        phoneInput.closest('.field').classList.add('invalid');
        ok = false;
    }
    if (picked.length === 0) {
        document.querySelector('.course-picker').classList.add('invalid');
        ok = false;
    }
    if (!ok) return;

    document.getElementById('formOk').textContent = '✓ Received! ' + picked.join(', ') + ' — We will contact you soon.';
    document.getElementById('formOk').style.display = 'block';
    f.reset();
    setTimeout(() => document.getElementById('formOk').style.display = 'none', 5000);
});

// Gentle 3D tilt on hero card + slider (desktop only)
if (matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.tilt').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
}

// FAQ: only one open at a time
document.querySelectorAll('.faq details').forEach(d => {
    d.addEventListener('toggle', () => {
        if (d.open) document.querySelectorAll('.faq details').forEach(o => { if (o !== d) o.open = false; });
    });
});

// Swipe support for testimonials
let tx = null;
quoteEl.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
quoteEl.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) { clearInterval(qTimer); dx < 0 ? nextQ() : showQ((qi - 1 + quotes.length) % quotes.length); qTimer = setInterval(nextQ, 4000); }
    tx = null;
}, { passive: true });
