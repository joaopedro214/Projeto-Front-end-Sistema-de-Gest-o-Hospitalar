let bedsData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadBeds();
    initModal();
    initNewBedModal();
    displayBeds();

    // Botão de novo leito
    const newBedBtn = document.getElementById('newBedBtn');
    if (newBedBtn) {
        newBedBtn.addEventListener('click', openNewBedModal);
    }
});

// Carregar dados do localStorage
function loadBeds() {
    const saved = localStorage.getItem('beds');
    if (saved) {
        bedsData = JSON.parse(saved);
    } else {
        // Dados padrão conforme a imagem
        bedsData = [
            {
                id: 1,
                bedNumber: '102',
                bedType: 'UTI',
                patientName: '',
                status: 'disponivel'
            },
            {
                id: 2,
                bedNumber: '201',
                bedType: 'Enfermaria',
                patientName: 'Pedro Costa',
                status: 'ocupado'
            },
            {
                id: 3,
                bedNumber: '202',
                bedType: 'Leito normal',
                patientName: '',
                status: 'manutencao'
            },
            {
                id: 4,
                bedNumber: '203',
                bedType: 'Enfermaria',
                patientName: 'Ana Silva',
                status: 'ocupado'
            },
            {
                id: 5,
                bedNumber: '204',
                bedType: 'Leito normal',
                patientName: '',
                status: 'manutencao'
            },
            {
                id: 6,
                bedNumber: '301',
                bedType: 'UTI',
                patientName: '',
                status: 'disponivel'
            }
        ];
        saveBeds();
    }
}

