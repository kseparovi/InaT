document.addEventListener('DOMContentLoaded', () => {
  // Glatko skrolanje na sekcije
  const scrollLinks = document.querySelectorAll('a.nav-link');
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Prebacivanje jezika (EN ⇄ HR)
  const langSwitcher = document.getElementById('langSwitch');
  if (langSwitcher) {
    const currentURL = window.location.pathname;
    const isCroatian = currentURL.includes('index-hr.html');
    langSwitcher.checked = !isCroatian;

    langSwitcher.addEventListener('change', () => {
      const newURL = langSwitcher.checked ? '/index.html' : '/index-hr.html';
      window.location.href = newURL;
    });
  }

  // Animacija elemenata pri scrollu
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  animatedElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px) scale(0.98)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    el.style.willChange = 'opacity, transform';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0) scale(1)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  animatedElements.forEach(el => observer.observe(el));

  // Kontakt forma - Formspree integracija
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Spriječi reload

      const formData = new FormData(contactForm);

      fetch('https://formspree.io/f/xjkrwlzj', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            contactForm.reset(); // Očisti formu
            Swal.fire({
              title: 'Hvala!',
              text: 'Vaša poruka je uspješno poslana.',
              icon: 'success',
              confirmButtonText: 'Zatvori',
              timer: 2000,
              timerProgressBar: true
            });
          } else {
            return response.json().then(data => {
              throw new Error(data.error || 'Slanje poruke nije uspjelo.');
            });
          }
        })
        .catch(error => {
          Swal.fire({
            title: 'Greška',
            text: error.message || 'Došlo je do pogreške.',
            icon: 'error',
            confirmButtonText: 'Pokušajte ponovo'
          });
        });
    });
  }

  // Ukloni white flash pri reloadu
  document.body.classList.add('loaded');

  console.log('InaT site ready.');
});
