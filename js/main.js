/* ============================================================
   Build With Me — main.js
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* --- Mobile Nav --- */
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  /* --- Navbar scroll tint --- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.style.background = window.scrollY > 60
        ? 'rgba(8,17,29,0.98)'
        : 'rgba(8,17,29,0.88)';
    }, { passive: true });
  }

  /* --- Smooth scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  /* --- Scroll fade-in --- */
  const revealEls = document.querySelectorAll('.niche-row, .work-card, .pkg-card, .process-card, .testi-card, .why-card, .addon-row');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease ' + (i % 4 * 0.08) + 's, transform 0.6s ease ' + (i % 4 * 0.08) + 's';
      obs.observe(el);
    });
  }

  /* --- Form --- */
  const form = document.getElementById('contactForm');
  const nameEl = document.getElementById('fname');
  const contEl = document.getElementById('fcontact');
  const nameErr = document.getElementById('nameErr');
  const contErr = document.getElementById('contactErr');

  if (form) {
    form.addEventListener('submit', function (e) {
      let valid = true;
      if (nameErr) nameErr.textContent = '';
      if (contErr) contErr.textContent = '';
      if (nameEl && !nameEl.value.trim()) {
        if (nameErr) nameErr.textContent = 'Please enter your name.';
        valid = false;
      }
      if (contEl && !contEl.value.trim()) {
        if (contErr) contErr.textContent = 'Please enter your email or WhatsApp number.';
        valid = false;
      }
      if (!valid) e.preventDefault();
    });
  }

  /* --- Active nav highlight --- */
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
  if ('IntersectionObserver' in window) {
    const secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navAs.forEach(function (a) {
            a.style.color = a.getAttribute('href') === id ? 'var(--amber)' : '';
          });
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(function (s) { secObs.observe(s); });
  }

  /* --- Niche row hover expand --- */
  document.querySelectorAll('.niche-row').forEach(function (row) {
    row.addEventListener('mouseenter', function () {
      this.style.paddingLeft = '3.5rem';
    });
    row.addEventListener('mouseleave', function () {
      this.style.paddingLeft = '';
    });
  });

  /* --- Work card click cycling --- */
  var workSlides = {
    'wc-salon': [
      { h3: 'Health & Wellness Websites',    p: 'Clinics, dentists, gyms, spas — be our first case study and get a launch discount.' },
      { h3: 'Prime Care Clinic · Dubai Marina', p: '+220% online bookings in 60 days. Zero paid ads.' },
      { h3: 'FitZone Gym · Business Bay',      p: '+180% new memberships via online sign-up form.' },
      { h3: 'SmileFirst Dental · Jumeirah',    p: 'Fully booked 3 weeks out — the site does the selling.' },
    ],
    'wc-spa': [
      { h3: 'Salons, Barbershops & More',       p: 'Turn your Instagram following into booked chairs with a site built to convert.' },
      { h3: 'Luxe Studio · JBR',                p: '+180% walk-in clients in the first 30 days after launch.' },
      { h3: 'KingsCut Barber · Deira',           p: '5.0★ Google rating — 20+ new enquiries every week.' },
      { h3: 'GlowUp Salon · City Walk',          p: '+210% bookings via WhatsApp — no app needed.' },
    ],
    'wc-restaurant': [
      { h3: 'Restaurants & Cafés',              p: 'Digital menus, table reservations, food galleries. Fill seats and reduce no-shows.' },
      { h3: 'The Table · DIFC',                 p: '+150% online table reservations. No-shows dropped 60%.' },
      { h3: 'Brew & Bloom Café · City Walk',    p: '+170% daily orders — customers order ahead via the site.' },
      { h3: 'The Grill House · Marina',         p: 'Digital menu cut print costs. Reservations up 90%.' },
    ],
    'wc-clinic': [
      { h3: 'Plumbers, Cleaners & More',         p: 'Get found in "near me" searches and make booking effortless.' },
      { h3: 'FastFix Plumbing · Mirdif',         p: '+160% service calls. Now ranking #1 in local search.' },
      { h3: 'Bright Clean · Jumeirah',           p: '3× repeat client rate with one-tap rebooking via WhatsApp.' },
      { h3: 'PowerUp Electric · Al Quoz',        p: 'Top 3 Google ranking for "electrician Dubai" in 90 days.' },
    ],
    'wc-beauty': [
      { h3: 'Lash Bars, Skin Clinics & More',   p: 'Showcase treatments, build trust with before/afters and fill your calendar.' },
      { h3: 'SkinFirst Clinic · DIFC',          p: '+190% consultation bookings — before/after gallery builds trust instantly.' },
      { h3: 'Lash & Brow Bar · JBR',            p: 'Fully booked 2 weeks ahead every week. Zero paid ads.' },
      { h3: 'GlowMed Spa · Palm Jumeirah',      p: '+220% treatment enquiries since site launch.' },
    ],
  };
  var wcIdx = {};
  var wcNiches = ['wc-salon','wc-spa','wc-restaurant','wc-clinic','wc-beauty'];
  document.querySelectorAll('.work-card').forEach(function (card) {
    var niche = wcNiches.find(function (c) { return card.classList.contains(c); });
    if (!niche) return;
    wcIdx[niche] = 0;
    card.addEventListener('click', function () {
      var slides  = workSlides[niche];
      wcIdx[niche] = (wcIdx[niche] + 1) % slides.length;
      var slide   = slides[wcIdx[niche]];
      var overlay = card.querySelector('.wc-overlay');
      var h3el    = card.querySelector('.wc-overlay h3');
      var pel     = card.querySelector('.wc-overlay p');
      var dots    = card.querySelectorAll('.wc-dot');
      if (!overlay || !h3el || !pel) return;
      overlay.classList.add('wc-fade-out');
      setTimeout(function () {
        h3el.textContent = slide.h3;
        pel.textContent  = slide.p;
        dots.forEach(function (d, i) { d.classList.toggle('active', i === wcIdx[niche]); });
        overlay.classList.remove('wc-fade-out');
        overlay.classList.add('wc-fade-in');
        setTimeout(function () { overlay.classList.remove('wc-fade-in'); }, 300);
      }, 220);
    });
  });

  /* --- Hero background animation --- */
  (function () {
    var container = document.getElementById('heroBgAnim');
    if (!container) return;
    var items = [
      { text: 'BWM', size: 13, left:  4, top: 8,  rot: -18, dur: 15, delay:   0, op: 0.10 },
      { text: '◈',   size: 18, left: 62, top: 12, rot:   5, dur: 18, delay:  -4, op: 0.09 },
      { text: 'BWM', size:  7, left: 32, top: 55, rot:  10, dur: 11, delay:  -7, op: 0.08 },
      { text: '◈',   size:  9, left: 18, top: 82, rot: -12, dur: 13, delay:  -2, op: 0.11 },
      { text: 'BWM', size: 10, left: 76, top: 48, rot:  -8, dur: 16, delay:  -9, op: 0.09 },
      { text: '◈',   size:  6, left: 48, top: 28, rot:  20, dur: 10, delay:  -5, op: 0.07 },
      { text: 'BWM', size:  5, left: 88, top: 78, rot:  -5, dur: 14, delay:  -3, op: 0.08 },
      { text: '◈',   size: 14, left:  8, top: 40, rot:   8, dur: 20, delay: -11, op: 0.09 },
      { text: 'BWM', size:  8, left: 52, top: 70, rot: -14, dur: 12, delay:  -6, op: 0.07 },
      { text: '◈',   size:  5, left: 94, top: 22, rot:  -3, dur:  9, delay:  -1, op: 0.10 },
      { text: 'BWM', size: 11, left: 38, top: 90, rot:  15, dur: 17, delay:  -8, op: 0.08 },
    ];
    items.forEach(function (item) {
      var el = document.createElement('div');
      el.className = 'bwm-bg-el';
      el.textContent = item.text;
      el.style.cssText = [
        'left:'      + item.left            + '%',
        'top:'       + item.top             + '%',
        'font-size:' + item.size            + 'rem',
        '--rot:'     + item.rot             + 'deg',
        '--rot-hi:'  + (item.rot + 5)       + 'deg',
        '--dur:'     + item.dur             + 's',
        '--delay:'   + item.delay           + 's',
        '--op:'      + item.op,
        '--op-hi:'   + (item.op * 1.7).toFixed(3)
      ].join(';');
      container.appendChild(el);
    });
  })();

  /* --- Hero card shuffle --- */
  var heroBusinesses = [
    { niche: 'Clinic · Dubai Marina',   name: 'Prime Care<br/>Clinic',       v1: '+220%', l1: 'Bookings',     v2: '4.9★', l2: 'Google' },
    { niche: 'Salon · JBR',             name: 'Luxe<br/>Studio',              v1: '+180%', l1: 'Walk-ins',     v2: '4.8★', l2: 'Google' },
    { niche: 'Restaurant · DIFC',       name: 'The Table',                    v1: '+150%', l1: 'Reservations', v2: '4.9★', l2: 'Google' },
    { niche: 'Gym · Business Bay',      name: 'Iron Peak<br/>Fitness',        v1: '+200%', l1: 'Members',      v2: '4.7★', l2: 'Google' },
    { niche: 'Barbershop · Deira',      name: 'Kings Cut<br/>Barber',         v1: '+190%', l1: 'Bookings',     v2: '5.0★', l2: 'Google' },
    { niche: 'Spa · Palm Jumeirah',     name: 'Serenity<br/>Spa',             v1: '+240%', l1: 'Reservations', v2: '4.8★', l2: 'Google' },
    { niche: 'Law Firm · Downtown',     name: 'Al-Rashid<br/>Legal',          v1: '+160%', l1: 'Leads',        v2: '4.9★', l2: 'Google' },
    { niche: 'Dentist · Jumeirah',      name: 'SmileFirst<br/>Dental',        v1: '+130%', l1: 'Appointments', v2: '4.9★', l2: 'Google' },
    { niche: 'Café · City Walk',   name: 'Brew &amp;<br/>Bloom',         v1: '+170%', l1: 'Orders',       v2: '4.8★', l2: 'Google' },
    { niche: 'Plumber · Mirdif',        name: 'FastFix<br/>Plumbing',         v1: '+160%', l1: 'Calls',        v2: '4.7★', l2: 'Google' },
    { niche: 'Photographer · JLT',      name: 'FrameIt<br/>Studio',           v1: '+210%', l1: 'Enquiries',    v2: '5.0★', l2: 'Google' },
    { niche: 'Auto Shop · Al Quoz',     name: 'DriveOn<br/>Garage',           v1: '+140%', l1: 'Bookings',     v2: '4.8★', l2: 'Google' },
  ];
  var bizIdx = 0;
  var card1 = document.querySelector('.hcard-1');
  var card2 = document.querySelector('.hcard-2');
  var card3 = document.querySelector('.hcard-3');
  if (card1) {
    var niches = [
      card1.querySelector('.hcard-niche'),
      card2 ? card2.querySelector('.hcard-niche') : null,
      card3 ? card3.querySelector('.hcard-niche') : null
    ];
    var titles = [
      card1.querySelector('.hcard-title'),
      card2 ? card2.querySelector('.hcard-title') : null,
      card3 ? card3.querySelector('.hcard-title') : null
    ];
    var stats = card1.querySelectorAll('.hcard-stats div');

    setInterval(function () {
      bizIdx = (bizIdx + 1) % heroBusinesses.length;
      var b0 = heroBusinesses[bizIdx];
      var b1 = heroBusinesses[(bizIdx + 1) % heroBusinesses.length];
      var b2 = heroBusinesses[(bizIdx + 2) % heroBusinesses.length];

      card1.classList.add('card-exit');

      setTimeout(function () {
        if (niches[0]) niches[0].textContent = b0.niche;
        if (titles[0]) titles[0].innerHTML  = b0.name;
        if (stats[0])  { stats[0].querySelector('span').textContent = b0.v1; stats[0].querySelector('small').textContent = b0.l1; }
        if (stats[1])  { stats[1].querySelector('span').textContent = b0.v2; stats[1].querySelector('small').textContent = b0.l2; }
        if (niches[1]) niches[1].textContent = b1.niche;
        if (titles[1]) titles[1].innerHTML  = b1.name;
        if (niches[2]) niches[2].textContent = b2.niche;
        if (titles[2]) titles[2].innerHTML  = b2.name;

        card1.classList.remove('card-exit');
        card1.classList.add('card-enter');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            card1.classList.remove('card-enter');
          });
        });
      }, 400);
    }, 3200);
  }

});
