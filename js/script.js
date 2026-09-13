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
   EFEITO DE LUZ DE SOLDA FLUIDO (VARIAÇÃO FORTE/FRACO SEM TRAVAMENTO)
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

  class UltraSpark {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 40;
      this.y = y + (Math.random() - 0.5) * 40;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1.2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - Math.random() * 1.5;
      this.size = Math.random() * 2.2 + 1;
      this.life = 1.0;
      this.decay = Math.random() * 0.05 + 0.03;
      const colors = ['#FFFFFF', '#E6F7FF', '#99E2FF', '#33C4FF', '#B3ECFF'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08;
      this.vx *= 0.94;
      this.life -= this.decay;
    }

    draw(c) {
      if (this.life <= 0) return;
      c.save();
      c.globalAlpha = Math.max(0, this.life);
      c.fillStyle = this.color;
      c.beginPath();
      c.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    const dist = Math.hypot(dx, dy);
    motionEnergy += Math.min(dist * 0.15, 8);

    lastMouseX = targetX = e.clientX;
    lastMouseY = targetY = e.clientY;

    if (Math.random() < 0.25) {
      sparks.push(new UltraSpark(targetX, targetY));
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      targetX = e.touches[0].clientX;
      targetY = e.touches[0].clientY;
      motionEnergy += 4;
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const diff = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    motionEnergy += Math.min(diff * 0.25, 12);

    if (targetX === width / 2 && targetY === height / 3) {
      targetX = width * (0.3 + Math.random() * 0.4);
      targetY = height * (0.3 + Math.random() * 0.4);
    }

    if (Math.random() < 0.5 && sparks.length < 25) {
      sparks.push(new UltraSpark(
        targetX + (Math.random() - 0.5) * 60,
        targetY + (Math.random() - 0.5) * 60
      ));
    }
  }, { passive: true });

  function render() {
    ctx.clearRect(0, 0, width, height);

    posX += (targetX - posX) * 0.12;
    posY += (targetY - posY) * 0.12;

    flickerPhase += 0.28;

    const rapidFlicker = (Math.sin(flickerPhase) * 0.35 + Math.cos(flickerPhase * 2.3) * 0.25 + 0.6);
    const motionFactor = Math.min(1.0, motionEnergy / 10);
    
    const currentIntensity = Math.max(0.04, motionFactor * rapidFlicker * 0.55);
    const radius = Math.min(380, Math.max(160, 200 + motionEnergy * 8));

    const grad = ctx.createRadialGradient(posX, posY, 0, posX, posY, radius);

    // Cores de luz de solda real: Branco incandescente azulado (Arco elétrico TIG/MIG)
    const isArcPeak = rapidFlicker > 0.75 && motionEnergy > 0.8;
    const coreColor = isArcPeak ? `rgba(255, 255, 255, ${currentIntensity * 1.2})` : `rgba(240, 250, 255, ${currentIntensity})`;
    const innerColor = isArcPeak ? `rgba(160, 230, 255, ${currentIntensity * 0.85})` : `rgba(120, 210, 255, ${currentIntensity * 0.65})`;
    const outerColor = `rgba(10, 130, 230, ${currentIntensity * 0.25})`;

    grad.addColorStop(0, coreColor);
    grad.addColorStop(0.2, innerColor);
    grad.addColorStop(0.55, outerColor);
    grad.addColorStop(1, 'rgba(10, 13, 18, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(posX, posY, radius, 0, Math.PI * 2);
    ctx.fill();

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