// Exibir leitos
function displayBeds() {
    const grid = document.getElementById('bedsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    bedsData.forEach(bed => {
        const card = document.createElement('div');
        card.className = `bed-card bed-${bed.status}`;

        const bedIcon = getBedIcon(bed.status);
        const statusText = getStatusText(bed.status);

        card.innerHTML = `
            <div class="card-header">
                <h3 class="bed-number">Leito ${bed.bedNumber}</h3>
                <i class="fas fa-bed bed-icon" style="color: ${bedIcon}"></i>
            </div>
            <div class="card-body">
                <p class="bed-type">${bed.bedType}</p>
                <p class="patient-name">${bed.patientName || '-'}</p>
            </div>
            <div class="card-footer">
                <div class="status-dropdown">
                    <button class="status-btn status-${bed.status}" onclick="toggleDropdown(event, ${bed.id})">
                        ${statusText}
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-menu hidden" id="dropdown-${bed.id}">
                        <div class="dropdown-item" onclick="changeStatus(${bed.id}, 'disponivel')">
                            <span class="status-indicator status-disponivel"></span>
                            Disponível
                        </div>
                        <div class="dropdown-item" onclick="changeStatus(${bed.id}, 'ocupado')">
                            <span class="status-indicator status-ocupado"></span>
                            Ocupado
                        </div>
                        <div class="dropdown-item" onclick="changeStatus(${bed.id}, 'manutencao')">
                            <span class="status-indicator status-manutencao"></span>
                            Manutenção
                        </div>
                    </div>
                </div>
                <button class="btn-edit" onclick="openEditModal(${bed.id})">
                    <i class="fas fa-pen"></i> Editar
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Obter cor do ícone baseado no status
function getBedIcon(status) {
    const colors = {
        'disponivel': '#22c55e',
        'ocupado': '#ef4444',
        'manutencao': '#eab308'
    };
    return colors[status] || '#6b7280';
}

// Obter texto do status
function getStatusText(status) {
    const texts = {
        'disponivel': 'Disponível',
        'ocupado': 'Ocupado',
        'manutencao': 'Manutenção'
    };
    return texts[status] || status;
}

// Toggle dropdown de status
function toggleDropdown(event, bedId) {
    event.stopPropagation();
    const dropdown = document.getElementById(`dropdown-${bedId}`);

    // Fechar todos os outros dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu.id !== `dropdown-${bedId}`) {
            menu.classList.add('hidden');
        }
    });

    dropdown.classList.toggle('hidden');
}

// Fechar dropdowns ao clicar fora
document.addEventListener('click', function () {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('hidden');
    });
});

// Mudar status do leito
function changeStatus(bedId, newStatus) {
    const bed = bedsData.find(b => b.id === bedId);
    if (bed) {
        bed.status = newStatus;
        saveBeds();
        displayBeds();
    }
}

// Abrir modal de edição
function openEditModal(bedId) {
    const bed = bedsData.find(b => b.id === bedId);
    if (!bed) return;

    const modal = document.getElementById('editBedModal');
    if (!modal) return;

    // Preencher campos do formulário
    document.getElementById('editBedId').value = bed.id;
    document.getElementById('editBedNumber').value = bed.bedNumber;
    document.getElementById('editBedType').value = bed.bedType;
    document.getElementById('editPatientName').value = bed.patientName || '';
    document.getElementById('editStatus').value = bed.status;

    // Abrir modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de edição
function closeEditModal() {
    const modal = document.getElementById('editBedModal');
    const form = document.getElementById('editBedForm');
    const successMessage = document.getElementById('editSuccessMessage');

    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (form) {
        form.reset();
    }

    if (successMessage) {
        successMessage.classList.add('hidden');
    }
}

// Inicializar modal
function initModal() {
    const modal = document.getElementById('editBedModal');
    const cancelBtn = document.getElementById('editCancelBtn');
    const form = document.getElementById('editBedForm');
    const modalOverlay = modal?.querySelector('.modal-overlay');

    if (!modal) return;

    // Fechar modal
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeEditModal());
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => closeEditModal());
    }

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeEditModal();
        }
    });

    // Submeter formulário
    if (form) {
        form.addEventListener('submit', handleEditFormSubmit);
    }
}

// Submeter formulário de edição
function handleEditFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('editBedForm');
    const formData = new FormData(form);
    const bedId = parseInt(document.getElementById('editBedId').value);

    // Encontrar índice do leito
    const index = bedsData.findIndex(b => b.id === bedId);
    if (index === -1) return;

    // Atualizar dados
    bedsData[index] = {
        ...bedsData[index],
        bedType: formData.get('bedType'),
        patientName: formData.get('patientName') || '',
        status: formData.get('status')
    };

    saveBeds();
    displayBeds();

    // Mostrar mensagem de sucesso
    const successMessage = document.getElementById('editSuccessMessage');
    if (successMessage) {
        successMessage.classList.remove('hidden');
    }

    // Fechar modal após 2 segundos
    setTimeout(() => {
        closeEditModal();
    }, 2000);
}

// Salvar no localStorage
function saveBeds() {
    localStorage.setItem('beds', JSON.stringify(bedsData));
}

// Abrir modal de novo leito
function openNewBedModal() {
    const modal = document.getElementById('newBedModal');
    if (!modal) return;

    // Resetar formulário
    const form = document.getElementById('newBedForm');
    if (form) {
        form.reset();
    }

    // Abrir modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de novo leito
function closeNewBedModal() {
    const modal = document.getElementById('newBedModal');
    const form = document.getElementById('newBedForm');
    const successMessage = document.getElementById('newSuccessMessage');

    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (form) {
        form.reset();
    }

    if (successMessage) {
        successMessage.classList.add('hidden');
    }
}

// Inicializar modal de novo leito
function initNewBedModal() {
    const modal = document.getElementById('newBedModal');
    const cancelBtn = document.getElementById('newCancelBtn');
    const form = document.getElementById('newBedForm');
    const modalOverlay = modal?.querySelector('.modal-overlay');

    if (!modal) return;

    // Fechar modal
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeNewBedModal());
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => closeNewBedModal());
    }

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeNewBedModal();
        }
    });

    // Submeter formulário
    if (form) {
        form.addEventListener('submit', handleNewBedFormSubmit);
    }
}

// Submeter formulário de novo leito
function handleNewBedFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('newBedForm');
    const formData = new FormData(form);

    // Gerar novo ID
    const newId = bedsData.length > 0 ? Math.max(...bedsData.map(b => b.id)) + 1 : 1;

    // Criar novo leito
    const newBed = {
        id: newId,
        bedNumber: formData.get('bedNumber'),
        bedType: formData.get('bedType'),
        patientName: formData.get('patientName') || '',
        status: formData.get('status')
    };

    bedsData.push(newBed);
    saveBeds();
    displayBeds();

    // Mostrar mensagem de sucesso
    const successMessage = document.getElementById('newSuccessMessage');
    if (successMessage) {
        successMessage.classList.remove('hidden');
    }

    // Fechar modal após 2 segundos
    setTimeout(() => {
        closeNewBedModal();
    }, 2000);
}
