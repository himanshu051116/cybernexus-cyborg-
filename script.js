const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// Scroll reveal
const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((el) => {
  const delay = el.dataset.delay || 0;
  el.style.setProperty('--delay', `${delay}ms`);
});

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  revealItems.forEach((el) => revealObserver.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add('in-view'));
}

// Metric counters
const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.counter);
    const duration = prefersReducedMotion ? 1 : 950;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach((counter) => counterObserver.observe(counter));

// Subtle pointer illumination
const cursorGlow = document.querySelector('.cursor-glow');
if (!prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.style.opacity = '1';
  }, { passive: true });
}

// Lightweight card tilt
if (!prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-py * 4}deg) rotateY(${px * 5}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

// Interactive CTA terminal sequence
const initializeBtn = document.getElementById('initializeBtn');
const terminalMessage = document.getElementById('terminalMessage');
let sequenceRunning = false;

initializeBtn?.addEventListener('click', () => {
  if (sequenceRunning) return;
  sequenceRunning = true;
  const lines = [
    '> handshake.request()',
    '> neural_link: verified',
    '> bio_sync: 96.7%',
    '> CONNECTION ESTABLISHED // WELCOME, OPERATOR'
  ];
  let index = 0;
  terminalMessage.textContent = lines[index];
  const timer = setInterval(() => {
    index += 1;
    if (index >= lines.length) {
      clearInterval(timer);
      sequenceRunning = false;
      return;
    }
    terminalMessage.textContent = lines[index];
  }, 650);
});
