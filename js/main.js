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

    /* ---------- 1. hero: the invitation opens ----------
       seal lifts, flap opens, the card slides out, then grows until it fills the screen */
    const flap = document.querySelector('.env-flap');
    const invite = document.querySelector('.invite');
    const cover = () => {
      // how much the card must grow to cover the whole screen
      const r = invite.getBoundingClientRect();
      const s = gsap.getProperty(invite, 'scale') || 1;
      return Math.max(window.innerWidth / (r.width / s), window.innerHeight / (r.height / s)) * 1.15;
    };
    gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=170%',
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })
      .to('.hero-scroll', { autoAlpha: 0, duration: 0.1 }, 0)
      .to('.place-a', { x: desktop ? -120 : -40, y: -60, rotate: -16, autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, 0.04)
      .to('.place-b', { x: desktop ? 120 : 40, y: -40, rotate: 15, autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, 0.06)
      .to('.confetti i', { y: (i) => -(120 + (i % 4) * 90), rotate: (i) => (i % 2 ? 90 : -120), autoAlpha: 0, duration: 0.5, ease: 'none', stagger: 0.01 }, 0)
      .to('.seal', { scale: 1.25, autoAlpha: 0, rotate: -18, duration: 0.18, ease: 'power1.in' }, 0)
      .to(flap, { rotateX: 180, duration: 0.25, ease: 'power1.inOut' }, 0.08)
      .set(flap, { zIndex: 1 }, 0.22)
      .to(invite, { yPercent: -56, duration: 0.3, ease: 'power2.out' }, 0.3)
      .to('.hero-kicker, .hero-line', { autoAlpha: 0, duration: 0.15 }, 0.55)
      .to('.env-back, .env-front, .env-flap', { yPercent: 70, autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, 0.62)
      .to(invite, { yPercent: 0, y: () => window.innerHeight / 2 - (document.querySelector('.envelope').getBoundingClientRect().top + document.querySelector('.envelope').offsetHeight / 2), scale: cover, boxShadow: 'none', duration: 0.38, ease: 'power2.in' }, 0.62)
      .to('.invite > *', { autoAlpha: 0, duration: 0.15 }, 0.72);

    /* ---------- 2. statement: words light up one by one ---------- */
    gsap.fromTo('.statement-text .w', { opacity: 0.22 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: {
        trigger: '.statement',
        start: desktop ? 'top top' : 'top 70%',
        end: desktop ? '+=90%' : 'bottom 60%',
        scrub: true,
        pin: desktop
      }
    });

    /* ---------- 3. Course by Course: the evening moves sideways, each photo zooms out ---------- */
    if (desktop) {
      const track = document.querySelector('.course-track');
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const slide = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.course',
          start: 'top top',
          end: () => '+=' + dist(),
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true
        }
      });
      gsap.utils.toArray('.panel-stop').forEach((panel) => {
        gsap.fromTo(panel.querySelector('img'), { scale: 1.35 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left right', end: 'center center', scrub: true }
        });
      });
    } else {
      gsap.utils.toArray('.stop-photo img').forEach((img) => {
        gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'center center', scrub: true } });
      });
    }

    /* ---------- 4. Like a Regular: photos drift, map draws itself, neighbourhoods light up ---------- */
    gsap.fromTo('.reg-photo-a img', { yPercent: -6, scale: 1.14 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.reg-intro', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.reg-photo-b', { y: 70 }, { y: -70, ease: 'none', scrollTrigger: { trigger: '.reg-intro', start: 'top bottom', end: 'bottom top', scrub: true } });

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

    /* ---------- 5. scenes: each photo opens up and zooms out ---------- */
    gsap.utils.toArray('.scene-frame').forEach((f) => {
      gsap.timeline({ scrollTrigger: { trigger: f, start: 'top bottom', end: 'center 60%', scrub: true } })
        .fromTo(f, { clipPath: 'inset(16% 12% 16% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
        .fromTo(f.querySelector('img'), { scale: 1.4 }, { scale: 1, ease: 'none' }, 0);
    });

    /* ---------- 7. about: portrait settles in ---------- */
    gsap.fromTo('.about-photo img', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'center center', scrub: true } });

    /* ---------- 8. contact icons zoom in ---------- */
    gsap.fromTo('.icons .icon', { scale: 0.4, autoAlpha: 0 }, {
      scale: 1, autoAlpha: 1, stagger: 0.12, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.icons', start: 'top 92%', end: 'top 62%', scrub: true }
    });
  });

  /* ---------- day to night: the page colour follows the section in view ----------
     Checks which section sits at the middle of the screen (one frame after each scroll update,
     once pinned sections have settled), so the colour is right even after a jump. */
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const themed = [...document.querySelectorAll('[data-theme]')];
  let current = null, queued = false;
  const pickTheme = () => {
    queued = false;
    const line = window.innerHeight * 0.55;
    const sec = themed.find((s) => { const r = s.getBoundingClientRect(); return r.top <= line && r.bottom > line; });
    if (!sec || sec === current) return;
    current = sec;
    gsap.to(root, { '--bg': sec.dataset.bg, '--fg': sec.dataset.fg, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
    if (themeMeta) themeMeta.setAttribute('content', sec.dataset.bg);
  };
  const queuePick = () => { if (!queued) { queued = true; requestAnimationFrame(pickTheme); } };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: queuePick, onRefresh: queuePick });

  /* ---------- menu bar gets a soft background once past the hero ---------- */
  ScrollTrigger.create({ trigger: '.statement', start: 'top 80px', end: 'max', toggleClass: { targets: '.nav', className: 'solid' } });

  // recalculate once fonts and images have loaded
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
