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
        ? 'rgba(10,10,10,0.98)'
        : 'rgba(10,10,10,0.88)';
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

});
