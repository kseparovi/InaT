document.addEventListener('DOMContentLoaded', () => {
  // ===== Sticky header: dynamically set --nav-h =====
  const header = document.querySelector('header.navbar');
  const setNavH = () => {
    if (header) document.documentElement.style.setProperty('--nav-h', header.offsetHeight + 'px');
  };
  setNavH();
  window.addEventListener('resize', setNavH);

  // ===== Smooth scroll for in-page links =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const hash = a.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('header.navbar').offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });

      history.pushState(null, '', hash);

      // Close mobile menu if open
      const navCollapse = document.querySelector('.navbar-collapse');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const inst = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
        inst.hide();
      }
    });
  });

  // ===== Language toggle (EN <-> HR) =====
  const langSwitcher = document.getElementById('langSwitch');
  if (langSwitcher) {
    const isHR = window.location.pathname.includes('index-hr.html');
    langSwitcher.checked = !isHR;
    langSwitcher.addEventListener('change', () => {
      window.location.href = langSwitcher.checked ? 'index.html' : 'index-hr.html';
    });
  }

  // ===== Animate on scroll =====
  const animated = document.querySelectorAll('.animate-on-scroll');
  animated.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px) scale(0.98)';
    el.style.transition = 'opacity .6s ease-out, transform .6s ease-out';
    el.style.willChange = 'opacity, transform';
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0) scale(1)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animated.forEach(el => io.observe(el));

  // ===== Contact form (Formspree) =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(contactForm);

      fetch('https://formspree.io/f/xjkrwlzj', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(async res => {
        if (res.ok) {
          contactForm.reset();
          Swal.fire({
            title: 'Thank you!',
            text: 'Your message has been successfully sent.',
            icon: 'success',
            confirmButtonText: 'Close',
            background: '#1a1a1a',
            color: '#eaf0f2',
            confirmButtonColor: '#447486',
            iconColor: '#2f6479',
            timer: 2500,
            timerProgressBar: true
          });
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Message failed to send.');
        }
      }).catch(err => {
        Swal.fire({
          title: 'Error!',
          text: err.message || 'There was a problem sending your message.',
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#1a1a1a',
          color: '#eaf0f2',
          confirmButtonColor: '#a94442',
          iconColor: '#dc3545'
        });
      });
    });
  }

  // ===== Cookie banner =====
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');
  const consent = localStorage.getItem('cookieConsent');

  function enableAnalytics() {
    if (window.gtag) return;
    const s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX');
  }

  if (banner && !consent) banner.classList.remove('d-none');
  if (acceptBtn) acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    if (banner) banner.classList.add('d-none');
    enableAnalytics();
  });
  if (declineBtn) declineBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    if (banner) banner.classList.add('d-none');
  });
  if (consent === 'accepted') enableAnalytics();

  // ===== Service cards accordion =====
  const cards = document.querySelectorAll('.service-card[data-acc]');
  let openCard = null;

  const openCardFn = card => {
    const body = card.querySelector('.service-card__body');
    const header = card.querySelector('.service-card__header');
    if (!body) return;
    if (openCard && openCard !== card) closeCardFn(openCard);
    card.classList.add('is-open');
    header.setAttribute('aria-expanded', 'true');
    body.style.height = body.scrollHeight + 'px';
    body.addEventListener('transitionend', function done(e) {
      if (e.propertyName === 'height') {
        body.style.height = 'auto';
        body.removeEventListener('transitionend', done);
      }
    });
    openCard = card;
  };

  const closeCardFn = card => {
    const body = card.querySelector('.service-card__body');
    const header = card.querySelector('.service-card__header');
    if (!body) return;
    header.setAttribute('aria-expanded', 'false');
    if (getComputedStyle(body).height === 'auto') body.style.height = body.scrollHeight + 'px';
    requestAnimationFrame(() => { body.style.height = '0px'; });
    card.classList.remove('is-open');
    if (openCard === card) openCard = null;
  };

  const toggleCard = card => card.classList.contains('is-open') ? closeCardFn(card) : openCardFn(card);

  cards.forEach(card => {
    const header = card.querySelector('.service-card__header');
    const body = card.querySelector('.service-card__body');
    if (!body) return;
    body.style.height = '0px';
    header.addEventListener('click', () => toggleCard(card));
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(card);
      }
    });
  });

  window.addEventListener('resize', () => {
    if (!openCard) return;
    const body = openCard.querySelector('.service-card__body');
    if (getComputedStyle(body).height === 'auto') {
      body.style.height = body.scrollHeight + 'px';
      requestAnimationFrame(() => { body.style.height = 'auto'; });
    }
  });

  document.body.classList.add('loaded');
  console.log('InaT site ready.');
});


// test.js — automated functionality testing
document.addEventListener('DOMContentLoaded', () => {

  console.log('===== Automated Functionality Test Started =====');

  // 1️⃣ Test all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      console.log(`[Anchor Click] ${a.textContent.trim()} -> ${a.getAttribute('href')}`);
    });
  });

  // 2️⃣ Test service cards accordion
  const cards = document.querySelectorAll('.service-card[data-acc]');
  cards.forEach((card, idx) => {
    const header = card.querySelector('.service-card__header');
    const title = card.querySelector('.service-card__title').textContent;
    const body = card.querySelector('.service-card__body');

    // Log click and check if body expands
    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');
      console.log(`[Service Card Click] "${title}" | isOpen: ${isOpen} | height: ${body.offsetHeight}`);
    });

    // Automated click after 500ms per card
    setTimeout(() => {
      console.log(`[Auto-Test] Clicking card "${title}"`);
      header.click();
    }, 500 * (idx + 1));
  });

  // 3️⃣ Test contact form
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', e => {
      e.preventDefault();
      console.log('[Form Submit] Contact form submitted');
    });
  }

  // 4️⃣ Test cookie banner buttons
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');

  if(acceptBtn){
    acceptBtn.addEventListener('click', () => {
      console.log('[Cookie Banner] Accept clicked | localStorage:', localStorage.getItem('cookieConsent'));
    });
  }

  if(declineBtn){
    declineBtn.addEventListener('click', () => {
      console.log('[Cookie Banner] Decline clicked | localStorage:', localStorage.getItem('cookieConsent'));
    });
  }

  console.log('===== Automated Functionality Test Initialized =====');
});
