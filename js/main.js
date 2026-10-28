/* =========================================================
   Made by Saige™ — scroll effects
   GSAP + ScrollTrigger (zooms, pinning, sideways scroll) and Lenis (smooth scrolling)
   live in js/vendor, so nothing depends on outside servers.
   The effects only switch on once those scripts are confirmed loaded; otherwise
   (or for visitors who prefer reduced motion) the page shows a calm static version.
   ========================================================= */

(function () {
  const root = document.documentElement;

  // footer year + "thank you" message after the contact form redirects back
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  if (location.hash === '#thanks') {
    const t = document.getElementById('thanks');
    if (t) t.hidden = false;
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  root.classList.add('motion');
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scrolling ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // menu links glide to their section
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = id === '#top' ? document.body : document.querySelector(id);
      if (!el || id === '#main') return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : el, { duration: 1.6 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- split the statement into words ---------- */
  const st = document.querySelector('.statement-text');
  if (st) {
    st.setAttribute('aria-label', st.textContent.trim());
    st.innerHTML = st.textContent.trim().split(/\s+/)
      .map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
  }

  const navMark = document.querySelector('.nav-mark');
  const mm = gsap.matchMedia();

  mm.add({ desktop: '(min-width: 861px)', mobile: '(max-width: 860px)' }, (ctx) => {
    const { desktop } = ctx.conditions;

    /* ---------- 1. hero: zoom out of the portrait, title becomes the logo ---------- */
    gsap.set(navMark, { autoAlpha: 0, y: -8 });
    const win = document.querySelector('.hero-window');
    const hero = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: desktop ? '+=120%' : 'bottom top',
        scrub: true,
        pin: desktop,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    hero
      .fromTo('.hero-window img', { scale: 1.6 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .to('.hero-title', { y: desktop ? -80 : -40, autoAlpha: 0, ease: 'power1.in', duration: 0.55 }, 0.4)
      .to(navMark, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.7);
    if (desktop) {
      hero.to(win, {
        scale: 1.08, ease: 'power1.inOut', duration: 1,
        x: () => {
          const r = win.getBoundingClientRect();
          const cur = gsap.getProperty(win, 'x');
          return window.innerWidth / 2 - (r.left - cur + r.width / 2);
        }
      }, 0);
    }

    /* ---------- 2. statement: zooms in while the words light up ---------- */
    gsap.timeline({
      scrollTrigger: {
        trigger: '.statement',
        start: desktop ? 'top top' : 'top 75%',
        end: desktop ? '+=100%' : 'bottom 55%',
        scrub: true,
        pin: desktop
      }
    })
      .fromTo('.statement-text', { scale: 0.86, transformOrigin: 'left center' }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .fromTo('.statement-text .w', { opacity: 0.12 }, { opacity: 1, stagger: 0.05, ease: 'none', duration: 0.5 }, 0);

    /* ---------- 3. what I make: scroll down, cards move sideways and zoom in ---------- */
    if (desktop) {
      const track = document.querySelector('.make-track');
      const cards = gsap.utils.toArray('.card');
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const slide = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.make',
          start: 'top top',
          end: () => '+=' + dist() * 1.1,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true
        }
      });
      cards.forEach((card, i) => {
        if (i === 0) return;
        gsap.fromTo(card, { scale: 0.82 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left right', end: 'left 35%', scrub: true }
        });
      });
    }

    /* ---------- 4. moments: each photo opens up and zooms out ---------- */
    gsap.utils.toArray('.moment-frame').forEach((f) => {
      const img = f.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top bottom', end: 'center 55%', scrub: true } });
      tl.fromTo(f, { clipPath: 'inset(18% 14% 18% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0);
      if (img) tl.fromTo(img, { scale: 1.45 }, { scale: 1, ease: 'none' }, 0);
    });

    /* ---------- 5. New York: map draws itself, neighbourhoods light up ---------- */
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
        trigger: li, start: 'top 62%', end: 'bottom 62%',
        onToggle: (self) => { li.classList.toggle('on', self.isActive); if (pin) pin.classList.toggle('on', self.isActive); }
      });
    });

    /* ---------- 6. beyond New York: the title zooms out from huge to normal ---------- */
    gsap.timeline({
      scrollTrigger: {
        trigger: '.beyond',
        start: desktop ? 'top top' : 'top 80%',
        end: desktop ? '+=110%' : 'center 45%',
        scrub: true,
        pin: desktop
      }
    })
      .fromTo('.beyond-title', { scale: desktop ? 4.2 : 2.6 }, { scale: 1, ease: 'power2.out', duration: 1 }, 0)
      .fromTo('.beyond-text', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.65);

    /* ---------- 9. contact icons zoom in ---------- */
    gsap.fromTo('.icons-big .icon', { scale: 0.4, autoAlpha: 0 }, {
      scale: 1, autoAlpha: 1, stagger: 0.12, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.icons-big', start: 'top 92%', end: 'top 60%', scrub: true }
    });

    return () => gsap.set(navMark, { clearProps: 'all' });
  });

  /* ---------- page colour follows the section in view ----------
     Checks which section sits at the middle of the screen on every scroll,
     so the colour is right even after a jump (menu links, fast scrolling). */
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const themed = [...document.querySelectorAll('[data-theme]')];
  let current = null;
  const pickTheme = () => {
    const line = window.innerHeight * 0.55;
    const sec = themed.find((s) => { const r = s.getBoundingClientRect(); return r.top <= line && r.bottom > line; });
    if (!sec || sec === current) return;
    current = sec;
    const bg = sec.style.getPropertyValue('--sbg').trim();
    const fg = sec.style.getPropertyValue('--sfg').trim();
    gsap.to(root, { '--bg': bg, '--fg': fg, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
    if (themeMeta) themeMeta.setAttribute('content', bg);
  };
  // runs one frame after each scroll update, once pinned sections have settled into place
  let queued = false;
  const queuePick = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; pickTheme(); }); };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: queuePick, onRefresh: queuePick });
  pickTheme();

  /* ---------- menu bar background + floating WhatsApp button after the hero ---------- */
  ScrollTrigger.create({ trigger: '.statement', start: 'top 80px', end: 'max', toggleClass: { targets: '.nav', className: 'solid' } });
  ScrollTrigger.create({ trigger: '.statement', start: 'top 60%', endTrigger: '.contact', end: 'top 70%', toggleClass: { targets: '.float-wa', className: 'show' } });

  // recalculate once fonts and images have loaded
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
