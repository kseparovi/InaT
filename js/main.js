document.addEventListener('DOMContentLoaded', () => {
  // Animacija scrolla
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

  console.log('InaT site ready.');
});
