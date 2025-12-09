// Classe para gerenciar a navegação e o estado ativo do menu
class PageNavigator {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.loadingDelay = 300;
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        let page = path.substring(path.lastIndexOf('/') + 1);

        // Se não houver página ou for vazio, verificar se é a raiz
        if (!page || page === '' || page.endsWith('/')) {
            page = 'dashboard.html';
        }

        // Se for index.html, considerar como dashboard
        if (page === 'index.html') {
            page = 'dashboard.html';
        }

        // Se houver hash, pode ser uma rota SPA
        if (hash && hash.startsWith('#')) {
            const hashPage = hash.substring(1);
            if (hashPage) {
                page = hashPage;
            }
        }

        return page;
    }

    setActiveMenuItem() {
        const menuItems = document.querySelectorAll('.menu-item');
        const currentPage = this.getCurrentPage();

        console.log('setActiveMenuItem chamado');
        console.log('Página atual:', currentPage);
        console.log('Menu items encontrados:', menuItems.length);

        // Normalizar nome da página atual
        const currentPageName = currentPage.replace('.html', '').toLowerCase();

        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (!href || href === '#') {
                item.classList.remove('active');
                return;
            }

            // Extrair o nome do arquivo do href (pode ser relativo como ../pages/agenda.html)
            let hrefPage = href;
            if (href.includes('/')) {
                hrefPage = href.substring(href.lastIndexOf('/') + 1);
            }

            // Normalizar: remover .html se presente para comparação
            const hrefPageName = hrefPage.replace('.html', '').toLowerCase();

            // Comparar com a página atual (comparação case-insensitive)
            if (hrefPage === currentPage ||
                hrefPageName === currentPageName ||
                (currentPage === '' && hrefPage === 'dashboard.html') ||
                (currentPage === 'index.html' && hrefPage === 'dashboard.html') ||
                (currentPageName === 'dashboard' && hrefPageName === 'dashboard')) {
                console.log('Ativando item:', item.querySelector('.menu-text')?.textContent);
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    initNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');

        console.log('initNavigation chamado');
        console.log('Menu items encontrados:', menuItems.length);

        // Verificar se já foi inicializado para evitar listeners duplicados
        if (menuItems.length > 0 && menuItems[0].hasAttribute('data-navigation-initialized')) {
            console.log('Navegação já inicializada, apenas atualizando estado ativo');
            // Apenas atualizar o estado ativo
            this.setActiveMenuItem();
            return;
        }

        if (menuItems.length === 0) {
            console.error('Nenhum item de menu encontrado! O menu ainda não foi renderizado.');
            return;
        }

        console.log('Inicializando navegação para', menuItems.length, 'itens');

        menuItems.forEach(item => {
            // Marcar como inicializado
            item.setAttribute('data-navigation-initialized', 'true');

            item.addEventListener('click', (e) => {
                const href = item.getAttribute('href');

                // Only prevent default for hash links
                if (href === '#' || !href) {
                    e.preventDefault();
                    return;
                }

                // Update active state before navigation
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Store current page
                this.currentPage = href.substring(href.lastIndexOf('/') + 1);
                localStorage.setItem('lastPage', href);

                // Close sidebar on mobile
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('overlay');
                if (sidebar && overlay && window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
            });
        });

        // Set active menu item based on current page
        console.log('Chamando setActiveMenuItem...');
        this.setActiveMenuItem();
    }
}

// Exportar para o escopo global
window.PageNavigator = PageNavigator;

