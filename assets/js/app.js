(function () {
  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle (OS preference fallback)
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const osLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = storedTheme || (osLight ? 'light' : 'dark');
  setTheme(initialTheme);

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggleBtn?.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    localStorage.setItem('theme', theme);
    const themeColor = theme === 'light' ? '#f8fafc' : '#070a0f';
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', themeColor);
  }

  toggleBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(next);
  });

  // Top Scroll Progress Bar
  const progressBar = document.querySelector('.scroll-progress');
  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // CV Link handler
  const cvLink = document.getElementById('cv-link');
  if (cvLink && /^https?:$/.test(location.protocol)) {
    const href = cvLink.getAttribute('href') || '';
    try {
      fetch(href, { method: 'HEAD', cache: 'no-store' })
        .then((res) => {
          if (!res.ok) throw new Error('CV not found');
        })
        .catch(() => {
          const mail = 'mailto:faridmasoodofficial@gmail.com?subject=' + encodeURIComponent('Request CV');
          cvLink.setAttribute('href', mail);
          cvLink.removeAttribute('download');
          cvLink.textContent = 'Request CV';
        });
    } catch {}
  }

  // Footer Year
  const copyrightYearEl = document.getElementById('copyright-year');
  if (copyrightYearEl) copyrightYearEl.textContent = new Date().getFullYear();

  // Nav active link highlighting
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  function setActive(hash) {
    navLinks.forEach(link => {
      const match = link.getAttribute('href') === hash;
      link.classList.toggle('active', match);
      if (match) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  const sections = navLinks
    .map(l => {
      const sel = l.getAttribute('href');
      const el = sel?.startsWith('#') ? document.querySelector(sel) : null;
      return el ? { link: l, el } : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          setActive(id);
        }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -30% 0px' });
    sections.forEach(s => io.observe(s.el));

    // Reveal animations
    if (motionOK) {
      const revealEls = Array.from(document.querySelectorAll('.reveal'));
      const ro = new IntersectionObserver((ents) => {
        ents.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
      revealEls.forEach(el => ro.observe(el));
    }
  }

  // Mobile navigation hamburger
  const menuBtn = document.getElementById('menu-toggle');
  const navListEl = document.getElementById('primary-nav');
  const navBackdrop = document.getElementById('nav-backdrop');

  function setMenu(open) {
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    const active = open && isMobile;
    document.body.classList.toggle('menu-open', active);
    menuBtn?.setAttribute('aria-expanded', String(active));
    if (isMobile) {
      navListEl?.setAttribute('aria-hidden', String(!active));
    } else {
      navListEl?.removeAttribute('aria-hidden');
    }
  }

  menuBtn?.addEventListener('click', () => {
    const next = !document.body.classList.contains('menu-open');
    setMenu(next);
  });

  navBackdrop?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  navListEl?.addEventListener('click', (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a.nav-link') : null;
    if (a) setMenu(false);
  });

  const mql = window.matchMedia('(max-width: 760px)');
  function handleViewportChange(e) {
    if (!e.matches) setMenu(false);
  }
  if (mql.addEventListener) mql.addEventListener('change', handleViewportChange);
  else if (mql.addListener) mql.addListener(handleViewportChange);

  // Back to top
  const backTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (!backTop) return;
    const show = (window.scrollY || 0) > 300;
    backTop.classList.toggle('show', show);
  }, { passive: true });

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: motionOK ? 'smooth' : 'auto' });
  });

  // Spotlight mouse effect on system cards
  if (motionOK) {
    document.querySelectorAll('.system-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // Neural Network / Particle Mesh Canvas Animation
  const canvas = document.getElementById('particle-canvas');
  if (canvas && motionOK) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 14000), 65);

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY <= rect.bottom && e.clientY >= rect.top) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    });

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      const isLight = root.getAttribute('data-theme') === 'light';
      const nodeColor = isLight ? 'rgba(2, 132, 199, 0.45)' : 'rgba(69, 202, 255, 0.55)';
      const edgeColor = isLight ? 'rgba(2, 132, 199,' : 'rgba(69, 202, 255,';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${edgeColor} ${1 - dist / 110 * 0.9})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `${edgeColor} ${0.85 - mdist / 140 * 0.8})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  // Contact form & WeChat
  const form = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const copyWechatBtn = document.getElementById('copy-wechat');
  const wechatEl = document.getElementById('wechat-id');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = (document.getElementById('subject')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();
    const email = 'faridmasoodofficial@gmail.com';

    const bodyLines = [
      'Hello Farid,',
      '',
      message,
      '',
      '— Sent via farid-masood-khan.github.io'
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject || 'Portfolio inquiry')}&body=${body}`;
    if (contactStatus) contactStatus.textContent = 'Opening mail client...';
    window.location.href = mailto;
  });

  copyWechatBtn?.addEventListener('click', async () => {
    const text = wechatEl?.textContent || 'faridmasood1';
    try {
      await navigator.clipboard.writeText(text);
      if (contactStatus) contactStatus.textContent = 'WeChat ID copied to clipboard!';
    } catch {
      if (contactStatus) contactStatus.textContent = 'Copy failed. ID: ' + text;
    }
  });

  const showQRBtn = document.getElementById('show-wechat-qr');
  const qrPanel = document.getElementById('wechat-qr-panel');
  const qrImg = document.getElementById('wechat-qr-img');
  const closeQRBtn = document.getElementById('close-wechat-qr');

  showQRBtn?.addEventListener('click', () => {
    qrPanel?.removeAttribute('hidden');
    qrPanel?.setAttribute('aria-hidden', 'false');
  });
  closeQRBtn?.addEventListener('click', () => {
    qrPanel?.setAttribute('hidden', '');
    qrPanel?.setAttribute('aria-hidden', 'true');
  });

  // Repositories Browser & GitHub API
  const grid = document.getElementById('repo-grid');
  const filtersEl = document.getElementById('repo-filters');
  const sortEl = document.getElementById('repo-sort');

  let allRepos = [];
  let currentFilter = 'All';
  let currentSort = 'updated';
  const cacheKey = 'fmk_repos_cache_v2';
  const cacheTTL = 1000 * 60 * 10; // 10 minutes

  async function loadRepos() {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
      if (cached && (Date.now() - cached.time) < cacheTTL && Array.isArray(cached.data)) {
        allRepos = cached.data.filter(r => !r.fork && r.name !== 'Farid-Masood-Khan' && r.name !== 'farid-masood-khan.github.io');
        buildControls();
        applyRepoView();
        return;
      }

      const res = await fetch('https://api.github.com/users/Farid-Masood-Khan/repos?sort=pushed&per_page=30');
      if (!res.ok) throw new Error('GitHub API rate limited or unreachable');
      const data = await res.json();
      localStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), data }));
      allRepos = data.filter(r => !r.fork && r.name !== 'Farid-Masood-Khan' && r.name !== 'farid-masood-khan.github.io');
      buildControls();
      applyRepoView();
    } catch (err) {
      loadFallbackPinned();
    }
  }

  async function loadFallbackPinned() {
    try {
      const res = await fetch('assets/data/pinned.json');
      if (res.ok) {
        const data = await res.json();
        allRepos = (data.highlights || []).map(h => ({
          name: h.title,
          description: h.desc,
          html_url: h.url,
          language: 'Python',
          stargazers_count: 0,
          pushed_at: new Date().toISOString()
        }));
        buildControls();
        applyRepoView();
        return;
      }
    } catch {}
  }

  function buildControls() {
    if (!filtersEl) return;
    const filterOptions = ['All', 'MLOps', 'GenAI / RAG', 'Computer Vision', 'NLP', 'Time Series'];
    filtersEl.innerHTML = '';
    filterOptions.forEach(opt => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = opt;
      chip.setAttribute('aria-selected', opt === currentFilter ? 'true' : 'false');
      chip.addEventListener('click', () => {
        currentFilter = opt;
        Array.from(filtersEl.children).forEach(c => c.setAttribute('aria-selected', 'false'));
        chip.setAttribute('aria-selected', 'true');
        applyRepoView();
      });
      filtersEl.appendChild(chip);
    });

    if (sortEl) {
      sortEl.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          sortEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false'));
          btn.setAttribute('aria-pressed', 'true');
          currentSort = btn.getAttribute('data-sort') || 'updated';
          applyRepoView();
        });
      });
    }
  }

  function applyRepoView() {
    if (!grid) return;
    let list = [...allRepos];

    if (currentFilter !== 'All') {
      const term = currentFilter.toLowerCase();
      list = list.filter(r => {
        const full = `${r.name} ${r.description || ''} ${(r.topics || []).join(' ')}`.toLowerCase();
        if (term.includes('mlops')) return full.includes('mlops') || full.includes('feast') || full.includes('dvc');
        if (term.includes('rag')) return full.includes('rag') || full.includes('retrieval') || full.includes('bm25');
        if (term.includes('vision')) return full.includes('crop') || full.includes('vision') || full.includes('onnx');
        if (term.includes('nlp')) return full.includes('urdu') || full.includes('nlp') || full.includes('text');
        if (term.includes('time series')) return full.includes('trend') || full.includes('forecasting') || full.includes('time-series');
        return full.includes(term);
      });
    }

    list.sort((a, b) => {
      if (currentSort === 'stars') {
        return (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0);
      }
      return new Date(b.pushed_at) - new Date(a.pushed_at);
    });

    renderRepos(list);
  }

  function renderRepos(repos) {
    if (!grid) return;
    grid.innerHTML = '';
    if (repos.length === 0) {
      grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;">No repositories found matching this filter.</p>';
      return;
    }

    repos.forEach(r => {
      const card = document.createElement('article');
      card.className = 'card reveal in-view';
      card.innerHTML = `
        <div class="title">${escapeHTML(r.name)}</div>
        <div class="desc">${escapeHTML(r.description || 'Production machine learning repository.')}</div>
        <div class="meta">
          <span>🐍 ${escapeHTML(r.language || 'Python')}</span>
          <span>⭐ ${r.stargazers_count ?? 0}</span>
          <span>📅 ${new Date(r.pushed_at).toLocaleDateString()}</span>
        </div>
        <div class="actions">
          <a class="btn small ghost" href="${r.html_url}" target="_blank" rel="noopener">View Repository →</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  loadRepos();
})();
