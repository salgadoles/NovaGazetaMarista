document.addEventListener('DOMContentLoaded', function() {
    // Inicializa a galeria lightbox
    const gallery = lightGallery(document.querySelector('.gallery-container'), {
        selector: '.gallery-link',
        download: false,
        counter: false,
        plugins: [lgZoom, lgThumbnail],
        mobileSettings: {
            controls: true,
            showCloseIcon: true,
            download: false
        }
    });

    // Filtro por palavras-chave (opcional)
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if(filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                document.querySelectorAll('.gallery-card').forEach(card => {
                    if(filterValue === 'all' || card.getAttribute('data-keywords').includes(filterValue)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});