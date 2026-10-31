/* =========================================================
   Made by Saige™ — page effects (shared by both pages)
   GSAP + ScrollTrigger for scroll effects, Lenis for smooth scrolling.
   If those fail to load, or the visitor prefers reduced motion,
   the page shows everything without effects.
   ========================================================= */

(function () {
  const root = document.documentElement;

  // footer year + "thank you" message after the form redirects back
  document.querySelectorAll('#year').forEach((y) => { y.textContent = new Date().getFullYear(); });
  if (location.hash === '#thanks') {
    const t = document.getElementById('thanks');
    if (t) t.hidden = false;
  }

  // "Plan my celebration" / "Plan my trip" pre-select the right option in the form
  const select = document.getElementById('f-what');
  document.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => {
    if (select) select.value = b.dataset.pick;
  }));

  const motion = root.classList.contains('motion');
  if (!motion || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove('motion');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scrolling ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // same-page links glide to their section
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = id === '#top' ? document.body : document.querySelector(id);
      if (!el || id === '#main') return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : el, { duration: 1.4 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- the signature moment: the invitation opens by itself ---------- */
  if (document.querySelector('.envelope')) {
    gsap.timeline({ delay: 0.6 })
      .to('.seal', { scale: 1.2, rotate: -18, autoAlpha: 0, duration: 0.45, ease: 'power1.in' })
      .to('.env-flap', { rotateX: 180, duration: 0.7, ease: 'power2.inOut' }, '-=0.15')
      .set('.env-flap', { zIndex: 1 }, '-=0.3')
      .to('.invite', { yPercent: -50, duration: 0.9, ease: 'back.out(1.3)' }, '-=0.15')
      .from('.confetti i', { scale: 0, y: 30, autoAlpha: 0, stagger: 0.05, duration: 0.5, ease: 'back.out(2)' }, '-=0.6');
  }

  /* ---------- photos zoom out gently as they scroll in ---------- */
  gsap.utils.toArray('.offer-img img, .teaser-img img, .about-photo img').forEach((img) => {
    gsap.fromTo(img, { scale: 1.22 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'center 55%', scrub: true }
    });
  });

  /* ---------- page colour follows the section in view ---------- */
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const themed = [...document.querySelectorAll('[data-theme]')];
  let current = null, queued = false;
  const pickTheme = () => {
    queued = false;
    const line = window.innerHeight * 0.55;
    const sec = themed.find((s) => { const r = s.getBoundingClientRect(); return r.top <= line && r.bottom > line; });
    if (!sec || sec === current) return;
    current = sec;
    gsap.to(root, { '--bg': sec.dataset.bg, '--fg': sec.dataset.fg, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
    if (themeMeta) themeMeta.setAttribute('content', sec.dataset.bg);
  };
  const queuePick = () => { if (!queued) { queued = true; requestAnimationFrame(pickTheme); } };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: queuePick, onRefresh: queuePick });

  /* ---------- menu bar background once scrolled; phone booking bar after the first screen ---------- */
  ScrollTrigger.create({ start: 80, end: 'max', toggleClass: { targets: '.nav', className: 'solid' } });
  const book = document.querySelector('#book');
  ScrollTrigger.create({
    start: () => window.innerHeight * 0.6,
    end: () => (book ? book.offsetTop - window.innerHeight * 0.6 : 'max'),
    toggleClass: { targets: '.sticky-cta', className: 'show' },
    invalidateOnRefresh: true
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
