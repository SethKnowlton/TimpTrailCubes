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
      const email = form.querySelector('input[type="email"]')?.value?.trim();
      if (email) {
        const iframe = document.getElementById('early-access-iframe');
        const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfeDyH7NZkZVsuk_cM3lHuc6BqyBCorw8DBZTgqYloHPkEe4w/viewform?embedded=true&entry.615642036=${encodeURIComponent(email)}`;
        if (iframe) {
          iframe.src = formUrl;
        } else {
          window.location.href = formUrl;
        }
      }
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

  const illustrationWrap = document.getElementById('mountain-illustration-wrap');
  const illustration = document.getElementById('mountain-illustration');
  if (illustrationWrap && illustration) {
    const columns = 10;
    const rows = 6;
    let idx = 0;
    let totalTiles = 0;

    // Keep the previous hero animation feel by revealing the art in small staggered steps.
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        const tile = document.createElement('span');
        tile.className = 'hero-illustration-tile';
        tile.style.left = `${(col * 100) / columns}%`;
        tile.style.top = `${(row * 100) / rows}%`;
        tile.style.width = `${100 / columns}%`;
        tile.style.height = `${100 / rows}%`;
        tile.style.backgroundImage = `url(${illustration.getAttribute('src')})`;
        tile.style.backgroundSize = `${columns * 100}% ${rows * 100}%`;
        tile.style.backgroundPosition = `${(col * 100) / (columns - 1)}% ${(row * 100) / (rows - 1)}%`;
        tile.style.transitionDelay = `${idx * 14}ms`;
        illustrationWrap.appendChild(tile);

        requestAnimationFrame(() => requestAnimationFrame(() => {
          tile.style.opacity = '1';
        }));

        idx += 1;
        totalTiles += 1;
      }
    }

    if (prefersReduced) {
      illustrationWrap.querySelectorAll('.hero-illustration-tile').forEach((tile) => {
        tile.style.opacity = '1';
      });
      illustrationWrap.classList.add('is-complete');
    } else {
      const revealDuration = 500;
      const totalDelay = (Math.max(0, totalTiles - 1) * 14) + revealDuration;
      window.setTimeout(() => {
        illustrationWrap.classList.add('is-complete');
        illustrationWrap.querySelectorAll('.hero-illustration-tile').forEach((tile) => {
          tile.remove();
        });
      }, totalDelay + 60);
    }
  }
})();
