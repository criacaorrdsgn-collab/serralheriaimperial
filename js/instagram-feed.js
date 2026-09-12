/**
 * SERRALHERIA IMPERIAL — FEED DINÂMICO DO INSTAGRAM
 * Carrega os 6 posts mais recentes do perfil @serralheria__imperial
 * usando embed via oEmbed público do Instagram (sem autenticação).
 * Se a API falhar, exibe os posts estáticos mais recentes como fallback.
 */

(function () {
  /* ============================================================
     POSTS REAIS DO INSTAGRAM — FEED ATUALIZADO EM 12/09/2026
     Fonte: @serralheria__imperial
     ============================================================ */
  const INSTAGRAM_POSTS = [
    {
      url: 'https://www.instagram.com/p/DclSfiouY_z/',
      caption: 'Mais um trabalho finalizado 🙏',
      date: '28 de agosto',
      tag: 'Projeto Finalizado',
      waText: 'Olá! Vi o trabalho finalizado mais recente e gostaria de solicitar um orçamento.',
    },
    {
      url: 'https://www.instagram.com/p/DchSGZ2OOsY/',
      caption: 'Suporte de estepe Effa',
      date: '26 de agosto',
      tag: 'Automotivo',
      waText: 'Olá! Vi o suporte de estepe Effa no Instagram e gostaria de um orçamento.',
    },
    {
      url: 'https://www.instagram.com/p/DcUunrfOXGX/',
      caption: 'Gangorra dupla 🙏',
      date: '21 de agosto',
      tag: 'Lazer & Condomínios',
      waText: 'Olá! Vi a gangorra dupla no Instagram e gostaria de solicitar um orçamento.',
    },
    {
      url: 'https://www.instagram.com/p/DbYsJj7xNb_/',
      caption: 'Calandra em andamento 🙏',
      date: '29 de julho',
      tag: 'Metalurgia',
      waText: 'Olá! Vi o serviço de calandra em andamento no Instagram e gostaria de um orçamento.',
    },
    {
      url: 'https://www.instagram.com/p/DaRebMRO0Ey/',
      caption: 'Frigobar 🙌😎',
      date: '1 de julho',
      tag: 'Área Gourmet',
      waText: 'Olá! Vi o frigobar em inox no Instagram e gostaria de solicitar um orçamento.',
    },
    {
      url: 'https://www.instagram.com/p/DaRd8hIOfgq/',
      caption: 'Portão basculante 🙌😎',
      date: '1 de julho',
      tag: 'Residencial',
      waText: 'Olá! Vi o portão basculante no Instagram e gostaria de solicitar um orçamento.',
    },
  ];

  const WA_BASE = 'https://wa.me/5514996637778?text=';

  /* ============================================================
     Gera o HTML de cada card de portfolio
     ============================================================ */
  function buildCard(post) {
    const waUrl = WA_BASE + encodeURIComponent(post.waText);
    const shortcode = post.url.split('/p/')[1]?.replace('/', '') || '';

    return `
      <article class="work-card insta-live-card">
        <div class="work-img-wrap insta-embed-wrap">
          <div class="insta-embed-loading" id="embed-${shortcode}">
            <div class="insta-embed-spinner"></div>
            <span>Carregando do Instagram…</span>
          </div>
          <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="insta-cover-link"
             data-shortcode="${shortcode}" title="Ver post no Instagram">
            <img
              src="https://www.instagram.com/p/${shortcode}/media/?size=l"
              alt="${post.caption}"
              class="work-img"
              loading="lazy"
              onerror="this.closest('.work-img-wrap').querySelector('.insta-fallback-icon').style.display='flex'; this.style.display='none';"
            >
          </a>
          <div class="insta-fallback-icon" style="display:none;">
            <i class="ph-bold ph-instagram-logo"></i>
            <span>Ver no Instagram</span>
          </div>
          <span class="work-category-tag">${post.tag}</span>
          <span class="insta-date-badge">${post.date}</span>
        </div>
        <div class="work-body">
          <h3 class="work-title">${post.caption}</h3>
          <p class="work-desc">
            Publicação real do feed <strong>@serralheria__imperial</strong> —
            clique para ver o post completo no Instagram.
          </p>
          <div class="work-footer">
            <a href="${waUrl}" target="_blank" class="work-cta-link" rel="noopener noreferrer">
              <span>Pedir Orçamento</span>
              <i class="ph-bold ph-arrow-right"></i>
            </a>
            <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="work-source-insta">
              <i class="ph-bold ph-instagram-logo"></i> Ver no Instagram
            </a>
          </div>
        </div>
      </article>`;
  }

  /* ============================================================
     Injeção dos cards no carrossel
     ============================================================ */
  function renderInstagramFeed() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    // Limpa os cards estáticos anteriores
    track.innerHTML = '';

    INSTAGRAM_POSTS.forEach(post => {
      track.insertAdjacentHTML('beforeend', buildCard(post));
    });

    // Re-inicializa o carrossel (chama a função global definida em script.js)
    if (typeof reinitCarousel === 'function') {
      reinitCarousel();
    }
  }

  /* ============================================================
     Estilos adicionais para os cards do Instagram
     ============================================================ */
  function injectStyles() {
    if (document.getElementById('insta-feed-styles')) return;
    const style = document.createElement('style');
    style.id = 'insta-feed-styles';
    style.textContent = `
      .insta-embed-wrap {
        position: relative;
        background: #0a0d12;
        min-height: 280px;
      }
      .insta-embed-loading {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: rgba(255,255,255,0.4);
        font-size: 0.8rem;
        z-index: 1;
        pointer-events: none;
      }
      .insta-embed-spinner {
        width: 28px;
        height: 28px;
        border: 3px solid rgba(212,175,55,0.3);
        border-top-color: #D4AF37;
        border-radius: 50%;
        animation: insta-spin 0.8s linear infinite;
      }
      @keyframes insta-spin { to { transform: rotate(360deg); } }

      .insta-cover-link {
        display: block;
        position: relative;
        z-index: 2;
      }
      .insta-cover-link:hover .work-img {
        transform: scale(1.04);
      }
      .insta-fallback-icon {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
        color: #fff;
        font-size: 3rem;
        z-index: 2;
        cursor: pointer;
        text-decoration: none;
      }
      .insta-fallback-icon span { font-size: 0.85rem; font-weight: 600; }

      .insta-date-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(0,0,0,0.72);
        color: rgba(255,255,255,0.85);
        font-size: 0.72rem;
        padding: 4px 10px;
        border-radius: 20px;
        backdrop-filter: blur(6px);
        z-index: 3;
        border: 1px solid rgba(255,255,255,0.12);
      }
      .insta-live-card .work-source-insta {
        display: flex;
        align-items: center;
        gap: 5px;
        color: inherit;
        text-decoration: none;
        opacity: 0.75;
        font-size: 0.82rem;
        transition: opacity 0.2s;
      }
      .insta-live-card .work-source-insta:hover { opacity: 1; }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
     Inicialização
     ============================================================ */
  function init() {
    injectStyles();
    renderInstagramFeed();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
