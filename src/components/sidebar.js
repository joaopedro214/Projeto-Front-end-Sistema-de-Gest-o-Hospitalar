// Carrega a sidebar dinamicamente
function loadSidebar() {
    return fetch('../components/sidebar-component.html')
        .then(response => response.text())
        .then(html => {
            const container = document.getElementById('sidebarContainer');
            if (!container) {
                console.error('Container da sidebar não encontrado');
                return;
            }
            container.innerHTML = html;

            // Remover scripts embutidos para evitar execução duplicada
            const scripts = container.querySelectorAll('script');
            scripts.forEach(script => script.remove());

            // Inicializar componentes após pequeno delay para garantir que DOM está pronto
            setTimeout(() => {
                renderMenuByRole();
                updateUserInfo();
                initSidebarEvents();

                // Inicializar navegação após eventos da sidebar e renderização do menu
                // Delay maior para garantir que o menu foi completamente renderizado
                setTimeout(() => {
                    console.log('🔍 Verificando PageNavigator:', typeof window.PageNavigator);
                    if (window.PageNavigator) {
                        console.log('✅ PageNavigator encontrado, criando instância...');
                        const navigator = new PageNavigator();
                        navigator.initNavigation();
                    } else {
                        console.error('❌ PageNavigator não encontrado!');
                    }
                }, 150);
            }, 100);
        })
        .catch(err => console.error('Erro ao carregar sidebar:', err));
}

