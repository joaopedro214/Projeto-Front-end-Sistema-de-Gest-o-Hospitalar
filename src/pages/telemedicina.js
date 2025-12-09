let teleconsultationsData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadTeleconsultations();
    initModals();
    displayTeleconsultations();
});

// Carregar dados do localStorage
function loadTeleconsultations() {
    const saved = localStorage.getItem('teleconsultations');
    if (saved) {
        teleconsultationsData = JSON.parse(saved);
    } else {
        // Dados padrão
        teleconsultationsData = [
            {
                id: 1,
                patientName: 'Maria Silva',
                doctorName: 'Dr. João Santos',
                date: '2025-12-10',
                time: '10:00',
                serviceType: 'Consulta',
                priority: 'Normal',
                insurance: 'unimed',
                observations: '',
                status: 'agendada'
            },
            {
                id: 2,
                patientName: 'Pedro Costa',
                doctorName: 'Dra. Ana Lima',
                date: '2025-12-12',
                time: '14:30',
                serviceType: 'Retorno',
                priority: 'Normal',
                insurance: 'particular',
                observations: '',
                status: 'agendada'
            },
            {
                id: 3,
                patientName: 'Julia Oliveira',
                doctorName: 'Dr. Carlos Mendes',
                date: '2025-12-12',
                time: '14:00',
                serviceType: 'Retorno',
                priority: 'Normal',
                insurance: 'particular',
                observations: '',
                status: 'agendada'
            }
        ];
        saveTeleconsultations();
    }
}

