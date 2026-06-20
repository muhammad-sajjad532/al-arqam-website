// ==========================================================================
// AL-ARQAM — shared interactions
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---- mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  
  const closeMenu = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  
  const openMenu = () => {
    links.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      if (links.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    
    // Close menu when clicking on a link
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking the backdrop overlay
    document.addEventListener('click', (e) => {
      if (links.classList.contains('open') && 
          !links.contains(e.target) && 
          !toggle.contains(e.target)) {
        closeMenu();
      }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ---- highlight active nav link ---- */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) a.classList.add('active');
  });

  /* ---- scroll reveal with stagger ---- */
  const revealEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- navbar scroll state ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- animated stat counters ---- */
  const counters = document.querySelectorAll('.count-up');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ---- scroll progress bar ---- */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    const onScrollProgress = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      progressBar.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
    };
    window.addEventListener('scroll', onScrollProgress, { passive: true });
    onScrollProgress();
  }

  /* ---- wisdom ticker duplicate for seamless loop ---- */
  const wisdomTrack = document.getElementById('wisdomTrack');
  if (wisdomTrack && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wisdomTrack.innerHTML += wisdomTrack.innerHTML;
  }

  /* ---- image load fallback ---- */
  document.querySelectorAll('.islamic-img').forEach(img => {
    img.addEventListener('error', () => {
      const pic = img.closest('picture');
      if (pic) {
        const source = pic.querySelector('source');
        if (source) source.remove();
        if (img.dataset.fallback && img.src !== img.dataset.fallback) {
          img.src = img.dataset.fallback;
        }
      }
    });
  });
});
