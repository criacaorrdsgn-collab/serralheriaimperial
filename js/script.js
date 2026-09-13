/**
 * SERRALHERIA IMPERIAL — INTERAÇÕES E CARROSSEL DINÂMICO
 * JavaScript nativo e performático (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initHeroVideoSound();
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
