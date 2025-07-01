/**
 * ==============================================
 * ARQUIVO PRINCIPAL DE JAVASCRIPT - GAZETA MARISTA
 * ==============================================
 *
 * @description Script principal para interatividade do site Gazeta Marista.
 * Gerencia o menu mobile, busca, carrosséis, widget de clima
 * e a otimização da tela de carregamento.
 * @version 2.0
 */

document.addEventListener('DOMContentLoaded', function () {

    // --- LÓGICA DA TELA DE CARREGAMENTO ---

    /**
     * Gerencia a tela de carregamento inicial.
     * Esconde a tela assim que o DOM está pronto (HTML carregado), proporcionando uma
     * percepção de carregamento muito mais rápida ao não esperar por imagens e outros recursos.
     */
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Um pequeno delay para garantir que a animação seja visível antes de sumir.
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Remove o elemento da DOM após a transição para limpar o HTML.
            loadingScreen.addEventListener('transitionend', () => {
                loadingScreen.remove();
            });
        }, 500);
    }


    // --- SELETORES GLOBAIS E ESTADO DA APLICAÇÃO ---

    /**
     * Objeto que centraliza os seletores de elementos da DOM para fácil acesso e manutenção.
     */
    const DOM = {
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileMenu: document.getElementById('mobileMenu'),
        searchBtn: document.getElementById('searchBtn'),
        searchInput: document.getElementById('searchInput'),
        allNewsContainer: document.getElementById('allNews'),
        searchResultsContainer: document.getElementById('searchResultsContainer'),
        searchResults: document.getElementById('searchResults'),
        searchResultsTitle: document.getElementById('searchResultsTitle'),
        newsCards: document.querySelectorAll('.news-card'),
        currentYearElement: document.getElementById('currentYear'),
        editionBanner: document.getElementById('editionBanner'),
    };

    /**
     * Objeto que armazena o estado dinâmico da aplicação.
     */
    const state = {
        isMobileMenuOpen: false,
    };


    // --- FUNÇÕES DE INTERFACE E INICIALIZAÇÃO (UI) ---

    /**
     * Atualiza o ano no rodapé para o ano corrente.
     */
    function updateFooterYear() {
        if (DOM.currentYearElement) {
            DOM.currentYearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Renderiza o banner da edição atual com o ano corrente.
     */
    function renderEditionBanner() {
        if (DOM.editionBanner) {
            const year = new Date().getFullYear();
            DOM.editionBanner.textContent = `Edição nº 04 – ${year}`;
        }
    }

    /**
     * Anima a entrada dos cards de notícias com um efeito de fade-in.
     */
    function animateNewsCards() {
        DOM.newsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        });
    }

    /**
     * Configura todos os ouvintes de eventos da página.
     */
    function setupEventListeners() {
        if (DOM.mobileMenuBtn) DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        if (DOM.searchBtn) DOM.searchBtn.addEventListener('click', performSearch);
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }

        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }


    // --- LÓGICA DO MENU (MOBILE E CARROSSEL) ---

    /**
     * Alterna a visibilidade do menu mobile.
     */
    function toggleMobileMenu() {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;
        DOM.mobileMenu.classList.toggle('active', state.isMobileMenuOpen);
        DOM.mobileMenuBtn.setAttribute('aria-expanded', state.isMobileMenuOpen);
    }

    /**
     * Fecha o menu mobile se estiver aberto.
     */
    function closeMobileMenu() {
        if (state.isMobileMenuOpen) {
            toggleMobileMenu();
        }
    }

    /**
     * Inicializa a funcionalidade de carrossel para o menu de navegação desktop.
     */
    function initMenuCarousel() {
        const menuContainer = document.querySelector('.menu-container');
        const menu = document.querySelector('.menu');
        const arrowLeft = document.querySelector('.nav-arrow-left');
        const arrowRight = document.querySelector('.nav-arrow-right');

        if (!menuContainer || !menu || !arrowLeft || !arrowRight) return;
        
        const updateArrows = () => {
            const scrollLeft = menuContainer.scrollLeft;
            const scrollWidth = menu.scrollWidth;
            const clientWidth = menuContainer.clientWidth;
            
            arrowLeft.classList.toggle('hidden', scrollLeft <= 0);
            arrowRight.classList.toggle('hidden', scrollLeft >= scrollWidth - clientWidth - 1);
        };

        arrowLeft.addEventListener('click', () => menuContainer.scrollBy({ left: -200, behavior: 'smooth' }));
        arrowRight.addEventListener('click', () => menuContainer.scrollBy({ left: 200, behavior: 'smooth' }));
        menuContainer.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        updateArrows();
    }


    // --- LÓGICA DE PESQUISA ---

    /**
     * Orquestra o processo de busca de notícias.
     */
    function performSearch() {
        const searchTerm = DOM.searchInput.value.trim().toLowerCase();
        if (searchTerm.length < 2) {
            alert('Por favor, digite pelo menos 2 caracteres para buscar.');
            return;
        }
        
        const results = filterNewsCards(searchTerm);
        displaySearchResults(results, searchTerm);
    }

    /**
     * Filtra os cards de notícia com base no termo de busca.
     * @param {string} searchTerm - O termo a ser buscado.
     * @returns {Array<HTMLElement>} Uma lista de elementos de card que correspondem à busca.
     */
    function filterNewsCards(searchTerm) {
        const matchedCards = [];
        DOM.newsCards.forEach(card => {
            const keywords = (card.dataset.keywords || '').toLowerCase();
            const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
            const content = (card.querySelector('p')?.textContent || '').toLowerCase();

            if (keywords.includes(searchTerm) || title.includes(searchTerm) || content.includes(searchTerm)) {
                matchedCards.push(card);
            }
        });
        return matchedCards;
    }
    
    /**
     * Exibe os resultados da busca na interface.
     * @param {Array<HTMLElement>} results - A lista de cards correspondentes.
     * @param {string} searchTerm - O termo que foi buscado.
     */
    function displaySearchResults(results, searchTerm) {
        DOM.searchResults.innerHTML = ''; // Limpa resultados anteriores

        if (results.length === 0) {
            DOM.searchResultsTitle.textContent = `Nenhum resultado encontrado para "${searchTerm}"`;
        } else {
            DOM.searchResultsTitle.textContent = `${results.length} resultado(s) para "${searchTerm}"`;
            results.forEach(card => {
                const clonedCard = card.cloneNode(true);
                const highlightedCard = highlightSearchTerms(clonedCard, searchTerm);
                DOM.searchResults.appendChild(highlightedCard);
            });
        }
        
        DOM.allNewsContainer.classList.add('hidden');
        DOM.searchResultsContainer.classList.remove('hidden');
        DOM.searchResultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Destaca o termo de busca nos títulos e parágrafos dos cards.
     * @param {HTMLElement} card - O elemento do card a ser modificado.
     * @param {string} term - O termo a ser destacado.
     * @returns {HTMLElement} O card com os termos destacados.
     */
    function highlightSearchTerms(card, term) {
        const elementsToHighlight = card.querySelectorAll('h3, p');
        const regex = new RegExp(term, 'gi'); // 'g' para global, 'i' para insensível a maiúsculas/minúsculas
        
        elementsToHighlight.forEach(el => {
            el.innerHTML = el.textContent.replace(regex, match => `<span class="search-highlight">${match}</span>`);
        });
        return card;
    }


    // --- WIDGET DE CLIMA ---

    /**
     * Inicializa o widget de clima, buscando a geolocalização do usuário e, em seguida,
     * os dados da API OpenWeatherMap. Usa Londrina como fallback.
     */
    function initWeatherWidget() {
        // ATENÇÃO: A chave da API está visível no código. Para projetos maiores,
        // o ideal seria usar um backend para proteger a chave.
        const API_KEY = '5968cf52fd3711482404d885547a6757';
        const weatherWidget = document.querySelector('.weather-widget');
        if (!weatherWidget) return;

        const weatherElements = {
            temp: weatherWidget.querySelector('.weather-temp'),
            city: weatherWidget.querySelector('.weather-city'),
            desc: weatherWidget.querySelector('.weather-desc'),
            icon: weatherWidget.querySelector('.weather-icon i'),
            refreshBtn: weatherWidget.querySelector('.weather-refresh')
        };
        
        const fetchWeather = async (lat, lon) => {
            try {
                weatherElements.refreshBtn.classList.add('loading');
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`);
                if (!response.ok) throw new Error('Erro ao buscar dados do clima');
                const data = await response.json();
                updateWeatherUI(data);
            } catch (error) {
                console.error('Erro no widget de clima:', error);
                weatherElements.city.textContent = 'Não disponível';
                weatherElements.temp.textContent = '--°C';
            } finally {
                weatherElements.refreshBtn.classList.remove('loading');
            }
        };

        const updateWeatherUI = (data) => {
            weatherElements.temp.textContent = `${Math.round(data.main.temp)}°C`;
            weatherElements.city.textContent = data.name;
            weatherElements.desc.textContent = data.weather[0].description;
            weatherElements.icon.className = `fas ${getWeatherIcon(data.weather[0].id)}`;
        };

        const getWeatherIcon = (weatherId) => {
            if (weatherId >= 200 && weatherId < 300) return 'fa-bolt';
            if (weatherId >= 300 && weatherId < 400) return 'fa-cloud-rain';
            if (weatherId >= 500 && weatherId < 600) return 'fa-cloud-showers-heavy';
            if (weatherId >= 600 && weatherId < 700) return 'fa-snowflake';
            if (weatherId >= 700 && weatherId < 800) return 'fa-smog';
            if (weatherId === 800) return 'fa-sun';
            if (weatherId > 800) return 'fa-cloud';
            return 'fa-question-circle';
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => fetchWeather(position.coords.latitude, position.coords.longitude),
                    error => {
                        console.error('Erro ao obter localização. Usando fallback para Londrina.', error);
                        fetchWeather(-23.2927, -51.1732); // Coordenadas de Londrina
                    }
                );
            } else {
                console.log('Geolocalização não suportada. Usando fallback para Londrina.');
                fetchWeather(-23.2927, -51.1732);
            }
        };
        
        weatherElements.refreshBtn.addEventListener('click', getLocation);
        getLocation(); // Inicia a busca ao carregar a página
    }


    // --- FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO ---
    
    /**
     * Função de orquestração principal.
     * É chamada uma vez que o DOM está pronto para configurar todas as funcionalidades.
     */
    function main() {
        updateFooterYear();
        renderEditionBanner();
        setupEventListeners();
        animateNewsCards();
        initMenuCarousel();
        // initHighlightsCarousel(); // Deixado comentado pois não há HTML para ele
        initWeatherWidget();
    }

    // --- PONTO DE ENTRADA DA APLICAÇÃO ---
    main();
});