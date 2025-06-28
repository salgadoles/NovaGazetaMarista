/**
 * ==============================================
 * ARQUIVO PRINCIPAL DE JAVASCRIPT - GAZETA MARISTA
 * ==============================================
 */

document.addEventListener('DOMContentLoaded', function () {
    // --- SELETORES DOM ---
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
        editionBanner: document.getElementById('editionBanner'),
    };

    // --- ESTADO DA APLICAÇÃO ---
    const state = {
        isMobileMenuOpen: false,
        currentSearchTerm: '',
        searchResults: []
    };

    // --- FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO ---
    function init() {
        mostrarLoadingInicial();
        updateFooterYear();
        renderEditionBanner();
        setupEventListeners();
        animateNewsCards();
        initMenuCarousel();
        initHighlightsCarousel();
        initWeatherWidget(); // Inicia o widget de clima
    }

    // --- FUNÇÕES DE INICIALIZAÇÃO E UI ---

    function mostrarLoadingInicial() {
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
        if (DOM.editionBanner) {
            const year = new Date().getFullYear();
            DOM.editionBanner.textContent = `Edição nº 04 – ${year}`;
        }
    }
    
    function animateNewsCards() {
        DOM.newsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        });
    }

    // --- EVENT LISTENERS ---

    function setupEventListeners() {
        if (DOM.mobileMenuBtn) DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        if (DOM.searchBtn) DOM.searchBtn.addEventListener('click', performSearch);
        if (DOM.searchInput) DOM.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // --- MENU MOBILE ---

    function toggleMobileMenu() {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;
        DOM.mobileMenu.classList.toggle('active', state.isMobileMenuOpen);
        DOM.mobileMenuBtn.setAttribute('aria-expanded', state.isMobileMenuOpen);
    }

    function closeMobileMenu() {
        if (state.isMobileMenuOpen) {
            DOM.mobileMenu.classList.remove('active');
            state.isMobileMenuOpen = false;
            DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    // --- LÓGICA DE PESQUISA ---

    function performSearch() {
        const searchTerm = DOM.searchInput.value.trim();
        if (!searchTerm || searchTerm.length < 2) {
            alert('Por favor, digite pelo menos 2 caracteres para buscar');
            return;
        }

        state.currentSearchTerm = searchTerm.toLowerCase();
        // showLoading(true); // Opcional: Adicionar feedback de loading

        setTimeout(() => {
            filterNewsCards();
            displaySearchResults();
            // showLoading(false);
        }, 300);
    }

    function filterNewsCards() {
        state.searchResults = [];
        DOM.newsCards.forEach(card => {
            const cardData = {
                keywords: card.dataset.keywords?.toLowerCase() || '',
                title: card.querySelector('h3')?.textContent.toLowerCase() || '',
                content: card.querySelector('p')?.textContent.toLowerCase() || ''
            };
            const isMatch = cardData.keywords.includes(state.currentSearchTerm) ||
                            cardData.title.includes(state.currentSearchTerm) ||
                            cardData.content.includes(state.currentSearchTerm);
            if (isMatch) state.searchResults.push(card);
        });
    }

    function displaySearchResults() {
        DOM.searchResults.innerHTML = '';

        if (state.searchResults.length === 0) {
            DOM.searchResultsTitle.textContent = `Nenhum resultado encontrado para "${state.currentSearchTerm}"`;
        } else {
            DOM.searchResultsTitle.textContent = `${state.searchResults.length} resultado(s) para "${state.currentSearchTerm}"`;
            state.searchResults.forEach(card => {
                const highlightedCard = highlightSearchTerms(card.cloneNode(true), state.currentSearchTerm);
                DOM.searchResults.appendChild(highlightedCard);
            });
        }
        
        DOM.allNews.classList.add('hidden');
        DOM.searchResultsContainer.classList.remove('hidden');
        DOM.searchResultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    function highlightSearchTerms(card, term) {
        const elements = card.querySelectorAll('h3, p');
        const regex = new RegExp(term, 'gi');
        elements.forEach(el => {
            el.innerHTML = el.textContent.replace(regex, match => `<span class="search-highlight">${match}</span>`);
        });
        return card;
    }

    // --- NAVEGAÇÃO DO MENU (CARROSSEL) ---
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
            arrowRight.classList.toggle('hidden', scrollLeft >= scrollWidth - clientWidth - 1); // -1 para tolerância
        };

        arrowLeft.addEventListener('click', () => menuContainer.scrollBy({ left: -200, behavior: 'smooth' }));
        arrowRight.addEventListener('click', () => menuContainer.scrollBy({ left: 200, behavior: 'smooth' }));
        menuContainer.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        updateArrows();
    }

    // --- CARROSSEL DE DESTAQUES (SIMPLES) ---
    function initHighlightsCarousel() {
      // Esta funcionalidade não estava completa no HTML, se precisar implementar, o código pode ser adicionado aqui.
      // Exemplo:
      // const prevBtn = document.querySelector('#destaques-carrossel .btn-nav.prev');
      // etc.
    }
    
    // ==============================================
    // WIDGET DE CLIMA
    // ==============================================
    function initWeatherWidget() {
        // !! IMPORTANTE: Substitua pela sua chave da API !!
        const API_KEY = '5968cf52fd3711482404d885547a6757'; // SUA CHAVE API AQUI
        
        const weatherWidget = document.querySelector('.weather-widget');
        if (!weatherWidget) return;

        const weatherElements = {
            temp: weatherWidget.querySelector('.weather-temp'),
            city: weatherWidget.querySelector('.weather-city'),
            desc: weatherWidget.querySelector('.weather-desc'),
            icon: weatherWidget.querySelector('.weather-icon i'),
            refreshBtn: weatherWidget.querySelector('.weather-refresh')
        };
        
        async function fetchWeather(lat, lon) {
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
        }

        function updateWeatherUI(data) {
            weatherElements.temp.textContent = `${Math.round(data.main.temp)}°C`;
            weatherElements.city.textContent = data.name;
            weatherElements.desc.textContent = data.weather[0].description;
            weatherElements.icon.className = `fas ${getWeatherIcon(data.weather[0].id)}`;
        }

        function getWeatherIcon(weatherId) {
            if (weatherId >= 200 && weatherId < 300) return 'fa-bolt';
            if (weatherId >= 300 && weatherId < 400) return 'fa-cloud-rain';
            if (weatherId >= 500 && weatherId < 600) return 'fa-cloud-showers-heavy';
            if (weatherId >= 600 && weatherId < 700) return 'fa-snowflake';
            if (weatherId >= 700 && weatherId < 800) return 'fa-smog';
            if (weatherId === 800) return 'fa-sun';
            if (weatherId > 800) return 'fa-cloud';
            return 'fa-question';
        }

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => fetchWeather(position.coords.latitude, position.coords.longitude),
                    error => {
                        console.error('Erro ao obter localização. Usando fallback.', error);
                        fetchWeather(-23.2927, -51.1732); // Coordenadas de Londrina como fallback
                    }
                );
            } else {
                console.log('Geolocalização não suportada. Usando fallback.');
                fetchWeather(-23.2927, -51.1732); // Fallback
            }
        }
        
        weatherElements.refreshBtn.addEventListener('click', getLocation);
        getLocation(); // Inicia a busca ao carregar a página
    }

    // --- INICIA A APLICAÇÃO ---
    init();
});