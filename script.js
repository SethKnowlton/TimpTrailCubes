(function () {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);
  const transitionKey = 'timpPageTransition';

  if (sessionStorage.getItem(transitionKey) === '1') {
    overlay.classList.add('is-active');
    sessionStorage.removeItem(transitionKey);
    window.setTimeout(() => overlay.classList.remove('is-active'), 360);
  }

  const goTo = (href) => {
    sessionStorage.setItem(transitionKey, '1');
    overlay.classList.add('is-active');
    window.location.href = href;
  };

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || /^https?:\/\//i.test(href)) return;
    const targetPath = href.split('#')[0];
    if (!targetPath || targetPath === window.location.pathname.split('/').pop()) return;
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      goTo(href);
    });
  });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const form = document.getElementById('notify-form');
  const success = document.getElementById('formSuccess');
  if (form && success) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.hidden = true;
      success.hidden = false;
    });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => io.observe(el));
  }

  const svg = document.getElementById('mountain-svg');
  if (svg) {
    const NS = 'http://www.w3.org/2000/svg';
    const heights = [2, 4, 3, 6, 9, 7, 5, 8, 4, 2];
    const colW = 42;
    const cubeW = 40;
    const cubeStepY = 40;
    const baseY = 300;
    const maxH = Math.max(...heights);

    const hexToRgb = (hex) => {
      const h = hex.replace('#', '');
      return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
    };

    const rgbToHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

    const mix = (hex1, hex2, t) => {
      const a = hexToRgb(hex1);
      const b = hexToRgb(hex2);
      return rgbToHex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
    };

    const shade = (hex, amt) => (amt >= 0 ? mix(hex, '#fbf7ef', amt) : mix(hex, '#2b2320', -amt));
    const terracotta = '#c1613d';
    const plum = '#5c3a5c';

    let idx = 0;
    heights.forEach((h, col) => {
      const x = col * colW + 10;
      for (let r = 0; r < h; r += 1) {
        const y = baseY - r * cubeStepY - cubeW * 1.5;
        const t = maxH > 1 ? r / (maxH - 1) : 0;
        const base = mix(terracotta, plum, t);
        const top = shade(base, 0.4);
        const left = base;
        const right = shade(base, -0.35);

        const topPts = `${x + 20},${y} ${x + 40},${y + 11.5} ${x + 20},${y + 23} ${x},${y + 11.5}`;
        const leftPts = `${x},${y + 11.5} ${x + 20},${y + 23} ${x + 20},${y + 63} ${x},${y + 51.5}`;
        const rightPts = `${x + 40},${y + 11.5} ${x + 20},${y + 23} ${x + 20},${y + 63} ${x + 40},${y + 51.5}`;

        [[topPts, top], [leftPts, left], [rightPts, right]].forEach(([pts, fill]) => {
          const poly = document.createElementNS(NS, 'polygon');
          poly.setAttribute('points', pts);
          poly.setAttribute('fill', fill);
          poly.setAttribute('stroke', '#f5efe4');
          poly.setAttribute('stroke-width', '1.4');
          poly.style.opacity = '0';
          poly.style.transition = 'opacity 0.5s ease';
          poly.style.transitionDelay = `${idx * 14}ms`;
          svg.appendChild(poly);
          requestAnimationFrame(() => requestAnimationFrame(() => {
            poly.style.opacity = '1';
          }));
        });
        idx += 1;
      }
    });
  }
})();
