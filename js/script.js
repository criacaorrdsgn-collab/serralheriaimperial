/**
 * SERRALHERIA IMPERIAL — INTERAÇÕES E CARROSSEL DINÂMICO
 * JavaScript nativo e performático (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initHeroVideoSound();
  initWeldingGlow();
  initInstagramCarousel();
  initBudgetCalculator();
});

/* ==========================================================================
   1. EFEITO DE SCROLL NA NAVBAR
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(10, 13, 18, 0.95)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
    } else {
      navbar.style.background = 'rgba(10, 13, 18, 0.85)';
      navbar.style.boxShadow = 'none';
    }
  });
}

/* ==========================================================================
   MENU HAMBÚRGUER MOBILE
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!toggleBtn || !navMenu) return;

  function toggleMenu() {
    const isOpen = toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    navMenu.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   CONTROLE DE ÁUDIO DO VÍDEO HERO
   ========================================================================== */
function initHeroVideoSound() {
  const video = document.getElementById('heroVideo');
  const soundBtn = document.getElementById('heroSoundToggle');
  if (!video || !soundBtn) return;

  function toggleSound() {
    video.muted = !video.muted;
    const soundText = soundBtn.querySelector('.sound-text');
    if (video.muted) {
      soundBtn.classList.remove('unmuted');
      soundBtn.setAttribute('aria-label', 'Ativar som do vídeo');
      if (soundText) soundText.textContent = 'Som';
    } else {
      soundBtn.classList.add('unmuted');
      soundBtn.setAttribute('aria-label', 'Desativar som do vídeo');
      if (soundText) soundText.textContent = 'Som Ativo';
      video.play().catch(() => {});
    }
  }

  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSound();
  });

  const videoCard = video.closest('.hero-visual-card');
  if (videoCard) {
    videoCard.style.cursor = 'pointer';
    videoCard.addEventListener('click', (e) => {
      if (!e.target.closest('.sound-toggle-btn') && !e.target.closest('.hero-badge-overlay')) {
        toggleSound();
      }
    });
  }
}

/* ==========================================================================
   2. CARROSSEL DE TRABALHOS DO INSTAGRAM
   ========================================================================== */
function initInstagramCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const container = document.querySelector('.carousel-container');

  if (!track || !prevBtn || !nextBtn || !container) return;

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;
  let autoPlayInterval = null;

  const cards = track.querySelectorAll('.work-card');
  const totalCards = cards.length;

  function getVisibleCards() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function updateCarousel() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, totalCards - visibleCards);
    
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24; // correspondente ao gap no CSS
    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    // Atualiza estados dos botões
    prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
    nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
  }

  function nextSlide() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, totalCards - visibleCards);
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0; // loop suave
    }
    updateCarousel();
  }

  function prevSlide() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, totalCards - visibleCards);
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex;
    }
    updateCarousel();
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  window.addEventListener('resize', updateCarousel);

  // Autoplay a cada 5 segundos
  function startAutoplay() {
    autoPlayInterval = setInterval(nextSlide, 5500);
  }

  function stopAutoplay() {
    clearInterval(autoPlayInterval);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  // Suporte a Touch e Drag
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    isDragging = false;
    startAutoplay();
  });

  startAutoplay();
  updateCarousel();
}

/* ==========================================================================
   3. CALCULADORA & SIMULADOR DE ORÇAMENTO PARA WHATSAPP
   ========================================================================== */
