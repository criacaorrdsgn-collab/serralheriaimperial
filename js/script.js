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
   EFEITO DE BRILHO E LUZES DE SOLDA DISCRETAS NO FUNDO (MOUSE & SCROLL)
   ========================================================================== */
function initWeldingGlow() {
  const canvas = document.createElement('canvas');
  canvas.id = 'weldingGlowCanvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouseX = width / 2;
  let mouseY = height / 3;
  let targetX = mouseX;
  let targetY = mouseY;
  let hasUserMovedMouse = false;

  let lastScrollY = window.scrollY;
  let scrollSpeed = 0;

  const particles = [];
  const arcFlashes = [];

  // Classe para Fagulhas de Solda (Sparks)
  class SparkParticle {
    constructor(x, y, speedMult = 1) {
      this.x = x + (Math.random() - 0.5) * 30;
      this.y = y + (Math.random() - 0.5) * 30;
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 3 + 1) * speedMult;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - Math.random() * 1.5;
      this.size = Math.random() * 2 + 0.8;
      this.life = 1.0;
      this.decay = Math.random() * 0.04 + 0.025;
      const colors = ['#FFFFFF', '#FFF3D1', '#FFC947', '#50CAFF', '#FFA024'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.06;
      this.vx *= 0.94;
      this.life -= this.decay;
    }

    draw(context) {
      context.save();
      context.globalAlpha = Math.max(0, this.life);
      context.fillStyle = this.color;
      context.shadowColor = this.color;
      context.shadowBlur = 6;
      context.beginPath();
      context.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  // Classe para Luzes/Flashes de Arco de Solda Discretas (Arc Flashes)
  class ArcFlash {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = Math.random() * 90 + 110;
      this.life = 1.0;
      this.decay = Math.random() * 0.06 + 0.04;
      this.flicker = Math.random() * 0.4 + 0.8;
      this.colorHue = Math.random() > 0.4 ? 'rgba(80, 202, 255, ' : 'rgba(255, 201, 71, ';
    }

    update() {
      this.life -= this.decay;
      this.flicker = Math.random() * 0.3 + 0.85;
    }

    draw(context) {
      context.save();
      const alpha = Math.max(0, this.life * 0.18 * this.flicker);
      const grad = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, this.colorHue + (alpha * 1.2) + ')');
      grad.addColorStop(0.3, 'rgba(255, 235, 180, ' + (alpha * 0.6) + ')');
      grad.addColorStop(0.7, 'rgba(14, 62, 98, ' + (alpha * 0.2) + ')');
      grad.addColorStop(1, 'rgba(10, 13, 18, 0)');

      context.fillStyle = grad;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  // Evento de movimento do mouse (Computador)
  window.addEventListener('mousemove', (e) => {
    hasUserMovedMouse = true;
    targetX = e.clientX;
    targetY = e.clientY;

    if (Math.random() < 0.25) {
      particles.push(new SparkParticle(targetX, targetY, 0.7));
    }
  });

  // Evento de Scroll (Computador e Celular)
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollSpeed = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    if (scrollSpeed > 2) {
      let spawnX = hasUserMovedMouse ? targetX : (width * (0.2 + Math.random() * 0.6));
      let spawnY = hasUserMovedMouse ? targetY : (height * (0.25 + Math.random() * 0.5));

      if (Math.random() < 0.65) {
        arcFlashes.push(new ArcFlash(
          spawnX + (Math.random() - 0.5) * 80,
          spawnY + (Math.random() - 0.5) * 80
        ));
      }

      const particleCount = Math.min(4, Math.floor(scrollSpeed / 4) + 1);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new SparkParticle(spawnX, spawnY, Math.min(2.2, 1 + scrollSpeed * 0.03)));
      }
    }
  }, { passive: true });

  // Loop de Animação (60fps)
  function animate() {
    ctx.clearRect(0, 0, width, height);

    mouseX += (targetX - mouseX) * 0.12;
    mouseY += (targetY - mouseY) * 0.12;

    const baseRadius = hasUserMovedMouse ? 240 : 200;
    const glowRadius = Math.min(320, Math.max(160, baseRadius + scrollSpeed * 2.5));
    const ambientGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);

    const baseAlpha = hasUserMovedMouse ? 0.14 : 0.08;
    ambientGrad.addColorStop(0, `rgba(255, 215, 130, ${baseAlpha + Math.min(0.08, scrollSpeed * 0.003)})`);
    ambientGrad.addColorStop(0.3, `rgba(201, 145, 55, ${(baseAlpha * 0.6)})`);
    ambientGrad.addColorStop(0.7, 'rgba(14, 62, 98, 0.03)');
    ambientGrad.addColorStop(1, 'rgba(10, 13, 18, 0)');

    ctx.fillStyle = ambientGrad;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    for (let i = arcFlashes.length - 1; i >= 0; i--) {
      const flash = arcFlashes[i];
      flash.update();
      flash.draw(ctx);
      if (flash.life <= 0) {
        arcFlashes.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    scrollSpeed *= 0.90;
    requestAnimationFrame(animate);
  }

  animate();
}
