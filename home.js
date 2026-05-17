// ============================================
// HOME.JS – Alleen voor index.html
// ============================================

// ── Apple-stijl sticky scroll voor drumstel ──
(function() {
    const drumSection = document.getElementById('drumSection');
    const drumSVG     = document.getElementById('drumSVG');
    const drumHeading = document.getElementById('drumHeading');
    const drumBody    = document.getElementById('drumBody');

    if (!drumSection || !drumSVG) return;

    const slides = [
        {
            heading: 'Echt. Rauw. Live.',
            body: 'Van klassieke piano tot knallende gitaren — alles live op het podium.',
            rotate: 0,
            scale: 1,
        },
        {
            heading: '18 nummers.',
            body: 'Een volle avond met de meest uiteenlopende muziek, gespeeld door leerlingen & docenten.',
            rotate: -6,
            scale: 1.08,
        },
        {
            heading: 'Jouw podium.',
            body: 'Iedereen verdient een spotlight. Dat is de kern van de JEL Openstage.',
            rotate: 4,
            scale: 1.14,
        },
    ];

    let currentSlide = -1;

    window.addEventListener('scroll', () => {
        const rect    = drumSection.getBoundingClientRect();
        const total   = drumSection.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / total));

        // Roteer + schaal het drumstel op basis van scrollpositie
        const rotation = progress * 12 - 6;
        const scale    = 0.9 + progress * 0.22;
        drumSVG.style.transform = `rotate(${rotation}deg) scale(${scale})`;

        // Wissel tekst per derde van de scroll
        const slideIndex = Math.min(slides.length - 1, Math.floor(progress * slides.length));
        if (slideIndex !== currentSlide) {
            currentSlide = slideIndex;
            const s = slides[slideIndex];
            if (drumHeading) {
                drumHeading.style.opacity = '0';
                drumHeading.style.transform = 'translateY(16px)';
                setTimeout(() => {
                    drumHeading.textContent = s.heading;
                    drumHeading.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    drumHeading.style.opacity    = '1';
                    drumHeading.style.transform  = 'translateY(0)';
                }, 120);
            }
            if (drumBody) {
                drumBody.style.opacity = '0';
                setTimeout(() => {
                    drumBody.textContent = s.body;
                    drumBody.style.transition = 'opacity 0.4s ease 0.1s';
                    drumBody.style.opacity    = '1';
                }, 180);
            }
        }
    });
})();

// ── Scroll-reveal animaties voor features/quote/cta ──
(function() {
    const revealEls = document.querySelectorAll('.reveal, .feature-card, .quote-section, .cta-bottom');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
})();
