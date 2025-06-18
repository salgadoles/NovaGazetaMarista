/**
 * ==============================================
 * ARQUIVO PRINCIPAL DE JAVASCRIPT - GAZETA MARISTA
 * ==============================================
 * 
 * Versão otimizada com correção para o menu mobile
 */

document.addEventListener('DOMContentLoaded', function() {
    // Seleção de elementos
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
        currentYearElement: document.getElementById('currentYear')
    };

    // Estado da aplicação
    const state = {
        isMobileMenuOpen: false,
        currentSearchTerm: '',
        searchResults: []
    };

    // Inicialização
    function init() {
          // Mostra a tela de carregamento
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
        
        // Esconde a tela quando a página terminar de carregar
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                
                // Remove a tela do DOM após a animação terminar
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1000); // Tempo mínimo que a tela ficará visível
        });
    }
    
    updateFooterYear();
    setupEventListeners();
    initComponents();
    }

    function updateFooterYear() {
        if (DOM.currentYearElement) {
            DOM.currentYearElement.textContent = new Date().getFullYear();
        }
    }

    function setupEventListeners() {
        // Menu Mobile
        DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Sistema de Busca
        DOM.searchBtn.addEventListener('click', performSearch);
        DOM.searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
        
        // Fecha o menu mobile ao clicar em um link
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    function initComponents() {
        animateNewsCards();
    }

    // Menu Mobile
    function toggleMobileMenu() {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;
        
        if (state.isMobileMenuOpen) {
            DOM.mobileMenu.classList.add('active');
        } else {
            DOM.mobileMenu.classList.remove('active');
        }
        
        DOM.mobileMenuBtn.setAttribute('aria-expanded', state.isMobileMenuOpen);
    }

    function closeMobileMenu() {
        DOM.mobileMenu.classList.remove('active');
        state.isMobileMenuOpen = false;
        DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    // Sistema de Busca
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
            
            if (isMatch) {
                state.searchResults.push(card);
            }
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
        
        DOM.searchResultsTitle.textContent = 
            `${state.searchResults.length} resultado(s) para "${state.currentSearchTerm}"`;
        
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

    // Animações
    function animateNewsCards() {
        DOM.newsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        });
    }

    // Utilitários
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
        // Implementação básica - pode ser substituída por um sistema mais robusto
        alert(message);
    }

    // Inicialização
    init();
});

// Navbar carrossel (se necessário)
const menuContainer = document.querySelector('.menu-container');
const menu = document.querySelector('.menu');
const arrowLeft = document.querySelector('.nav-arrow-left');
const arrowRight = document.querySelector('.nav-arrow-right');

if (menuContainer && menu && arrowLeft && arrowRight) {
    const updateArrows = () => {
        const hasOverflow = menu.scrollWidth > menuContainer.clientWidth;
        arrowLeft.classList.toggle('hidden', !hasOverflow || menuContainer.scrollLeft <= 0);
        arrowRight.classList.toggle('hidden', !hasOverflow || 
            menuContainer.scrollLeft >= menu.scrollWidth - menuContainer.clientWidth);
    };

    arrowLeft.addEventListener('click', () => {
        menuContainer.scrollBy({ left: -200, behavior: 'smooth' });
    });

    arrowRight.addEventListener('click', () => {
        menuContainer.scrollBy({ left: 200, behavior: 'smooth' });
    });

    window.addEventListener('resize', updateArrows);
    menuContainer.addEventListener('scroll', updateArrows);
    updateArrows();
}

