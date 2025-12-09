// Script helper para inicializar o seletor de role em qualquer página

// Inicializar seletor de role
function initRoleSelector() {
    const roleSelect = document.getElementById('roleSelect');
    if (!roleSelect || !window.roleManager) return;

    // Definir valor atual
    roleSelect.value = window.roleManager.getCurrentRole();

    // Atualizar header com info do usuário
    updateHeaderUserInfo();

    // Listener para mudança de role
    roleSelect.addEventListener('change', (e) => {
        const newRole = e.target.value;
        const roleLabel = window.roleManager.getRoleLabel(newRole);

        if (confirm(`Deseja trocar para o perfil de ${roleLabel}?\n\nVocê será redirecionado para o Dashboard.`)) {
            window.roleManager.switchRole(newRole);
        } else {
            // Reverter seleção se cancelar
            roleSelect.value = window.roleManager.getCurrentRole();
        }
    });
}

// Atualizar informações do usuário no header
function updateHeaderUserInfo() {
    if (!window.roleManager) return;

    const userInfo = window.roleManager.getUserInfo();

    const headerUserName = document.getElementById('headerUserName');
    const headerUserRole = document.getElementById('headerUserRole');
    const headerUserAvatar = document.getElementById('headerUserAvatar');

    if (headerUserName) headerUserName.textContent = userInfo.name;
    if (headerUserRole) headerUserRole.textContent = userInfo.role;
    if (headerUserAvatar) headerUserAvatar.textContent = userInfo.avatar;
}

// Auto-inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initRoleSelector, 200);
    });
} else {
    setTimeout(initRoleSelector, 200);
}
