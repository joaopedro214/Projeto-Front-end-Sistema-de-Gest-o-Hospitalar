// A função loadSidebar e initSidebarEvents agora estão em sidebar.js e serão chamadas automaticamente
// Não redefina essas funções aqui para evitar conflitos

// Atualização em tempo real dos dados (simulação)
function updateMetrics() {
    const metrics = [
        { selector: '.metric-value', values: [1234, 1235, 1236, 1237] },
    ];

    // Simula atualização de dados a cada 5 segundos
    setInterval(() => {
        console.log('Atualizando métricas...');
        // Aqui você conectaria com sua API real
    }, 5000);
}

// Animação de entrada dos cards
function animateCards() {
    const cards = document.querySelectorAll('.metric-card, .section');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Função principal que agrupa tudo
function initDashboard() {
    // loadSidebar está em sidebar.js e é chamado automaticamente
    // Apenas inicializar animações e métricas
    animateCards();
    updateMetrics();
}

// Inicialização quando o DOM está pronto
document.addEventListener('DOMContentLoaded', initDashboard);
