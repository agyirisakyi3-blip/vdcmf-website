document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.querySelector('.main-header');

    // === MOBILE MENU ===
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // === LANGUAGE SWITCHER ===
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // === NAVBAR SCROLL ===
    window.addEventListener('scroll', () => {
        mainHeader.style.boxShadow = window.scrollY > 50
            ? '0 4px 20px rgba(0,0,0,0.15)'
            : '0 4px 6px -1px rgba(0,0,0,0.1)';
    });

    // === DONATION TOGGLE ===
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // === HERO SLIDER ===
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dots .dot');
        let current = 0;
        let interval;

        function goToSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            current = index;
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(interval);
                goToSlide(parseInt(dot.dataset.slide));
                startAutoPlay();
            });
        });

        function startAutoPlay() {
            interval = setInterval(() => {
                goToSlide((current + 1) % slides.length);
            }, 6000);
        }

        startAutoPlay();

        const heroSection = document.querySelector('.hero');
        heroSection.addEventListener('mouseenter', () => clearInterval(interval));
        heroSection.addEventListener('mouseleave', startAutoPlay);
    }

    // === STORY CAROUSEL ===
    const track = document.querySelector('.stories-track');
    if (track) {
        const cards = track.querySelectorAll('.story-card');
        const prevBtn = document.querySelector('.carousel-arrow.prev');
        const nextBtn = document.querySelector('.carousel-arrow.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let position = 0;

        function getVisibleCount() {
            const w = window.innerWidth;
            if (w <= 768) return 1;
            if (w <= 1024) return 2;
            return 3;
        }

        function getMaxPosition() {
            return Math.max(0, cards.length - getVisibleCount());
        }

        function getCardWidth() {
            const gap = 24;
            const container = track.parentElement;
            const containerWidth = container.offsetWidth;
            const visible = getVisibleCount();
            return (containerWidth - gap * (visible - 1)) / visible;
        }

        function buildDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const total = getMaxPosition() + 1;
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', () => {
                    position = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel() {
            const maxPos = getMaxPosition();
            if (position > maxPos) position = maxPos;
            if (position < 0) position = 0;

            const cardW = getCardWidth();
            track.style.transform = `translateX(-${position * (cardW + 24)}px)`;

            if (prevBtn) prevBtn.disabled = position === 0;
            if (nextBtn) nextBtn.disabled = position >= maxPos;

            if (dotsContainer) {
                dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === position);
                });
            }
        }

        if (prevBtn) prevBtn.addEventListener('click', () => { position--; updateCarousel(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { position++; updateCarousel(); });

        buildDots();
        updateCarousel();
        window.addEventListener('resize', () => {
            buildDots();
            updateCarousel();
        });
    }

    // === STAT COUNTER ===
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const target = parseInt(text.replace(/\D/g, ''));
                const duration = 2000;
                const start = performance.now();
                const hasPlus = text.includes('+');

                function animate(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    entry.target.textContent = current.toLocaleString() + (hasPlus ? '+' : '');
                    if (progress < 1) requestAnimationFrame(animate);
                    else entry.target.textContent = target.toLocaleString() + (hasPlus ? '+' : '');
                }
                requestAnimationFrame(animate);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(stat => counterObserver.observe(stat));

    // === COPY TO CLIPBOARD ===
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const span = btn.closest('.detail-row')?.querySelector('.copyable');
            const text = span?.textContent.trim();
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    const orig = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => { btn.innerHTML = orig; }, 2000);
                });
            }
        });
    });

    // === FORMS ===
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('input[type="text"]')?.value;
            const email = contactForm.querySelector('input[type="email"]')?.value;
            if (name && email) {
                alert(`Thank you, ${name}! Your message has been sent.`);
                contactForm.reset();
            }
        });
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]')?.value;
            if (email) {
                alert(`Thank you for subscribing! You'll receive our updates soon.`);
                newsletterForm.reset();
            }
        });
    }

    // === SMOOTH SCROLL ===
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const navH = mainHeader?.offsetHeight || 0;
                window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
            }
        });
    });

    // === DROPDOWN HOVER ===
    document.querySelectorAll('.nav-item.dropdown').forEach(dd => {
        dd.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1024) {
                const c = dd.querySelector('.dropdown-content');
                if (c) c.style.display = 'block';
            }
        });
        dd.addEventListener('mouseleave', () => {
            if (window.innerWidth > 1024) {
                const c = dd.querySelector('.dropdown-content');
                if (c) c.style.display = 'none';
            }
        });
    });

    // === ACTIVE NAV LINK ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    });

    // === SCROLL REVEAL ===
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    // === TEAM CARD IMAGE FIX: ensure gradient overlay works ===
    document.querySelectorAll('.team-card-image').forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.08)';
        });
        img.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
        });
    });

    // === PARALLAX VISION ===
    const visionSection = document.querySelector('.vision-mission');
    if (visionSection) {
        window.addEventListener('scroll', () => {
            const rect = visionSection.getBoundingClientRect();
            const speed = 0.3;
            const yPos = rect.top * speed;
            visionSection.style.setProperty('--parallax-y', `${yPos}px`);
        }, { passive: true });
    }
});