/* =========================================================
   Made by Saige™ — How it works page
   1. Saige's to-do list gets crossed off as you scroll past it
   2. The "Which one is for me?" quiz
   Works on its own (no animation library needed).
   ========================================================= */
(function () {
  /* ---------- 1. crossing off the to-do list ---------- */
  const items = [...document.querySelectorAll('.todo-long li')];
  const yours = [...document.querySelectorAll('.todo-short li')];
  const countEl = document.querySelector('.count-done');
  let queued = false;

  const update = () => {
    queued = false;
    const line = window.innerHeight * 0.6;
    let done = 0;
    items.forEach((li) => {
      const isDone = li.getBoundingClientRect().top < line;
      li.classList.toggle('done', isDone);
      if (isDone) done++;
    });
    if (countEl) countEl.textContent = done;
    // your three items tick off at the end of my list
    const share = done / items.length;
    yours.forEach((li, i) => li.classList.toggle('done', share >= [0.34, 0.67, 1][i]));
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  if (items.length) {
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  }

  /* ---------- 2. the quiz ---------- */
  const quiz = document.querySelector('.quiz');
  if (!quiz) return;
  const answers = {};
  const result = quiz.querySelector('.quiz-result');

  const results = {
    regular: {
      name: 'Like a Regular',
      why: "Someone's coming to New York, and they deserve better than a tourist list. Their days, planned around their taste, with the hard-to-get tables booked.",
      pick: 'Like a Regular'
    },
    course: {
      name: 'Course by Course',
      why: 'You like a night that keeps surprising you. Drinks in one room, dinner in another, the last toast somewhere you would never have found.',
      pick: 'Course by Course'
    },
    table: {
      name: 'Course by Course, one perfect table',
      why: 'You want the celebration without the moving around. One beautiful room, a menu written around the guest of honour, and nobody checks the time.',
      pick: 'Course by Course'
    }
  };

  const show = () => {
    if (!answers.occasion || !answers.pace || !answers.size) return;
    let key = answers.pace === 'stay' ? 'table' : 'course';
    if (answers.occasion === 'visit') key = 'regular';
    const r = results[key];
    result.querySelector('.quiz-name').textContent = r.name;
    result.querySelector('.quiz-why').textContent = r.why;
    result.querySelector('.quiz-go').href = 'index.html?pick=' + encodeURIComponent(r.pick) + '#book';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  quiz.querySelectorAll('.quiz-q').forEach((q) => {
    q.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      q.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      answers[q.dataset.q] = b.dataset.a;
      show();
    }));
    q.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
  });

  quiz.querySelector('.quiz-reset').addEventListener('click', () => {
    Object.keys(answers).forEach((k) => delete answers[k]);
    quiz.querySelectorAll('.quiz-q button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    result.hidden = true;
    quiz.querySelector('.quiz-q button').focus();
  });
})();