function initBudgetCalculator() {
  const form = document.getElementById('budgetForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const serviceSelect = document.getElementById('calcService');
    const measureInput = document.getElementById('calcMeasure');
    const locationInput = document.getElementById('calcLocation');
    const detailsInput = document.getElementById('calcDetails');

    const service = serviceSelect ? serviceSelect.value : 'Serralheria Geral';
    const measure = measureInput && measureInput.value.trim() ? measureInput.value.trim() : 'A combinar';
    const location = locationInput && locationInput.value.trim() ? locationInput.value.trim() : 'Bauru e Região';
    const details = detailsInput && detailsInput.value.trim() ? detailsInput.value.trim() : 'Conforme projeto';

    const message = `Olá, Serralheria Imperial! Gostaria de solicitar um orçamento exclusivo:\n\n` +
      `📌 *Tipo de Projeto:* ${service}\n` +
      `📏 *Medidas/Dimensões:* ${measure}\n` +
      `📍 *Localização:* ${location}\n` +
      `📝 *Detalhes do Pedido:* ${details}\n\n` +
      `Aguardo o contato para alinharmos os detalhes e agendarmos uma medição no local. Obrigado!`;

    const whatsappUrl = `https://wa.me/5514996637778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   EFEITO DE SOLDA ELÉTRICA REAL (INSPIRADO NA FOTO DE REFERÊNCIA)
   ========================================================================== */
function initWeldingGlow() {
  const canvas = document.createElement('canvas');
  canvas.id = 'weldingGlowCanvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let posX = width / 2;
  let posY = height / 3;
  let targetX = posX;
  let targetY = posY;

  let lastScrollY = window.scrollY;
  let lastMouseX = posX;
  let lastMouseY = posY;

  let motionEnergy = 0;
  let flickerPhase = 0;

  const sparks = [];

  class DirectionalSpark {
    constructor(x, y, isBurst = false) {
      this.x = x + (Math.random() - 0.5) * 15;
      this.y = y + (Math.random() - 0.5) * 15;
      
      const angle = (Math.random() - 0.5) * Math.PI * 1.8;
      const speed = (Math.random() * 5.5 + 2.0) * (isBurst ? 1.4 : 1.0);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - Math.random() * 2;
      this.size = Math.random() * 2.4 + 1.0;
      this.life = 1.0;
      this.decay = Math.random() * 0.045 + 0.025;

      const colors = ['#FFFFFF', '#E6FAFF', '#70DCFF', '#FFB800', '#FF6600'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.09;
      this.vx *= 0.95;
      this.life -= this.decay;
    }

    draw(c) {
      if (this.life <= 0) return;
      c.save();
      c.globalAlpha = Math.max(0, this.life);
      c.strokeStyle = this.color;
      c.fillStyle = this.color;
      c.lineWidth = this.size * this.life;
      c.lineCap = 'round';

      c.beginPath();
      c.moveTo(this.x, this.y);
      c.lineTo(this.x - this.vx * 2.8, this.y - this.vy * 2.8);
      c.stroke();
      c.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    const dist = Math.hypot(dx, dy);
    motionEnergy += Math.min(dist * 0.18, 9);

    lastMouseX = targetX = e.clientX;
    lastMouseY = targetY = e.clientY;

    if (Math.random() < 0.35) {
      sparks.push(new DirectionalSpark(targetX, targetY));
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      targetX = e.touches[0].clientX;
      targetY = e.touches[0].clientY;
      motionEnergy += 5;
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const diff = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    motionEnergy += Math.min(diff * 0.3, 14);

    if (targetX === width / 2 && targetY === height / 3) {
      targetX = width * (0.3 + Math.random() * 0.4);
      targetY = height * (0.3 + Math.random() * 0.4);
    }

    const count = Math.min(3, Math.floor(diff / 4) + 1);
    for (let i = 0; i < count; i++) {
      if (sparks.length < 30) {
        sparks.push(new DirectionalSpark(targetX, targetY, true));
      }
    }
  }, { passive: true });

  function render() {
    ctx.clearRect(0, 0, width, height);

    posX += (targetX - posX) * 0.12;
    posY += (targetY - posY) * 0.12;

    flickerPhase += 0.32;

    const rapidFlicker = (Math.sin(flickerPhase) * 0.4 + Math.cos(flickerPhase * 2.7) * 0.3 + 0.65);
    const motionFactor = Math.min(1.0, motionEnergy / 10);
    
    const intensity = Math.max(0.04, motionFactor * rapidFlicker * 0.60);
    const radius = Math.min(420, Math.max(170, 210 + motionEnergy * 9));

    const grad = ctx.createRadialGradient(posX, posY, 0, posX, posY, radius);

    const isPeak = rapidFlicker > 0.8 && motionEnergy > 0.8;
    const coreColor = isPeak ? `rgba(255, 255, 255, ${intensity * 1.3})` : `rgba(235, 248, 255, ${intensity})`;
    const arcBlue = `rgba(0, 180, 255, ${intensity * 0.8})`;
    const deepBlue = `rgba(0, 80, 210, ${intensity * 0.35})`;
    const amberWarmth = `rgba(217, 136, 41, ${intensity * 0.15})`;

    grad.addColorStop(0, coreColor);
    grad.addColorStop(0.18, arcBlue);
    grad.addColorStop(0.50, deepBlue);
    grad.addColorStop(0.80, amberWarmth);
    grad.addColorStop(1, 'rgba(10, 13, 18, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(posX, posY, radius, 0, Math.PI * 2);
    ctx.fill();

    if (motionEnergy > 0.5) {
      ctx.save();
      const rayCount = 10;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + (Math.sin(flickerPhase + i) * 0.2);
        const rayLen = (radius * 0.7) * (0.6 + Math.random() * 0.5) * (intensity * 1.4);
        
        ctx.strokeStyle = i % 2 === 0 ? `rgba(255, 255, 255, ${intensity * 0.6})` : `rgba(80, 210, 255, ${intensity * 0.4})`;
        ctx.lineWidth = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.lineTo(posX + Math.cos(angle) * rayLen, posY + Math.sin(angle) * rayLen);
        ctx.stroke();
      }
      ctx.restore();
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.update();
      s.draw(ctx);
      if (s.life <= 0) {
        sparks.splice(i, 1);
      }
    }

    motionEnergy *= 0.90;
    requestAnimationFrame(render);
  }

  render();
}
