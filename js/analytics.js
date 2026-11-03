/* =========================================================
   Made by Saige™ — Google Analytics 4
   ---------------------------------------------------------
   STEP 1: paste your Measurement ID below (it looks like G-AB12CD34EF).
   Until you do, this file does nothing.
   ========================================================= */
const GA_MEASUREMENT_ID = 'G-MT9BZE927V';

(function () {
  if (!/^G-[A-Z0-9]{6,}$/.test(GA_MEASUREMENT_ID) || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

  /* ---------- load Google Analytics ---------- */
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  // send one event; "beacon" makes sure it still arrives when the visitor leaves the page right after
  const track = (name, params) => gtag('event', name, Object.assign({ transport_type: 'beacon' }, params || {}));
  const page = location.pathname.split('/').pop() || 'index.html';
  const text = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);

  /* ---------- what visitors interact with ----------
     One listener for all clicks, so it also works for things added to the page later. */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a, button');
    if (!a || a.type === 'submit') return; // form sends are counted as generate_lead below
    const href = a.getAttribute('href') || '';

    // contact: WhatsApp, email, Instagram
    if (href.includes('wa.me')) return track('contact_click', { method: 'whatsapp', location: a.className.includes('sticky') ? 'phone_bar' : page });
    if (href.startsWith('mailto:')) return track('contact_click', { method: 'email', location: page });
    if (href.includes('instagram.com')) return track('contact_click', { method: 'instagram', location: page });

    // the two signatures: "Plan my celebration" / "Plan my trip" / "I want one of these"
    if (a.dataset.pick) return track('select_offer', { offer: a.dataset.pick, button: text(a), location: page });

    // past events: which event people open, which filter they use
    if (a.classList.contains('pf-card')) {
      const t = a.querySelector('.pf-title');
      return track('view_past_event', { event_id: a.dataset.case, event_title: t ? text(t) : a.dataset.case });
    }
    if (a.classList.contains('chip')) return track('filter_events', { filter: a.dataset.filter });

    // quiz answers
    if (a.closest('.quiz-opts')) {
      const q = a.closest('.quiz-q');
      return track('quiz_answer', { question: q ? q.dataset.q : '', answer: a.dataset.a });
    }

    // main buttons: Pick your night, Plan my event, See past events, menu links
    if (a.classList.contains('btn') || a.classList.contains('nav-cta') || a.closest('.nav-links') || a.closest('.jump')) {
      return track('cta_click', { button: text(a), target: href, location: page });
    }
  });

  /* ---------- quiz result shown ---------- */
  const result = document.querySelector('.quiz-result');
  if (result) {
    new MutationObserver(() => {
      if (!result.hidden) {
        const n = result.querySelector('.quiz-name');
        track('quiz_complete', { result: n ? text(n) : '' });
      }
    }).observe(result, { attributes: true, attributeFilter: ['hidden'] });
  }

  /* ---------- questions opened (How it works) ---------- */
  document.querySelectorAll('.faq details').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) track('faq_open', { question: text(d.querySelector('summary')) });
  }));

  /* ---------- booking form sent: the most important one ---------- */
  document.querySelectorAll('form[action*="formsubmit"]').forEach((f) => f.addEventListener('submit', () => {
    const sel = f.querySelector('select[name="signature"]');
    track('generate_lead', { offer: sel ? sel.value : '', form: 'booking' });
  }));
})();