// Exibir teleconsultas
function displayTeleconsultations() {
    const grid = document.getElementById('teleconsultationsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (teleconsultationsData.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-video-slash"></i>
                </div>
                <h2>Telemedicina</h2>
                <p class="empty-subtitle">Ainda não há teleconsultas registradas.</p>
                <p class="empty-hint">Comece agendando uma.</p>
            </div>
        `;
        return;
    }

    teleconsultationsData.forEach(teleconsultation => {
        const card = document.createElement('div');
        card.className = 'teleconsultation-card';

        const formattedDate = formatDate(teleconsultation.date);

        card.innerHTML = `
            <div class="card-header">
                <div class="card-info">
                    <h3 class="patient-name">${teleconsultation.patientName}</h3>
                    <p class="doctor-name">Dr(a): ${teleconsultation.doctorName}</p>
                </div>
                <i class="fas fa-video card-icon"></i>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <i class="fas fa-calendar"></i>
                    <span>${formattedDate} às ${teleconsultation.time}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-stethoscope"></i>
                    <span>${teleconsultation.serviceType}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-flag"></i>
                    <span>Prioridade: ${teleconsultation.priority}</span>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-edit-card" onclick="openEditModal(${teleconsultation.id})">
                    <i class="fas fa-pen"></i> Editar
                </button>
                <button class="btn btn-delete-card" onclick="deleteTeleconsultation(${teleconsultation.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Abrir modal de edição
function openEditModal(teleconsultationId) {
    const teleconsultation = teleconsultationsData.find(t => t.id === teleconsultationId);
    if (!teleconsultation) return;

    const modal = document.getElementById('editTeleconsultationModal');
    if (!modal) return;

    // Preencher campos do formulário
    document.getElementById('editTeleconsultationId').value = teleconsultation.id;
    document.getElementById('editPatientName').value = teleconsultation.patientName;
    document.getElementById('editDoctorName').value = teleconsultation.doctorName;
    document.getElementById('editDate').value = teleconsultation.date;
    document.getElementById('editTime').value = teleconsultation.time;
    document.getElementById('editServiceType').value = teleconsultation.serviceType;
    document.getElementById('editPriority').value = teleconsultation.priority;
    document.getElementById('editInsurance').value = teleconsultation.insurance || '';
    document.getElementById('editObservations').value = teleconsultation.observations || '';

    // Abrir modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de edição
function closeEditModal() {
    const modal = document.getElementById('editTeleconsultationModal');
    const form = document.getElementById('editTeleconsultationForm');
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

// Fechar modal de nova teleconsulta
function closeNewModal() {
    const modal = document.getElementById('newTeleconsultationModal');
    const form = document.getElementById('newTeleconsultationForm');
    const successMessage = document.getElementById('successMessage');

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

// Inicializar modais
function initModals() {
    // Modal de Nova Teleconsulta
    const newBtn = document.getElementById('newTeleconsultationBtn');
    const newModal = document.getElementById('newTeleconsultationModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const newForm = document.getElementById('newTeleconsultationForm');
    const newModalOverlay = newModal?.querySelector('.modal-overlay');

    if (newBtn && newModal) {
        newBtn.addEventListener('click', () => {
            newModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeNewModal);
    }

    if (newModalOverlay) {
        newModalOverlay.addEventListener('click', closeNewModal);
    }

    if (newForm) {
        newForm.addEventListener('submit', handleNewFormSubmit);
    }

    // Modal de Edição
    const editModal = document.getElementById('editTeleconsultationModal');
    const editCancelBtn = document.getElementById('editCancelBtn');
    const editForm = document.getElementById('editTeleconsultationForm');
    const editModalOverlay = editModal?.querySelector('.modal-overlay');

    if (editCancelBtn) {
        editCancelBtn.addEventListener('click', closeEditModal);
    }

    if (editModalOverlay) {
        editModalOverlay.addEventListener('click', closeEditModal);
    }

    if (editForm) {
        editForm.addEventListener('submit', handleEditFormSubmit);
    }

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (newModal && !newModal.classList.contains('hidden')) {
                closeNewModal();
            }
            if (editModal && !editModal.classList.contains('hidden')) {
                closeEditModal();
            }
        }
    });
}

// Submeter formulário de nova teleconsulta
function handleNewFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('newTeleconsultationForm');
    const formData = new FormData(form);

    const teleconsultation = {
        id: Date.now(),
        patientName: formData.get('patientName'),
        doctorName: formData.get('doctorName'),
        date: formData.get('date'),
        time: formData.get('time'),
        serviceType: formData.get('serviceType'),
        priority: formData.get('priority'),
        insurance: formData.get('insurance') || '',
        observations: formData.get('observations') || '',
        status: 'agendada',
        createdAt: new Date().toISOString()
    };

    teleconsultationsData.push(teleconsultation);
    saveTeleconsultations();
    displayTeleconsultations();

    // Mostrar mensagem de sucesso
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.remove('hidden');
    }

    // Fechar modal após 2 segundos
    setTimeout(() => {
        closeNewModal();
    }, 2000);
}

// Submeter formulário de edição
function handleEditFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('editTeleconsultationForm');
    const formData = new FormData(form);
    const teleconsultationId = parseInt(document.getElementById('editTeleconsultationId').value);

    // Encontrar índice da teleconsulta
    const index = teleconsultationsData.findIndex(t => t.id === teleconsultationId);
    if (index === -1) return;

    // Atualizar dados
    teleconsultationsData[index] = {
        ...teleconsultationsData[index],
        patientName: formData.get('patientName'),
        doctorName: formData.get('doctorName'),
        date: formData.get('date'),
        time: formData.get('time'),
        serviceType: formData.get('serviceType'),
        priority: formData.get('priority'),
        insurance: formData.get('insurance') || '',
        observations: formData.get('observations') || ''
    };

    saveTeleconsultations();
    displayTeleconsultations();

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

// Deletar teleconsulta
function deleteTeleconsultation(teleconsultationId) {
    if (!confirm('Tem certeza que deseja excluir esta teleconsulta?')) {
        return;
    }

    teleconsultationsData = teleconsultationsData.filter(t => t.id !== teleconsultationId);
    saveTeleconsultations();
    displayTeleconsultations();
}

// Salvar no localStorage
function saveTeleconsultations() {
    localStorage.setItem('teleconsultations', JSON.stringify(teleconsultationsData));
}