// Renderizar menu baseado no role
function renderMenuByRole() {
    const menuContainer = document.getElementById('sidebarMenu');
    if (!menuContainer) {
        console.warn('⚠️ Menu container não encontrado');
        return;
    }

    // Verificar se roleManager existe, senão tentar novamente
    if (!window.roleManager) {
        console.warn('⚠️ RoleManager não disponível para renderizar menu, tentando novamente em 100ms...');
        setTimeout(renderMenuByRole, 100);
        return;
    }

    const currentRole = window.roleManager.getCurrentRole();
    const menu = window.roleManager.getMenu();

    console.log('✅ Renderizando menu para role:', currentRole);
    console.log('📋 Itens do menu:', menu.length);

    // Limpar menu atual
    menuContainer.innerHTML = '';
    // Adicionar itens do menu
    menu.forEach(item => {
        const menuItem = document.createElement('a');
        menuItem.href = `../pages/${item.page}`;
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <i class="menu-icon ${item.icon}"></i>
            <span class="menu-text">${item.text}</span>
        `;
        menuContainer.appendChild(menuItem);
    });

    // Adicionar divisor
    const divider = document.createElement('div');
    divider.className = 'menu-divider';
    menuContainer.appendChild(divider);

    // Adicionar logout
    const logoutItem = document.createElement('a');
    logoutItem.href = '#';
    logoutItem.className = 'menu-item';
    logoutItem.innerHTML = `
        <i class="menu-icon fas fa-right-from-bracket"></i>
        <span class="menu-text">Sair</span>
    `;
    logoutItem.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '../pages/login.html';
    });
    menuContainer.appendChild(logoutItem);
}

// Atualizar informações do usuário
function updateUserInfo() {
    // Verificar se roleManager existe, senão tentar novamente
    if (!window.roleManager) {
        console.warn('RoleManager não disponível para updateUserInfo, tentando novamente...');
        setTimeout(updateUserInfo, 100);
        return;
    }

    const userInfo = window.roleManager.getUserInfo();

    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');

    if (userAvatar) userAvatar.textContent = userInfo.avatar;
    if (userName) userName.textContent = userInfo.name;
    if (userRole) userRole.textContent = userInfo.role;

    console.log('Informações do usuário atualizadas:', userInfo);
}

function initSidebarEvents() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const hamburger = document.getElementById('hamburger');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');

    // Validate all required elements exist
    if (!sidebar) {
        console.error('Sidebar não encontrada');
        return;
    }

    // Evitar múltiplas inicializações
    if (sidebar.hasAttribute('data-initialized')) {
        console.log('Sidebar já inicializada, pulando...');
        return;
    }

    // Marcar como inicializado
    sidebar.setAttribute('data-initialized', 'true');

    if (!mainContent) {
        console.warn('mainContent não encontrado');
    }
    if (!overlay) {
        console.warn('overlay não encontrado');
    }

    // Toggle sidebar collapse/expand (Desktop)
    if (toggleSidebar && sidebar) {
        // Remover event listeners anteriores se existirem (evitar duplicação)
        const newToggleBtn = toggleSidebar.cloneNode(true);
        toggleSidebar.parentNode.replaceChild(newToggleBtn, toggleSidebar);

        newToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Toggle sidebar clicado - estado atual:', sidebar.classList.contains('collapsed'));

            // Toggle das classes
            sidebar.classList.toggle('collapsed');
            if (mainContent) {
                mainContent.classList.toggle('collapsed');
            }

            console.log('Novo estado:', sidebar.classList.contains('collapsed') ? 'colapsado' : 'expandido');
        });
    } else {
        console.warn('Botão toggleSidebar ou sidebar não encontrado', {
            toggleSidebar: !!toggleSidebar,
            sidebar: !!sidebar,
            mainContent: !!mainContent
        });
    }

    // Open sidebar (Mobile)
    if (hamburger) {
        // Remover event listeners anteriores se existirem
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);

        newHamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicado - abrindo sidebar');

            const sidebarContainer = document.getElementById('sidebarContainer');

            console.log('Sidebar element:', sidebar);
            console.log('SidebarContainer element:', sidebarContainer);
            console.log('Overlay element:', overlay);

            if (sidebar && overlay) {
                sidebar.classList.add('active');
                overlay.classList.add('active');

                // Adicionar active também no container
                if (sidebarContainer) {
                    sidebarContainer.classList.add('active');
                }

                console.log('Classes adicionadas - Sidebar classes:', sidebar.className);
                console.log('Classes adicionadas - SidebarContainer classes:', sidebarContainer?.className);
                console.log('Classes adicionadas - Overlay classes:', overlay.className);
            } else {
                console.error('Sidebar ou overlay não encontrados!');
            }
        });
    } else {
        console.warn('Botão hamburger não encontrado. Elementos disponíveis:', {
            hamburger: !!document.getElementById('hamburger'),
            sidebar: !!sidebar,
            overlay: !!overlay
        });
    }

    // Close sidebar (Mobile)
    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            const sidebarContainer = document.getElementById('sidebarContainer');

            sidebar.classList.remove('active');
            overlay.classList.remove('active');

            if (sidebarContainer) {
                sidebarContainer.classList.remove('active');
            }
        });
    }

    overlay.addEventListener('click', () => {
        const sidebarContainer = document.getElementById('sidebarContainer');

        sidebar.classList.remove('active');
        overlay.classList.remove('active');

        if (sidebarContainer) {
            sidebarContainer.classList.remove('active');
        }
    });

    // Menu items navigation is now handled by PageNavigator class in navigation.js
    // O estado ativo será definido pelo initNavigation() que é chamado após o carregamento dos scripts
}

// Auto-inicializar sidebar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ Sidebar: DOMContentLoaded - Inicializando...');
        if (window.roleManager) {
            console.log('✅ RoleManager disponível:', window.roleManager.getCurrentRole());
            loadSidebar();
        } else {
            console.warn('⚠️ RoleManager não disponível, aguardando...');
            setTimeout(loadSidebar, 50);
        }
    });
} else {
    console.log('✅ Sidebar: DOM já carregado - Inicializando...');
    if (window.roleManager) {
        console.log('✅ RoleManager disponível:', window.roleManager.getCurrentRole());
        loadSidebar();
    } else {
        console.warn('⚠️ RoleManager não disponível, aguardando...');
        setTimeout(loadSidebar, 50);
    }
}
