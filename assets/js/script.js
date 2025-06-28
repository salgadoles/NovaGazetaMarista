/**
 * ==============================================
 * ARQUIVO PRINCIPAL DE JAVASCRIPT - GAZETA MARISTA
 * ==============================================
 * Atualização: Banner com Edição nº 04 – Ano atual (sem mês)
 */

document.addEventListener('DOMContentLoaded', function () {
    const DOM = {
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileMenu: document.getElementById('mobileMenu'),
        searchBtn: document.getElementById('searchBtn'),
        searchInput: document.getElementById('searchInput'),
        allNews: document.getElementById('allNews'),
        searchResultsContainer: document.getElementById('searchResultsContainer'),
        searchResults: document.getElementById('searchResults'),
        searchResultsTitle: document.getElementById('searchResultsTitle'),
        newsCards: document.querySelectorAll('.news-card'),
        currentYearElement: document.getElementById('currentYear'),
        editionBanner: document.getElementById('editionBanner')
    };

    const state = {
        isMobileMenuOpen: false,
        currentSearchTerm: '',
        searchResults: []
    };

    function init() {
        mostrarLoading();
        updateFooterYear();
        renderEditionBanner(); // Mostra "Edição nº 04 – 2025"
        setupEventListeners();
        initComponents();
    }

    function mostrarLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => loadingScreen.remove(), 500);
                }, 1000);
            });
        }
    }

    function updateFooterYear() {
        if (DOM.currentYearElement) {
            DOM.currentYearElement.textContent = new Date().getFullYear();
        }
    }

    function renderEditionBanner() {
        const banner = DOM.editionBanner;
        if (!banner) return;

        const year = new Date().getFullYear();
        banner.textContent = `Edição nº 04 – ${year}`;
    }

    function setupEventListeners() {
        DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        DOM.searchBtn.addEventListener('click', performSearch);
        DOM.searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') performSearch();
        });

        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    function initComponents() {
        animateNewsCards();
    }

    function toggleMobileMenu() {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;
        DOM.mobileMenu.classList.toggle('active', state.isMobileMenuOpen);
        DOM.mobileMenuBtn.setAttribute('aria-expanded', state.isMobileMenuOpen);
    }

    function closeMobileMenu() {
        DOM.mobileMenu.classList.remove('active');
        state.isMobileMenuOpen = false;
        DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    function performSearch() {
        const searchTerm = DOM.searchInput.value.trim();
        if (!searchTerm || searchTerm.length < 2) {
            showNotification('Por favor, digite pelo menos 2 caracteres para buscar');
            return;
        }

        state.currentSearchTerm = searchTerm.toLowerCase();
        showLoading(true);

        setTimeout(() => {
            filterNewsCards();
            displaySearchResults();
            showLoading(false);
        }, 300);
    }

    function filterNewsCards() {
        state.searchResults = [];

        DOM.newsCards.forEach(card => {
            const cardData = getCardSearchData(card);
            const isMatch = checkCardMatch(cardData, state.currentSearchTerm);
            if (isMatch) state.searchResults.push(card);
        });
    }

    function getCardSearchData(card) {
        return {
            keywords: card.dataset.keywords?.toLowerCase() || '',
            title: card.querySelector('h3')?.textContent.toLowerCase() || '',
            content: card.querySelector('p')?.textContent.toLowerCase() || ''
        };
    }

    function checkCardMatch(cardData, searchTerm) {
        return cardData.keywords.includes(searchTerm) ||
            cardData.title.includes(searchTerm) ||
            cardData.content.includes(searchTerm);
    }

    function displaySearchResults() {
        DOM.searchResults.innerHTML = '';

        if (state.searchResults.length === 0) {
            DOM.searchResultsTitle.textContent = `Nenhum resultado encontrado para "${state.currentSearchTerm}"`;
            DOM.searchResultsContainer.classList.remove('hidden');
            DOM.allNews.classList.add('hidden');
            return;
        }

        DOM.searchResultsTitle.textContent = `${state.searchResults.length} resultado(s) para "${state.currentSearchTerm}"`;

        state.searchResults.forEach(card => {
            const highlightedCard = highlightSearchTerms(card.cloneNode(true), state.currentSearchTerm);
            DOM.searchResults.appendChild(highlightedCard);
        });

        DOM.searchResultsContainer.classList.remove('hidden');
        DOM.allNews.classList.add('hidden');
        DOM.searchResultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function highlightSearchTerms(card, term) {
        const elements = card.querySelectorAll('h3, p');
        const regex = new RegExp(term, 'gi');
        elements.forEach(el => {
            el.innerHTML = el.textContent.replace(regex,
                match => `<span class="search-highlight">${match}</span>`);
        });
        return card;
    }

    function clearSearch() {
        state.currentSearchTerm = '';
        DOM.searchInput.value = '';
        DOM.searchResultsContainer.classList.add('hidden');
        DOM.allNews.classList.remove('hidden');
    }

    function animateNewsCards() {
        DOM.newsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        });
    }

    function showLoading(show) {
        if (show) {
            DOM.searchBtn.classList.add('loading');
            DOM.searchBtn.innerHTML = '<i class="fas fa-search"></i>';
            DOM.searchBtn.querySelector('i').classList.add('hidden');
        } else {
            DOM.searchBtn.classList.remove('loading');
            DOM.searchBtn.querySelector('i').classList.remove('hidden');
        }
    }

    function showNotification(message) {
        alert(message);
    }

    init();
});

// Navegação carrossel
document.addEventListener('DOMContentLoaded', function() {
    const menuContainer = document.querySelector('.menu-container');
    const menu = document.querySelector('.menu');
    const arrowLeft = document.querySelector('.nav-arrow-left');
    const arrowRight = document.querySelector('.nav-arrow-right');

    if (menuContainer && menu && arrowLeft && arrowRight) {
        const updateArrows = () => {
            const scrollLeft = menuContainer.scrollLeft;
            const scrollWidth = menu.scrollWidth;
            const clientWidth = menuContainer.clientWidth;
            
            arrowLeft.classList.toggle('hidden', scrollLeft <= 0);
            arrowRight.classList.toggle('hidden', scrollLeft >= scrollWidth - clientWidth);
        };

        arrowLeft.addEventListener('click', () => {
            menuContainer.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        });

        arrowRight.addEventListener('click', () => {
            menuContainer.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        });

        menuContainer.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        updateArrows();
    }
});

/**
 * Controle simples para o carrossel de destaques
 */
document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.querySelector('#destaques-carrossel .btn-nav.prev');
  const nextBtn = document.querySelector('#destaques-carrossel .btn-nav.next');
  const cards = Array.from(document.querySelectorAll('#destaques-carrossel .destaque-card'));

  let currentIndex = 0;

  /**
   * Atualiza a visibilidade dos cards conforme o índice atual
   */
  function atualizarVisibilidade() {
    cards.forEach((card, index) => {
      card.hidden = index !== currentIndex;
    });
  }

  // Eventos dos botões de navegação
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    atualizarVisibilidade();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    atualizarVisibilidade();
  });

  // Inicializa mostrando o primeiro card
  atualizarVisibilidade();
});
