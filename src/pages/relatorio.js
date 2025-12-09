document.addEventListener('DOMContentLoaded', function () {
    initReportPage();
});

function initReportPage() {
    // Inicializar seletor de período
    const periodSelector = document.getElementById('periodSelector');
    if (periodSelector) {
        periodSelector.addEventListener('change', handlePeriodChange);
    }

    // Inicializar botão de exportar
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExport);
    }

    // Animar barras do gráfico ao carregar
    animateChartBars();

    // Animar progresso dos leitos
    animateProgressBars();
}

function handlePeriodChange(e) {
    const period = e.target.value;
    console.log(`Período selecionado: ${period} dias`);
    
    // Aqui você pode atualizar os dados baseado no período selecionado
    // Por enquanto, apenas mostra uma mensagem
    showNotification(`Dados atualizados para os últimos ${period} dias`);
}

function handleExport() {
    // Simular exportação de PDF
    showNotification('Exportando relatório em PDF...');
    
    setTimeout(() => {
        showNotification('Relatório exportado com sucesso!');
    }, 1500);
}

function animateChartBars() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.opacity = '0';
            bar.style.transform = 'scaleY(0)';
            bar.style.transformOrigin = 'bottom';
            bar.style.transition = 'all 0.6s ease-out';
            
            setTimeout(() => {
                bar.style.opacity = '1';
                bar.style.transform = 'scaleY(1)';
            }, 50);
        }, index * 100);
    });
}

function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    progressFills.forEach((fill, index) => {
        const targetWidth = fill.style.width;
        fill.style.width = '0';
        
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 500 + (index * 200));
    });
}

function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Adicionar estilos inline
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#2b479b',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease-out'
    });
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
