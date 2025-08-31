document.addEventListener('DOMContentLoaded', function() {
    console.log('Galeria script carregado');
    
    let lightGalleryInstance = null; // Variável para armazenar a instância
    
    // Adiciona estilos de animação (FUNÇÃO QUE ESTAVA FALTANDO)
    function addAnimationStyles() {
        if (!document.getElementById('gallery-animations')) {
            const style = document.createElement('style');
            style.id = 'gallery-animations';
            style.textContent = `
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .gallery-card {
                    animation: fadeInUp 0.6s ease forwards;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Animação de entrada dos cards (FUNÇÃO QUE ESTAVA FALTANDO)
    function animateGalleryCards() {
        const galleryCards = document.querySelectorAll('.gallery-card');
        
        galleryCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
        });
    }

    // Fallback para caso o lightGallery não funcione (FUNÇÃO QUE ESTAVA FALTANDO)
    function setupFallbackGallery() {
        console.log('Configurando fallback gallery');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Cria um modal simples como fallback
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                modal.style.zIndex = '9999';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.cursor = 'pointer';

                const img = document.createElement('img');
                img.src = this.href;
                img.style.maxWidth = '90%';
                img.style.maxHeight = '90%';
                img.style.objectFit = 'contain';
                img.style.borderRadius = '8px';

                // Botão de fechar
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '×';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '20px';
                closeBtn.style.right = '20px';
                closeBtn.style.background = '#e74c3c';
                closeBtn.style.color = 'white';
                closeBtn.style.border = 'none';
                closeBtn.style.borderRadius = '50%';
                closeBtn.style.width = '50px';
                closeBtn.style.height = '50px';
                closeBtn.style.fontSize = '24px';
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.zIndex = '10000';

                modal.appendChild(img);
                modal.appendChild(closeBtn);
                document.body.appendChild(modal);

                // Fechar modal
                function closeModal() {
                    document.body.removeChild(modal);
                    document.body.style.overflow = '';
                }

                modal.addEventListener('click', function(e) {
                    if (e.target === modal) closeModal();
                });

                closeBtn.addEventListener('click', closeModal);

                // Tecla ESC para fechar
                document.addEventListener('keydown', function escHandler(e) {
                    if (e.key === 'Escape') {
                        closeModal();
                        document.removeEventListener('keydown', escHandler);
                    }
                });

                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Inicializa a galeria lightbox
    function initLightGallery() {
        const galleryContainer = document.getElementById('lightgallery');
        
        if (!galleryContainer) {
            console.error('Container da galeria não encontrado');
            return;
        }

        // Destrói instância existente se houver
        if (lightGalleryInstance) {
            try {
                lightGalleryInstance.destroy();
                lightGalleryInstance = null;
            } catch (e) {
                console.warn('Erro ao destruir instância anterior:', e);
            }
        }

        // Verifica se lightGallery está disponível
        if (typeof lightGallery !== 'undefined') {
            try {
                console.log('LightGallery disponível, inicializando...');
                
                // Inicializa o lightGallery com configurações
                lightGalleryInstance = lightGallery(galleryContainer, {
                    selector: '.gallery-item',
                    download: false,
                    counter: true,
                    plugins: [lgZoom, lgThumbnail],
                    mobileSettings: {
                        controls: true,
                        showCloseIcon: true,
                        download: false,
                        closeOnTap: true
                    },
                    speed: 300,
                    mode: 'lg-slide',
                    cssEasing: 'ease',
                    backdropDuration: 300,
                    hideBarsDelay: 3000,
                    allowMediaOverlap: false,
                    toggleThumb: true,
                    showMaximizeIcon: true,
                    actualSize: false,
                    enableDrag: true,
                    enableSwipe: true,
                    closable: true,
                    loop: true,
                    escKey: true,
                    keyPress: true,
                    controls: true,
                    onAfterOpen: function() {
                        console.log('LightGallery aberto');
                        document.body.style.overflow = 'hidden';
                    },
                    onAfterClose: function() {
                        console.log('LightGallery fechado');
                        document.body.style.overflow = '';
                    }
                });

                console.log('LightGallery inicializado com sucesso!');

            } catch (error) {
                console.error('Erro ao inicializar LightGallery:', error);
                setupFallbackGallery();
            }
        } else {
            console.warn('LightGallery não está disponível');
            setupFallbackGallery();
        }
    }

    // Inicialização principal
    function initializeGallery() {
        addAnimationStyles();
        animateGalleryCards();
        
        // Aguarda o carregamento completo das bibliotecas
        if (typeof lightGallery !== 'undefined' && typeof lgZoom !== 'undefined' && typeof lgThumbnail !== 'undefined') {
            initLightGallery();
        } else {
            // Tenta novamente após um tempo
            const checkInterval = setInterval(function() {
                if (typeof lightGallery !== 'undefined' && typeof lgZoom !== 'undefined' && typeof lgThumbnail !== 'undefined') {
                    clearInterval(checkInterval);
                    initLightGallery();
                }
            }, 100);
            
            // Timeout após 3 segundos
            setTimeout(function() {
                clearInterval(checkInterval);
                if (typeof lightGallery === 'undefined') {
                    console.warn('LightGallery não carregado após 3 segundos, usando fallback');
                    setupFallbackGallery();
                }
            }, 3000);
        }
    }

    // Inicializa a galeria
    initializeGallery();

    // Limpa a instância quando a página for descarregada
    window.addEventListener('beforeunload', function() {
        if (lightGalleryInstance) {
            try {
                lightGalleryInstance.destroy();
            } catch (e) {
                console.warn('Erro ao limpar lightGallery:', e);
            }
        }
    });

    // Expor a função globalmente para poder chamar manualmente
    window.initLightGallery = initLightGallery;
    window.destroyLightGallery = function() {
        if (lightGalleryInstance) {
            lightGalleryInstance.destroy();
            lightGalleryInstance = null;
        }
    };
});