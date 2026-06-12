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
        ? 'rgba(28,21,16,0.98)'
        : 'rgba(28,21,16,0.88)';
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
