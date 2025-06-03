/**
 * ==============================================
 * ARQUIVO PRINCIPAL DE JAVASCRIPT - GAZETA MARISTA
 * ==============================================
 * 
 * Este arquivo contém toda a lógica JavaScript do site,
 * incluindo navegação mobile, sistema de busca e interações.
 * 
 * Organizado em módulos lógicos para fácil manutenção.
 */

/**
 * Módulo Principal - Executado quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', function() {
    // ==============================================
    // SELEÇÃO DE ELEMENTOS DO DOM
    // ==============================================
    const DOM = {
        // Elementos de Navegação
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileMenu: document.getElementById('mobileMenu'),
        
        // Elementos de Busca
        searchBtn: document.getElementById('searchBtn'),
        searchInput: document.getElementById('searchInput'),
        allNews: document.getElementById('allNews'),
        searchResultsContainer: document.getElementById('searchResultsContainer'),
        searchResults: document.getElementById('searchResults'),
        searchResultsTitle: document.getElementById('searchResultsTitle'),
        
        // Elementos de Conteúdo
        newsCards: document.querySelectorAll('.news-card'),
        
        // Elementos do Rodapé
        currentYearElement: document.getElementById('currentYear')
    };

    // ==============================================
    // ESTADO DA APLICAÇÃO
    // ==============================================
    const state = {
        isMobileMenuOpen: false,
        currentSearchTerm: '',
        searchResults: []
    };

    // ==============================================
    // FUNÇÕES DE INICIALIZAÇÃO
    // ==============================================
    
    /**
     * Inicializa o site com configurações básicas
     */
    function init() {
        // Atualiza o ano no rodapé
        updateFooterYear();
        
        // Adiciona event listeners
        setupEventListeners();
        
        // Inicializa componentes
        initComponents();
    }

    /**
     * Atualiza o ano no rodapé automaticamente
     */
    function updateFooterYear() {
        if (DOM.currentYearElement) {
            DOM.currentYearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Configura todos os event listeners
     */
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
        
        // Fecha os resultados da busca ao clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container') && 
                !e.target.closest('#searchResultsContainer') &&
                state.currentSearchTerm) {
                clearSearch();
            }
        });
    }

    /**
     * Inicializa componentes específicos
     */
    function initComponents() {
        // Adiciona animação de fade-in para os cards
        animateNewsCards();
    }

    // ==============================================
    // NAVEGAÇÃO MOBILE
    // ==============================================
    
    /**
     * Alterna a visibilidade do menu mobile
     */
    function toggleMobileMenu() {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;
        
        if (state.isMobileMenuOpen) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
        
        // Atualiza atributo ARIA para acessibilidade
        DOM.mobileMenuBtn.setAttribute('aria-expanded', state.isMobileMenuOpen);
    }

    /**
     * Abre o menu mobile
     */
    function openMobileMenu() {
        DOM.mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Fecha o menu mobile
     */
    function closeMobileMenu() {
        DOM.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        state.isMobileMenuOpen = false;
        DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    // ==============================================
    // SISTEMA DE BUSCA
    // ==============================================
    
    /**
     * Executa a busca com o termo fornecido
     */
    function performSearch() {
        const searchTerm = DOM.searchInput.value.trim();
        
        // Verifica se há um termo de busca válido
        if (!searchTerm || searchTerm.length < 2) {
            showNotification('Por favor, digite pelo menos 2 caracteres para buscar');
            return;
        }
        
        // Atualiza o estado
        state.currentSearchTerm = searchTerm.toLowerCase();
        
        // Mostra estado de carregamento
        showLoading(true);
        
        // Simula um delay para a busca (remover em produção)
        setTimeout(() => {
            // Filtra as notícias
            filterNewsCards();
            
            // Exibe os resultados
            displaySearchResults();
            
            // Esconde o estado de carregamento
            showLoading(false);
        }, 300);
    }

    /**
     * Filtra os cards de notícias com base no termo de busca
     */
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

    /**
     * Obtém os dados de busca de um card de notícia
     * @param {HTMLElement} card - O elemento do card de notícia
     * @returns {Object} Dados para busca (keywords, title, content)
     */
    function getCardSearchData(card) {
        return {
            keywords: card.dataset.keywords?.toLowerCase() || '',
            title: card.querySelector('h3')?.textContent.toLowerCase() || '',
            content: card.querySelector('p')?.textContent.toLowerCase() || ''
        };
    }

    /**
     * Verifica se um card corresponde ao termo de busca
     * @param {Object} cardData - Dados do card
     * @param {String} searchTerm - Termo de busca
     * @returns {Boolean} True se houver correspondência
     */
    function checkCardMatch(cardData, searchTerm) {
        return cardData.keywords.includes(searchTerm) || 
               cardData.title.includes(searchTerm) || 
               cardData.content.includes(searchTerm);
    }

    /**
     * Exibe os resultados da busca
     */
    function displaySearchResults() {
        // Limpa resultados anteriores
        DOM.searchResults.innerHTML = '';
        
        // Verifica se há resultados
        if (state.searchResults.length === 0) {
            DOM.searchResultsTitle.textContent = `Nenhum resultado encontrado para "${state.currentSearchTerm}"`;
            DOM.searchResultsContainer.classList.remove('hidden');
            DOM.allNews.classList.add('hidden');
            return;
        }
        
        // Atualiza o título com a contagem
        DOM.searchResultsTitle.textContent = 
            `${state.searchResults.length} resultado(s) para "${state.currentSearchTerm}"`;
        
        // Adiciona os cards correspondentes
        state.searchResults.forEach(card => {
            const highlightedCard = highlightSearchTerms(card.cloneNode(true), state.currentSearchTerm);
            DOM.searchResults.appendChild(highlightedCard);
        });
        
        // Exibe os resultados
        DOM.searchResultsContainer.classList.remove('hidden');
        DOM.allNews.classList.add('hidden');
        
        // Rolagem suave para os resultados
        DOM.searchResultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Destaca os termos buscados no conteúdo
     * @param {HTMLElement} card - Card de notícia
     * @param {String} term - Termo de busca
     * @returns {HTMLElement} Card com termos destacados
     */
    function highlightSearchTerms(card, term) {
        const elements = card.querySelectorAll('h3, p');
        const regex = new RegExp(term, 'gi');
        
        elements.forEach(el => {
            el.innerHTML = el.textContent.replace(regex, 
                match => `<span class="search-highlight">${match}</span>`);
        });
        
        return card;
    }

    /**
     * Limpa a busca e mostra todas as notícias
     */
    function clearSearch() {
        state.currentSearchTerm = '';
        DOM.searchInput.value = '';
        DOM.searchResultsContainer.classList.add('hidden');
        DOM.allNews.classList.remove('hidden');
    }

    // ==============================================
    // ANIMAÇÕES E EFEITOS
    // ==============================================
    
    /**
     * Adiciona animação de entrada para os cards de notícia
     */
    function animateNewsCards() {
        DOM.newsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        });
    }

    // ==============================================
    // UTILITÁRIOS
    // ==============================================
    
    /**
     * Mostra ou esconde o estado de carregamento
     * @param {Boolean} show - Se deve mostrar o loading
     */
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

    /**
     * Mostra uma notificação para o usuário
     * @param {String} message - Mensagem a ser exibida
     */
    function showNotification(message) {
        // Implementação básica - pode ser substituída por um sistema mais robusto
        alert(message); // Em produção, usar um toast ou modal
    }

    // ==============================================
    // INICIALIZAÇÃO DO SITE
    // ==============================================
    init();
});