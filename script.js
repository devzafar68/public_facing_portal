// Initialize Lucide icons
lucide.createIcons();

// ========================
// Header scroll behavior
// ========================
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ========================
// Mobile menu toggle
// ========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const iconMenu = hamburger.querySelector('.icon-menu');
const iconClose = hamburger.querySelector('.icon-close');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  iconMenu.style.display = isOpen ? 'none' : 'block';
  iconClose.style.display = isOpen ? 'block' : 'none';
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    iconMenu.style.display = 'block';
    iconClose.style.display = 'none';
  });
});

// ========================
// Dark mode toggle
// ========================
const toggles = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')];
let dark = false;

function updateThemeIcons() {
  document.querySelectorAll('.icon-moon').forEach(el => el.style.display = dark ? 'none' : 'block');
  document.querySelectorAll('.icon-sun').forEach(el => el.style.display = dark ? 'block' : 'none');
}

toggles.forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    updateThemeIcons();
  });
});

// ========================
// Scroll reveal
// ========================
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// ========================
// Animated counters
// ========================
const statValues = document.querySelectorAll('.stat-value');
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;
  statValues.forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) animateCounters();
  }, { threshold: 0.3 });
  statsObserver.observe(statsBar);
}

// ========================
// Mini Charts (Canvas)
// ========================
const TEAL = 'hsl(174, 62%, 40%)';
const ORANGE = 'hsl(25, 95%, 53%)';
const BLUE = 'hsl(213, 55%, 44%)';
const GRAY = 'hsl(215, 16%, 67%)';

document.querySelectorAll('.mini-chart').forEach(canvas => {
  const ctx = canvas.getContext('2d');
  const type = canvas.dataset.chart;
  const w = canvas.width;
  const h = canvas.height;

  if (type === 'bar') {
    const data = [42, 68, 85, 120];
    const max = Math.max(...data);
    const barW = w / (data.length * 2);
    data.forEach((v, i) => {
      const barH = (v / max) * (h - 10);
      ctx.fillStyle = TEAL;
      ctx.beginPath();
      const x = i * (barW * 2) + barW / 2;
      const y = h - barH;
      const r = 4;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, h);
      ctx.lineTo(x, h);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.fill();
    });
  }

  if (type === 'pie') {
    const data = [45, 30, 15, 10];
    const colors = [TEAL, ORANGE, BLUE, GRAY];
    const total = data.reduce((a, b) => a + b, 0);
    const cx = w / 2, cy = h / 2, outerR = 35, innerR = 20;
    let startAngle = -Math.PI / 2;
    data.forEach((v, i) => {
      const slice = (v / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
      ctx.arc(cx, cy, innerR, startAngle + slice, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      startAngle += slice;
    });
  }

  if (type === 'line') {
    const data = [30, 42, 55, 48, 72, 95];
    const max = Math.max(...data);
    const min = Math.min(...data);
    const stepX = w / (data.length - 1);
    ctx.beginPath();
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 2;
    data.forEach((v, i) => {
      const x = i * stepX;
      const y = h - ((v - min) / (max - min)) * (h - 16) - 8;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
});
