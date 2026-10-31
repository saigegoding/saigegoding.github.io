/* =========================================================
   Made by Saige™ — past events page
   Filter chips + a pop-up with the photos and story of each event.
   Works on its own (no animation library needed).
   ========================================================= */
(function () {
  const cards = [...document.querySelectorAll('.pf-card')];
  const chips = [...document.querySelectorAll('.chip')];
  const dialog = document.querySelector('.case-dialog');
  const media = dialog.querySelector('.cd-media');
  const body = dialog.querySelector('.cd-body');

  /* ---------- filters ---------- */
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => { const on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on); });
    cards.forEach((card) => { card.hidden = !(f === 'all' || card.dataset.cat === f); });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));

  /* ---------- open / close ---------- */
  const open = (id) => {
    const src = document.getElementById('case-' + id);
    if (!src) return;
    // photos: all shown at once, laid out to fit the panel
    const imgs = [...src.querySelectorAll('.case-gallery img')];
    media.innerHTML = '';
    imgs.forEach((img) => {
      const c = img.cloneNode(true);
      c.src = c.getAttribute('src').replace('w=900', 'w=1200');
      c.loading = 'eager';
      const fig = document.createElement('figure');
      fig.appendChild(c);
      media.appendChild(fig);
    });
    media.dataset.count = Math.min(imgs.length, 3);
    // story
    body.innerHTML = src.querySelector('.case-body').innerHTML;
    if (window.__lenis) window.__lenis.stop();
    dialog.showModal();
    body.scrollTop = 0;
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
