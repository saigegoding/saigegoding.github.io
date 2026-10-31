/* =========================================================
   Made by Saige™ — past events page
   Filter chips + a pop-up with the photos and story of each event.
   Works on its own (no animation library needed).
   ========================================================= */
(function () {
  const cards = [...document.querySelectorAll('.pf-card')];
  const chips = [...document.querySelectorAll('.chip')];
  const dialog = document.querySelector('.case-dialog');
  const slides = dialog.querySelector('.cd-slides');
  const dots = dialog.querySelector('.cd-dots');
  const body = dialog.querySelector('.cd-body');
  const prev = dialog.querySelector('.cd-prev');
  const next = dialog.querySelector('.cd-next');
  let index = 0, count = 0;

  /* ---------- filters ---------- */
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => { const on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on); });
    cards.forEach((card) => { card.hidden = !(f === 'all' || card.dataset.cat === f); });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));

  /* ---------- photo browsing inside the pop-up ---------- */
  const show = (i) => {
    if (!count) return;
    index = (i + count) % count;
    [...slides.children].forEach((el, n) => el.classList.toggle('is-on', n === index));
    [...dots.children].forEach((el, n) => { el.classList.toggle('is-on', n === index); el.setAttribute('aria-selected', n === index); });
  };
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  // swipe on phones
  let startX = null;
  slides.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  slides.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  /* ---------- open / close ---------- */
  const open = (id) => {
    const src = document.getElementById('case-' + id);
    if (!src) return;
    // photos: bigger versions for the large panel
    const imgs = [...src.querySelectorAll('.case-gallery img')];
    slides.innerHTML = '';
    dots.innerHTML = '';
    imgs.forEach((img, n) => {
      const c = img.cloneNode(true);
      c.src = c.getAttribute('src').replace('w=900', 'w=1600');
      c.loading = n === 0 ? 'eager' : 'lazy';
      const fig = document.createElement('figure');
      fig.appendChild(c);
      slides.appendChild(fig);
      const d = document.createElement('button');
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Photo ' + (n + 1));
      d.addEventListener('click', () => show(n));
      dots.appendChild(d);
    });
    count = imgs.length;
    dialog.classList.toggle('single', count < 2);
    // story
    body.innerHTML = src.querySelector('.case-body').innerHTML;
    if (window.__lenis) window.__lenis.stop();
    dialog.showModal();
    body.scrollTop = 0;
    show(0);
    history.replaceState(null, '', '#' + id);
  };
  const close = () => dialog.close();
  dialog.addEventListener('close', () => {
    if (window.__lenis) window.__lenis.start();
    history.replaceState(null, '', location.pathname);
  });
  cards.forEach((card) => card.addEventListener('click', () => open(card.dataset.case)));
  dialog.querySelector('.case-close').addEventListener('click', close);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); }); // click outside the panel

  // links like portfolio.html#rhute open that event straight away
  const openFromHash = () => { const id = location.hash.slice(1); if (id && !dialog.open) open(id); };
  if (document.readyState === 'complete') openFromHash(); else window.addEventListener('load', openFromHash);
  window.addEventListener('hashchange', openFromHash);
})();
