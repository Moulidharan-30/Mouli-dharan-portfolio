/* ===================================================================
   MOULI DHARAN — PORTFOLIO SCRIPT
   ===================================================================
   TABLE OF CONTENTS:
   1.  Custom Cursor
   2.  Navigation (scroll state + mobile menu)
   3.  Scroll Progress Bar
   4.  Scroll Reveal (IntersectionObserver)
   5.  Animated Counters (About stats)
   6.  Back to Top button
   7.  GSAP Enhanced Animations
   8.  Smooth scroll for anchor links
   =================================================================== */

'use strict';

/* ───────────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
   Tracks mouse position; scales on hoverable elements
   ─────────────────────────────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  // Don't run on touch-only devices
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let animId;

  /* Update dot position instantly */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  /* Ring follows with lerp (smooth lag) */
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    animId = requestAnimationFrame(animateRing);
  }
  animateRing();

  /* Hover state on interactive elements */
  const hoverTargets = document.querySelectorAll('a, button, [role="button"], .skill-tag, .project-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* Hide when mouse leaves window */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();


/* ───────────────────────────────────────────────────────────────────
   2. NAVIGATION
   - Adds .scrolled class when user scrolls past 60px
   - Mobile menu toggle
   ─────────────────────────────────────────────────────────────────── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const menuBtn   = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  /* Scroll state */
  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  /* Mobile menu open/close */
  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', toggleMenu);

  /* Close menu when a link is clicked */
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* Close menu on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu();
    }
  });
})();


/* ───────────────────────────────────────────────────────────────────
   3. SCROLL PROGRESS BAR
   Updates width% to match scroll depth
   ─────────────────────────────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ───────────────────────────────────────────────────────────────────
   4. SCROLL REVEAL
   Observes elements with .reveal-up class and adds .in-view
   when they enter the viewport
   ─────────────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();


/* ───────────────────────────────────────────────────────────────────
   5. ANIMATED COUNTERS (About section stats)
   ✏️ EDIT: Change data-target values in HTML to change numbers
   ─────────────────────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.about__stat-num');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600; // ms
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();


/* ───────────────────────────────────────────────────────────────────
   6. BACK TO TOP BUTTON
   ─────────────────────────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ───────────────────────────────────────────────────────────────────
   7. GSAP ENHANCED ANIMATIONS
   Adds richer motion to hero and project cards using GSAP + ScrollTrigger
   ─────────────────────────────────────────────────────────────────── */
(function initGSAP() {
  // Guard: only run if GSAP is loaded
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── Hero parallax on the grid background ── */
  gsap.to('.hero__grid', {
    yPercent: -25,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  /* ── Hero orbs gentle float ── */
  gsap.to('.hero__orb--1', {
    y: -60, x: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  gsap.to('.hero__orb--2', {
    y: -40, x: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2
    }
  });

  /* ── Project cards stagger on scroll ── */
  const cards = document.querySelectorAll('.project-card');
  if (cards.length) {
    gsap.fromTo(cards, {
      opacity: 0,
      y: 50,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects__grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* ── Skill tags stagger ── */
  const skillGroups = document.querySelectorAll('.skills__group');
  skillGroups.forEach(group => {
    const tags = group.querySelectorAll('.skill-tag');
    gsap.fromTo(tags, {
      opacity: 0,
      y: 20,
      scale: 0.9
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: group,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* ── Contact section: heading character reveal ── */
  const contactHeading = document.querySelector('.contact__heading');
  if (contactHeading) {
    gsap.fromTo(contactHeading, {
      opacity: 0,
      y: 60
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: contactHeading,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* ── About heading ── */
  const aboutHeading = document.querySelector('.about__heading');
  if (aboutHeading) {
    gsap.fromTo(aboutHeading, {
      opacity: 0,
      x: -40
    }, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: aboutHeading,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

})();


/* ───────────────────────────────────────────────────────────────────
   8. SMOOTH SCROLL FOR ANCHOR LINKS
   Adds smooth scrolling with offset for the fixed nav
   ─────────────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  const NAV_HEIGHT = 80; // px — adjust to match nav height

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


/* ───────────────────────────────────────────────────────────────────
   9. SKILL TAG — MAGNETIC HOVER EFFECT (subtle)
   Tags gently follow the cursor when hovered
   ─────────────────────────────────────────────────────────────────── */
(function initMagneticTags() {
  if (window.matchMedia('(hover: none)').matches) return;

  const tags = document.querySelectorAll('.skill-tag');
  tags.forEach(tag => {
    tag.addEventListener('mousemove', (e) => {
      const rect   = tag.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.18;
      const dy     = (e.clientY - cy) * 0.18;
      tag.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = 'translate(0, 0)';
    });
  });
})();


/* ───────────────────────────────────────────────────────────────────
   HOW TO ADD A NEW PROJECT
   ───────────────────────────────────────────────────────────────────
   1. Open index.html
   2. Find the comment: "ADD NEW PROJECT: Copy the block above"
   3. Paste the project-card block and fill in your details:
      - data-index: next number (04, 05, etc.)
      - project-card__number: matching number
      - project-card__tags > span: tools used
      - project-card__title: project name
      - project-card__desc: description
      - btn--primary href: your live demo URL
      - btn--ghost href: your GitHub URL
      - (Optional) Replace .project-card__placeholder with:
        <img src="assets/your-screenshot.jpg" alt="Project Name">
   ─────────────────────────────────────────────────────────────────── */
