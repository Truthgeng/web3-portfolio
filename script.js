// Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 1500);
  }
});

// Navigation & Scroll Effects
document.addEventListener('DOMContentLoaded', () => {

  // ===== MATRIX RAIN =====
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン∞∑∫≠≈∂∆∏ΩΞ⊕⊗▲◆◇□■●○';
  const charArr = chars.split('');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const fontSize = 13;
  let cols = Math.floor(W / fontSize);
  let drops = Array(cols).fill(1);

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.floor(W / fontSize);
    drops = Array(cols).fill(1);
  });

  function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = charArr[Math.floor(Math.random() * charArr.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      if (Math.random() > 0.96) {
        ctx.fillStyle = '#ffffff';
      } else {
        const alpha = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = 'rgba(52, 211, 153, ' + alpha + ')';
      }

      ctx.fillText(char, x, y);

      if (y > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  setInterval(drawMatrix, 45);

  // ===== CUSTOM BALLPEN CURSOR =====
  // Only on non-touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    document.body.style.cursor = 'none';

    const cursorEl = document.createElement('div');
    cursorEl.id = 'cursor';
    cursorEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
        <!-- Pen body -->
        <rect x="12" y="2" width="6" height="16" rx="2" fill="#222222"/>
        <!-- Pen clip -->
        <rect x="15.5" y="2" width="1.5" height="14" rx="0.5" fill="#111111"/>
        <!-- Pen grip section -->
        <rect x="11" y="16" width="8" height="4" rx="1" fill="#10b981"/>
        <!-- Pen tip housing -->
        <polygon points="11,20 19,20 16,27" fill="#333333"/>
        <!-- Pen nib tip (the writing point) -->
        <circle cx="15" cy="27.5" r="1.2" fill="#10b981"/>
        <!-- Pen top button -->
        <rect x="12.5" y="1" width="5" height="2.5" rx="1.2" fill="#10b981"/>
      </svg>
    `;
    document.body.appendChild(cursorEl);

    // Smooth trailing cursor position
    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      cursorEl.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorEl.style.opacity = '1';
    });

    // Smooth animation loop
    function animateCursor() {
      const speed = 0.18;
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;
      // Offset so the tip of the pen nib is the pointer
      cursorEl.style.transform = `translate(${cursorX - 15}px, ${cursorY - 28}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale pen on clickable elements
    const clickables = document.querySelectorAll('a, button, input, textarea, [role="button"], .marquee-content span');
    clickables.forEach(el => {
      el.style.cursor = 'none';
      el.addEventListener('mouseenter', () => {
        cursorEl.style.transform += ' scale(1.25)';
        cursorEl.querySelector('circle').setAttribute('fill', '#ffffff');
      });
      el.addEventListener('mouseleave', () => {
        cursorEl.querySelector('circle').setAttribute('fill', '#10b981');
      });
    });

    // Ink-splat click effect
    document.addEventListener('click', (e) => {
      const splat = document.createElement('div');
      splat.classList.add('ink-splat');
      splat.style.left = e.clientX + 'px';
      splat.style.top = e.clientY + 'px';
      document.body.appendChild(splat);
      setTimeout(() => splat.remove(), 600);
    });
  }

  // ===== MOBILE NAV TOGGLE =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  // ===== NAVBAR SCROLL STATE =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

  // ===== FORM SUBMISSION =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.innerHTML = 'Message Sent ✓';
        submitBtn.style.background = '#2d6a4f';
        submitBtn.style.color = '#fff';
        submitBtn.style.opacity = '1';
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
});
