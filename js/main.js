/* =========================================================
   Made by Saige™ — scroll effects
   Uses GSAP + ScrollTrigger for scroll animation and Lenis for smooth scrolling.
   If those libraries fail to load, or the visitor prefers reduced motion,
   the page simply shows everything without effects.
   ========================================================= */

(function () {
  const root = document.documentElement;

  // Footer year + "thank you" message after the contact form redirects back
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  if (location.hash === '#thanks') {
    const t = document.getElementById('thanks');
    if (t) { t.hidden = false; }
  }

  const motion = root.classList.contains('motion');
  if (!motion || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove('motion');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scrolling ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // menu links glide to their section
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = id === '#top' ? document.body : document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : el, { duration: 1.6 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- split the statement into words ---------- */
  const st = document.querySelector('.statement-text');
  if (st) {
    st.setAttribute('aria-label', st.textContent);
    st.innerHTML = st.textContent.trim().split(/\s+/)
      .map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
  }

  const mm = gsap.matchMedia();

  mm.add({ desktop: '(min-width: 861px)', mobile: '(max-width: 860px)' }, (ctx) => {
    const { desktop } = ctx.conditions;

    /* ---------- 1. hero: zoom out from the sun, title becomes the logo ---------- */
    const navMark = document.querySelector('.nav-mark');
    gsap.set(navMark, { autoAlpha: 0, y: -8 });

    const hero = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: desktop ? '+=110%' : 'bottom top',
        scrub: true,
        pin: desktop,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    hero
      .fromTo('.hero-window img', { scale: 1.45 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .to('.hero-sky', { opacity: 0, ease: 'none', duration: 1 }, 0)
      .to('.hero-title', { y: desktop ? -80 : -40, scale: desktop ? 0.9 : 1, transformOrigin: 'left top', autoAlpha: 0, ease: 'power1.in', duration: 0.6 }, 0.35)
      .to('.hero-scroll', { autoAlpha: 0, duration: 0.15 }, 0)
      .to(navMark, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.7);
    if (desktop) {
      const win = document.querySelector('.hero-window');
      hero.to(win, {
        scale: 1.06, ease: 'power1.inOut', duration: 1,
        x: () => { const r = win.getBoundingClientRect(); const cur = gsap.getProperty(win, 'x'); return window.innerWidth / 2 - (r.left - cur + r.width / 2); }
      }, 0);
    }

    /* ---------- 2. statement: words light up one by one ---------- */
    gsap.fromTo('.statement-text .w', { opacity: 0.12 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: {
        trigger: '.statement',
        start: desktop ? 'top top' : 'top 70%',
        end: desktop ? '+=90%' : 'bottom 60%',
        scrub: true,
        pin: desktop
      }
    });

    /* ---------- 3. what I make: vertical scroll becomes horizontal ---------- */
    if (desktop) {
      const track = document.querySelector('.make-track');
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.make',
          start: 'top top',
          end: () => '+=' + dist(),
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true
        }
      });
    }

    /* ---------- 4. New York: photos drift, map draws itself, neighbourhoods light up ---------- */
    gsap.fromTo('.ny-photo-a img', { yPercent: -6, scale: 1.12 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.ny-intro', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.ny-photo-b', { y: 60 }, { y: -60, ease: 'none', scrollTrigger: { trigger: '.ny-intro', start: 'top bottom', end: 'bottom top', scrub: true } });

    document.querySelectorAll('.ny-map .land, .ny-map .park').forEach((p) => {
      const len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: '.ny-map-wrap', start: 'top 85%', end: 'top 15%', scrub: true }
      });
    });

    document.querySelectorAll('.ny-list li').forEach((li) => {
      const pin = document.querySelector(`.ny-map circle[data-pin="${li.dataset.pin}"]`);
      ScrollTrigger.create({
        trigger: li,
        start: 'top 62%',
        end: 'bottom 62%',
        onToggle: (self) => {
          li.classList.toggle('on', self.isActive);
          if (pin) pin.classList.toggle('on', self.isActive);
        }
      });
    });

    /* ---------- 5. beyond New York: the window opens up ---------- */
    gsap.timeline({ scrollTrigger: { trigger: '.beyond', start: 'top bottom', end: 'center center', scrub: true } })
      .fromTo('.beyond-window', { scale: 0.7 }, { scale: 1, ease: 'none' }, 0)
      .fromTo('.beyond-window img', { scale: 1.5 }, { scale: 1, ease: 'none' }, 0);
    gsap.fromTo('.beyond-small', { y: 80 }, { y: -80, ease: 'none', scrollTrigger: { trigger: '.beyond', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* ---------- 6. brand names slide with the scroll ---------- */
    gsap.fromTo('.marquee-row', { xPercent: 0 }, { xPercent: -50, ease: 'none', scrollTrigger: { trigger: '.been', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* ---------- 8. about: portrait settles in ---------- */
    gsap.fromTo('.about-photo img', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'center center', scrub: true } });

    return () => gsap.set(navMark, { clearProps: 'all' });
  });

  /* ---------- day to night: the page colour follows the section in view
     (created after the pinned sections so positions include their scroll length) ---------- */
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  document.querySelectorAll('[data-theme]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (!self.isActive) return;
        gsap.to(root, { '--bg': sec.dataset.bg, '--fg': sec.dataset.fg, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
        if (themeMeta) themeMeta.setAttribute('content', sec.dataset.bg);
      }
    });
  });

  /* ---------- menu bar gets a soft background once past the hero ---------- */
  ScrollTrigger.create({ trigger: '.statement', start: 'top 80px', end: 'max', toggleClass: { targets: '.nav', className: 'solid' } });

  // recalculate once fonts and images have loaded
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
