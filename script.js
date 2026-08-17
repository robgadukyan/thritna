(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Reveal-on-scroll. The page remains fully usable without this enhancement.
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }

  // Capture common campaign parameters so you can see where signups came from.
  const params = new URLSearchParams(window.location.search);
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(key => {
    const value = params.get(key) || '';
    document.querySelectorAll(`#${key}, .${key}`).forEach(input => { input.value = value; });
  });

  // Helpful local-preview behavior: prevents an apparent broken submit when opening index.html directly.
  document.querySelectorAll('.signup-form').forEach(form => {
    form.addEventListener('submit', (event) => {
      const status = form.querySelector('.form-status');
      if (window.location.protocol === 'file:') {
        event.preventDefault();
        if (status) status.textContent = 'Preview mode: deploy to Vercel to activate signups.';
      }
    });
  });
})();
