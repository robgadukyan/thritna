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

  // Local preview support: allow a browser preview to move to the confirmation page.
  // On deployed Netlify sites, the real form submit still runs normally.
  document.querySelectorAll('.signup-form').forEach(form => {
    form.addEventListener('submit', (event) => {
      const status = form.querySelector('.form-status');
      const isLocalPreview = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      if (isLocalPreview) {
        event.preventDefault();
        if (status) status.textContent = 'Redirecting to the thank-you page...';
        window.location.href = 'thank-you.html';
      }
    });
  });
})();
