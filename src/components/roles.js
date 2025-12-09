// Sistema de Roles e Permissões
const ROLES = {
    ADMIN: 'admin',
    PROFISSIONAL: 'profissional',
    PACIENTE: 'paciente'
};

// Configuração de menus por role
const MENU_CONFIG = {
    admin: [
        { id: 'dashboard', icon: 'fas fa-house', text: 'Dashboard', page: 'dashboard.html' },
        { id: 'consultas', icon: 'fas fa-calendar-alt', text: 'Agendamentos', page: 'consulta-agendamentos.html' },
        { id: 'pacientes', icon: 'fas fa-users', text: 'Pacientes', page: 'pacientes.html' },
        { id: 'profissionais', icon: 'fa-solid fa-user-doctor', text: 'Profissionais', page: 'profissionais.html' },
        { id: 'leitos', icon: 'fas fa-bed', text: 'Leitos', page: 'leitos.html' },
        { id: 'telemedicina', icon: 'fas fa-video', text: 'Telemedicina', page: 'telemedicina.html' },
        { id: 'prontuarios', icon: 'fa-solid fa-receipt', text: 'Prontuários', page: 'prontuarios.html' },
        { id: 'relatorios', icon: 'fas fa-chart-line', text: 'Relatórios', page: 'relatorio.html' },
        { id: 'configuracoes', icon: 'fa-solid fa-gear', text: 'Configurações', page: 'configuracoes.html' }
    ],
    profissional: [
        { id: 'dashboard', icon: 'fas fa-house', text: 'Dashboard', page: 'dashboard.html' },
        { id: 'agenda', icon: 'fas fa-calendar-alt', text: 'Minha Agenda', page: 'consulta-agendamentos.html' },
        { id: 'pacientes', icon: 'fas fa-users', text: 'Meus Pacientes', page: 'pacientes.html' },
        { id: 'telemedicina', icon: 'fas fa-video', text: 'Telemedicina', page: 'telemedicina.html' },
        { id: 'prontuarios', icon: 'fa-solid fa-receipt', text: 'Prontuários', page: 'prontuarios.html' }
    ],
    paciente: [
        { id: 'dashboard', icon: 'fas fa-house', text: 'Dashboard', page: 'dashboard.html' },
        { id: 'meus-dados', icon: 'fas fa-user', text: 'Meus Dados', page: 'paciente-dados.html' },
        { id: 'consultas', icon: 'fas fa-calendar-alt', text: 'Minhas Consultas', page: 'paciente-consultas.html' },
        { id: 'telemedicina', icon: 'fas fa-video', text: 'Teleconsulta', page: 'paciente-teleconsulta.html' },
        { id: 'prontuario', icon: 'fa-solid fa-receipt', text: 'Meu Histórico', page: 'paciente-historico.html' }
    ]
};

// Labels dos roles
const ROLE_LABELS = {
    admin: 'Administrador',
    profissional: 'Profissional de Saúde',
    paciente: 'Paciente'
};

// Classe para gerenciar roles
class RoleManager {
    constructor() {
        this.currentRole = this.loadRole();
    }

    // Carregar role do localStorage
    loadRole() {
        const savedRole = localStorage.getItem('userRole');
        return savedRole || ROLES.ADMIN; // Default: admin
    }

    // Salvar role no localStorage
    saveRole(role) {
        if (Object.values(ROLES).includes(role)) {
            localStorage.setItem('userRole', role);
            this.currentRole = role;
            return true;
        }
        return false;
    }

    // Obter role atual
    getCurrentRole() {
        return this.currentRole;
    }

    // Obter label do role
    getRoleLabel(role = null) {
        const targetRole = role || this.currentRole;
        return ROLE_LABELS[targetRole] || 'Usuário';
    }

    // Obter menu do role atual
    getMenu(role = null) {
        const targetRole = role || this.currentRole;
        return MENU_CONFIG[targetRole] || MENU_CONFIG.admin;
    }

    // Trocar role
    switchRole(newRole) {
        if (this.saveRole(newRole)) {
            // Redirecionar para o dashboard ao trocar de role
            window.location.href = '../pages/dashboard.html';
            return true;
        }
        return false;
    }

    // Verificar se tem permissão para acessar uma página
    hasAccess(pageId) {
        const menu = this.getMenu();
        return menu.some(item => item.id === pageId);
    }

    // Obter informações do usuário baseado no role
    getUserInfo() {
        const role = this.getCurrentRole();
        const userNames = {
            admin: 'Administrador',
            profissional: 'Dr. João Silva',
            paciente: 'Maria Santos'
        };

        return {
            name: userNames[role] || 'Usuário',
            role: this.getRoleLabel(role),
            avatar: userNames[role]?.charAt(0) || 'U'
        };
    }
}

// Instância global
window.roleManager = new RoleManager();

// Log para debug
console.log('RoleManager inicializado:', window.roleManager);
console.log('Role atual:', window.roleManager.getCurrentRole());
console.log('Menu:', window.roleManager.getMenu());
