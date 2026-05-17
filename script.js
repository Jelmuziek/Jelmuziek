// =============================
// Scrollbar indicator
// =============================

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    const bar = document.querySelector('.scrollbar');
    if (bar) bar.style.width = pct + '%';

    // Navbar shrink effect
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 40);
});

// =============================
// Hamburger menu
// =============================

function toggleMenu() {
    const menu = document.getElementById('navlinks');
    const hamburger = document.querySelector('.hamburger');
    menu.classList.toggle('active');
    hamburger.classList.toggle('open');
}

// Sluit menu als je op een link klikt
document.querySelectorAll('.navlinks a').forEach(a => {
    a.addEventListener('click', () => {
        document.getElementById('navlinks').classList.remove('active');
        document.querySelector('.hamburger')?.classList.remove('open');
    });
});

// Markeer actieve nav link
(function() {
    const current = location.pathname.split('/').pop();
    document.querySelectorAll('.navlinks a').forEach(a => {
        const href = a.getAttribute('href').split('/').pop();
        if (href === current || (current === '' && href === 'setlist.html')) {
            a.classList.add('active');
        }
    });
})();

// =============================
// Disco easter egg (5x klikken op logo)
// =============================

let clickCount = 0;
let discoOn = false;
const normal = ['♪','♫','♬','♪','♫','♬','♪','♫','♬','♪','♫','♬'];

const logoEl = document.querySelector('.brand');
const notes  = document.querySelectorAll('.music-background span');

if (logoEl) {
    logoEl.addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 5) {
            discoOn = !discoOn;
            document.body.classList.toggle('disco-mode', discoOn);
            notes.forEach((n, i) => {
                n.textContent = discoOn ? '🪩' : normal[i];
            });
            clickCount = 0;
        }
    });
}

// =============================
// Foto popup / lightbox
// =============================

function openImage(img) {
    const popup    = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    if (!popup || !popupImg) return;
    popupImg.src         = img.src;
    popup.style.display  = 'flex';
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeImage() {
    const popup = document.getElementById('popup');
    if (!popup) return;
    popup.style.display = 'none';
    popup.classList.remove('open');
    document.body.style.overflow = '';
}

// Sluit popup via Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeImage();
});

// Sluit popup door buiten foto te klikken
document.getElementById('popup')?.addEventListener('click', function(e) {
    if (e.target === this) closeImage();
});

// =============================
// Scroll-animaties (Intersection Observer)
// =============================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.song').forEach(s => observer.observe(s));

// ============================================
// NU SPEELT – Firebase Realtime Database
// Echte live updates, geen request limiet
// ============================================

const FB_URL = 'https://openstage-597a9-default-rtdb.europe-west1.firebasedatabase.app/show.json';

const SONG_NAMEN = [
    'American Idiot','Creep','Sailor Song','Lie To Me','Clair de Lune',
    'From The Start','Desperado','iloveitiloveitiloveit','505','Remedy',
    'Van Gogh','One Way Or Another',"Sweet Child O\'Mine",'Nothing Else Matters',
    'Price of Smokes & Cockroaches','Feuer Frei','Always','Tequila'
];

function updateSetlistUI(state) {
    const banner = document.getElementById('nu-speelt-banner');
    const naamEl = document.getElementById('nu-speelt-naam');
    const songs  = document.querySelectorAll('.song');
    if (!songs.length || !state) return;

    songs.forEach((el, i) => {
        const nr = i + 1;
        el.classList.toggle('speelt-nu',  nr === state.huidig);
        el.classList.toggle('afgespeeld', Array.isArray(state.afgespeeld) && state.afgespeeld.includes(nr));
    });

    if (banner && naamEl) {
        if (state.huidig) {
            naamEl.textContent = SONG_NAMEN[state.huidig - 1] || '';
            banner.classList.add('zichtbaar');
            const actief = document.querySelector('.song.speelt-nu');
            if (actief) actief.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            banner.classList.remove('zichtbaar');
        }
    }
}

// Firebase Server-Sent Events (gratis, realtime, geen polling nodig)
if (document.getElementById('nu-speelt-banner')) {
    const evtSource = new EventSource(FB_URL.replace('.json', '.json?accept=text/event-stream'));
    evtSource.addEventListener('put', e => {
        try {
            const data = JSON.parse(e.data);
            updateSetlistUI(data.data);
        } catch {}
    });
    evtSource.addEventListener('patch', e => {
        try {
            const data = JSON.parse(e.data);
            // Bij patch gewoon opnieuw ophalen
            fetch(FB_URL).then(r => r.json()).then(updateSetlistUI);
        } catch {}
    });
    // Fallback: ook nog poll elke 10 sec voor het geval SSE uitvalt
    setInterval(() => {
        fetch(FB_URL).then(r => r.json()).then(updateSetlistUI).catch(() => {});
    }, 10000);
    // Direct eerste keer laden
    fetch(FB_URL).then(r => r.json()).then(updateSetlistUI).catch(() => {});
}

// ============================================
// COUNTDOWN
// ============================================

function startCountdown(targetISO) {
    const vakken = {
        d: document.getElementById('cd-dagen'),
        u: document.getElementById('cd-uren'),
        m: document.getElementById('cd-minuten'),
        s: document.getElementById('cd-seconden'),
    };
    const klaar   = document.getElementById('cd-klaar');
    const wrap    = document.querySelector('.countdown-wrap');
    if (!vakken.d) return;

    function flip(el, val) {
        const str = String(val).padStart(2, '0');
        if (el.textContent !== str) {
            el.classList.add('flip');
            el.textContent = str;
            setTimeout(() => el.classList.remove('flip'), 200);
        }
    }

    function tick() {
        const diff = new Date(targetISO) - new Date();
        if (diff <= 0) {
            if (klaar) { klaar.style.display = 'block'; }
            document.querySelector('.countdown-vakken')?.style.setProperty('display','none');
            return;
        }
        const d = Math.floor(diff / 86400000);
        const u = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000)  / 60000);
        const s = Math.floor((diff % 60000)    / 1000);
        flip(vakken.d, d);
        flip(vakken.u, u);
        flip(vakken.m, m);
        flip(vakken.s, s);
        if (wrap) wrap.classList.add('zichtbaar');
    }

    tick();
    setInterval(tick, 1000);
}

// Datum instellen: pas dit aan naar de juiste datum/tijd van het evenement!
// Formaat: 'YYYY-MM-DDTHH:MM:SS'
const EVENEMENT_DATUM = '2026-12-12T19:00:00';
if (document.getElementById('cd-dagen')) {
    startCountdown(EVENEMENT_DATUM);
}
