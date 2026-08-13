const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

const search = document.querySelector('[data-post-search]');
if (search) {
  const cards = [...document.querySelectorAll('[data-post-grid] .post-card')];
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    cards.forEach((card) => { card.hidden = query && !card.textContent.toLowerCase().includes(query); });
  });
}

document.querySelectorAll('[data-mail-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = form.dataset.subject || "JAMMIN' Trivia website inquiry";
    const lines = [...data.entries()].map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`);
    const mailto = `mailto:steve@myjammindjs.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n\n'))}`;
    const status = form.querySelector('[data-form-status]');
    if (status) status.textContent = "Your email app is opening with your request. If it doesn't open, call 800-445-1204.";
    window.location.href = mailto;
  });
});
