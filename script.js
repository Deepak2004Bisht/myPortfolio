/* ============================================================
   Portfolio JS — Data Analyst & MIS Executive
   ============================================================ */

// ---------- Loader ----------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader && loader.classList.add('hidden'), 500);
});

// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Sticky nav + scroll progress + back to top + active link ----------
const nav = document.getElementById('nav');
const progress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');
const navLinks = document.querySelectorAll('.nav-link');
const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (y / h) * 100 + '%';
  backTop.classList.toggle('show', y > 500);

  // active nav
  let current = 0;
  sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= 120) current = i; });
  navLinks.forEach((l, i) => l.classList.toggle('active', i === current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Mobile menu ----------
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open'); navMenu.classList.remove('open');
}));

// ---------- Theme toggle ----------
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') document.body.classList.add('light');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});
if (savedTheme === 'light') themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';

// ---------- Typing animation ----------
const typedEl = document.getElementById('typed');
const words = ['Data Analyst', 'MIS Executive', 'Power BI Developer', 'SQL Enthusiast', 'Advance Excel'];
let wIdx = 0, cIdx = 0, deleting = false;
function type() {
  const w = words[wIdx];
  typedEl.textContent = w.substring(0, cIdx);
  if (!deleting && cIdx < w.length) { cIdx++; setTimeout(type, 90); }
  else if (deleting && cIdx > 0) { cIdx--; setTimeout(type, 45); }
  else {
    if (!deleting) { deleting = true; setTimeout(type, 1600); }
    else { deleting = false; wIdx = (wIdx + 1) % words.length; setTimeout(type, 300); }
  }
}
type();

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Skill bars ----------
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const v = e.target.dataset.value;
      e.target.querySelector('.bar-fill').style.width = v + '%';
      barIO.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.bar').forEach(el => barIO.observe(el));

// ---------- Circle progress ----------
const circleIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const v = +e.target.dataset.value;
      const circ = 2 * Math.PI * 52; // 326.7
      const fg = e.target.querySelector('.circle-fg');
      fg.style.strokeDashoffset = circ - (circ * v / 100);
      const num = e.target.querySelector('.circle-num');
      let c = 0;
      const step = () => { c += Math.max(1, Math.round(v/40)); if (c >= v) c = v; num.textContent = c; if (c < v) requestAnimationFrame(step); };
      step();
      circleIO.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.circle').forEach(el => circleIO.observe(el));

// ---------- Counters ----------
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.dataset.target;
      const dur = 1600; const start = performance.now();
      const run = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * ease).toLocaleString();
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
      countIO.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count').forEach(el => countIO.observe(el));

// ---------- Contact form ----------
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
const submitBtn = document.getElementById('submitBtn');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  formMsg.textContent = ''; formMsg.className = 'form-msg';
  const data = Object.fromEntries(new FormData(form).entries());
  let ok = true;
  form.querySelectorAll('.field').forEach(f => f.classList.remove('error'));

  ['name', 'email', 'subject', 'message'].forEach(k => {
    if (!data[k] || !String(data[k]).trim()) {
      ok = false;
      form.querySelector(`[name="${k}"]`).closest('.field').classList.add('error');
    }
  });
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRe.test(data.email)) {
    ok = false;
    form.querySelector('[name="email"]').closest('.field').classList.add('error');
  }
  if (!ok) {
    formMsg.textContent = 'Please fix the highlighted fields.'; formMsg.classList.add('error');
    return;
  }

  submitBtn.classList.add('loading'); submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.classList.remove('loading'); submitBtn.disabled = false;
    formMsg.textContent = '✓ Message sent! I\'ll get back to you soon.';
    formMsg.classList.add('success');
    form.reset();
  }, 1400);
});

// ---------- Custom cursor ----------
const cd = document.getElementById('cursorDot');
const cr = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; cd.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
function animCursor() { rx += (mx - rx) * .18; ry += (my - ry) * .18; cr.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`; requestAnimationFrame(animCursor); }
animCursor();
document.querySelectorAll('a, button, .service-card, .project-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => cr.classList.add('grow'));
  el.addEventListener('mouseleave', () => cr.classList.remove('grow'));
});

// ---------- Parallax hero ----------
const orbs = document.querySelectorAll('.gradient-orb, .floating-shape');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - .5) * 20;
  const y = (e.clientY / window.innerHeight - .5) * 20;
  orbs.forEach((o, i) => {
    const f = (i + 1) * 0.4;
    o.style.translate = `${x * f}px ${y * f}px`;
  });
});

// ---------- Particles ----------
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  canvas.width = canvas.offsetWidth = canvas.parentElement.clientWidth;
  canvas.height = canvas.offsetHeight = canvas.parentElement.clientHeight;
}
function initParticles() {
  resizeCanvas();
  const count = Math.min(70, Math.floor(canvas.width * canvas.height / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + 0.6,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    a: Math.random() * .6 + .2,
  }));
}
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34,211,238,${p.a})`;
    ctx.fill();
    // connect close particles
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const d = Math.hypot(dx, dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(59,130,246,${.15 * (1 - d/110)})`;
        ctx.lineWidth = 1; ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
initParticles();
drawParticles();
window.addEventListener('resize', initParticles);
