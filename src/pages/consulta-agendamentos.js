// Dados de exemplo dos agendamentos
const appointmentsData = [
    {
        id: 1,
        time: '09:00',
        patient: 'Maria Silva',
        professional: 'Dr. João Santos',
        type: 'Consulta',
        status: 'confirmada',
        phone: '(11) 98765-4321',
        date: '2024-12-04'
    },
    {
        id: 2,
        time: '10:30',
        patient: 'Pedro Costa',
        professional: 'Dra. Ana Lima',
        type: 'Retorno',
        status: 'agendada',
        phone: '(11) 91234-5678',
        date: '2024-12-04'
    },
    {
        id: 3,
        time: '14:00',
        patient: 'Julia Oliveira',
        professional: 'Dr. Carlos Mendes',
        type: 'Avaliação',
        status: 'realizada',
        phone: '(11) 99876-5432',
        date: '2024-12-04'
    },
    {
        id: 4,
        time: '15:30',
        patient: 'Roberto Alves',
        professional: 'Dr. João Santos',
        type: 'Exame',
        status: 'agendada',
        phone: '(11) 92345-6789',
        date: '2024-12-04'
    },
    {
        id: 5,
        time: '16:00',
        patient: 'Ana Silva',
        professional: 'Dr. Paulo Oliveira',
        type: 'Consulta',
        status: 'agendada',
        phone: '(11) 93456-7890',
        date: '2024-12-04'
    }
];

// Estado da aplicação
let filteredAppointments = [...appointmentsData];
let currentView = 'table';

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    initViewToggle();
    initFilters();
    setTodayDate();
    // Renderiza tabela e cards iniciais para que os botões "Ver detalhes" usem o handler correto
    updateAppointmentsDisplay();
    initNewAppointmentModal();
    initDetailsModal();
    initEditAppointmentModal();
});

// Alternar visualização entre tabela e cards
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const tableView = document.getElementById('tableView');
    const cardsView = document.getElementById('cardsView');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            currentView = view;

            // Atualizar botões
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Mostrar/esconder views
            if (view === 'table') {
                tableView.classList.remove('hidden');
                cardsView.classList.add('hidden');
            } else {
                tableView.classList.add('hidden');
                cardsView.classList.remove('hidden');
            }
        });
    });
}

// Inicializar filtros
function initFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const clearBtn = document.getElementById('clearBtn');

    filterBtn.addEventListener('click', applyFilters);
    clearBtn.addEventListener('click', clearFilters);
}

// Aplicar filtros
function applyFilters() {
    const date = document.getElementById('filterDate').value;
    const professional = document.getElementById('filterProfessional').value;
    const status = document.getElementById('filterStatus').value;
    const search = document.getElementById('filterSearch').value.toLowerCase();

    filteredAppointments = appointmentsData.filter(apt => {
        let match = true;

        if (date && apt.date !== date) match = false;
        if (professional && apt.professional !== getProfessionalName(professional)) match = false;
        if (status && apt.status !== status) match = false;
        if (search && !apt.patient.toLowerCase().includes(search) && !apt.phone.includes(search)) match = false;

        return match;
    });

    updateAppointmentsDisplay();
}

// Limpar filtros
function clearFilters() {
    document.getElementById('filterDate').value = '';
    document.getElementById('filterProfessional').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterSearch').value = '';

    filteredAppointments = [...appointmentsData];
    updateAppointmentsDisplay();
}

// Converter ID para nome do profissional
function getProfessionalName(id) {
    const names = {
        'dr-joao': 'Dr. João Santos',
        'dra-ana': 'Dra. Ana Lima',
        'dr-carlos': 'Dr. Carlos Mendes',
        'dr-paulo': 'Dr. Paulo Oliveira'
    };
    return names[id] || '';
}

// Atualizar exibição de agendamentos
function updateAppointmentsDisplay() {
    updateTable();
    updateCards();
}

// Atualizar tabela
function updateTable() {
    const tbody = document.getElementById('appointmentsTableBody');
    tbody.innerHTML = '';

    if (filteredAppointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #86868b;">Nenhum agendamento encontrado</td></tr>';
        return;
    }

    filteredAppointments.forEach(apt => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${apt.time}</td>
            <td>${apt.patient}</td>
            <td>${apt.professional}</td>
            <td>${apt.type}</td>
            <td><span class="status-badge status-${apt.status}">${capitalize(apt.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" title="Editar" onclick="editAppointment(${apt.id})">
                        <i class="fas fa-pen"></i>Editar
                    </button>
                    <button class="btn-delete" title="Excluir" onclick="deleteAppointment(${apt.id})">
                        <i class="fas fa-trash"></i>Excluir
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Atualizar cards
function updateCards() {
    const cardsContainer = document.getElementById('appointmentsCards');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = '';

    if (filteredAppointments.length === 0) {
        cardsContainer.innerHTML = '<p style="text-align: center; color: #86868b; grid-column: 1/-1;">Nenhum agendamento encontrado</p>';
        return;
    }

    filteredAppointments.forEach(apt => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-time">${apt.time}</div>
                <span class="status-badge status-${apt.status}">${capitalize(apt.status)}</span>
            </div>
            <div class="card-body">
                <div class="card-patient">
                    <i class="fas fa-user"></i>
                    <span>${apt.patient}</span>
                </div>
                <div class="card-professional">
                    <i class="fas fa-user-doctor"></i>
                    <span>${apt.professional}</span>
                </div>
                <div class="card-type">
                    <i class="fas fa-stethoscope"></i>
                    <span>${apt.type}</span>
                </div>
                <div class="card-phone">
                    <i class="fas fa-phone"></i>
                    <span>${apt.phone}</span>
                </div>
            </div>
            <div class="card-actions">
                <div class="action-buttons">
                    <button class="btn-edit" title="Editar" onclick="editAppointment(${apt.id})">
                        <i class="fas fa-pen"></i>Editar
                    </button>
                    <button class="btn-delete" title="Excluir" onclick="deleteAppointment(${apt.id})">
                        <i class="fas fa-trash"></i>Excluir
                    </button>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}

// Definir data de hoje como padrão
function setTodayDate() {
    const today = new Date(2024, 11, 4).toISOString().split('T')[0];
    document.getElementById('filterDate').value = today;
}

// Funções de ação
function viewDetails(id) {
    openDetailsModal(id);
}

function editAppointment(id) {
    openEditModal(id);
}

function cancelAppointment(id) {
    const apt = appointmentsData.find(a => a.id === id);
    if (confirm(`Tem certeza que deseja cancelar o agendamento de ${apt.patient}?`)) {
        alert(`Agendamento cancelado`);
    }
}

function deleteAppointment(id) {
    const apt = appointmentsData.find(a => a.id === id);
    if (apt && confirm(`Tem certeza que deseja excluir o agendamento de ${apt.patient}?`)) {
        const index = appointmentsData.findIndex(a => a.id === id);
        if (index !== -1) {
            appointmentsData.splice(index, 1);
            filteredAppointments = [...appointmentsData];
            updateAppointmentsDisplay();
            alert(`Agendamento de ${apt.patient} excluído com sucesso!`);
        }
    }
}

// Função auxiliar
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// Modal de Novo Agendamento
// ============================================

function initNewAppointmentModal() {
    const newAppointmentBtn = document.getElementById('newAppointmentBtn');
    const modal = document.getElementById('newAppointmentModal');
    const cancelBtn = document.getElementById('cancelEditAppointmentBtn');
    const form = document.getElementById('appointmentForm');
    const modalOverlay = modal?.querySelector('.modal-overlay');

    if (!newAppointmentBtn || !modal) return;

    // Abrir modal
    newAppointmentBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Definir data de hoje como padrão (não obrigatório, mas útil)
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            // Não definir automaticamente, deixar o usuário escolher
            dateInput.value = '';
            dateInput.min = today; // Não permitir datas passadas
        }

        // Focar no primeiro campo
        const firstInput = document.getElementById('patientSearch');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    });

    // Fechar modal ao clicar no botão cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            closeAppointmentModal();
        });
    }

    // Fechar modal ao clicar no overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            closeAppointmentModal();
        });
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeAppointmentModal();
        }
    });

    // Submeter formulário
    if (form) {
        form.addEventListener('submit', handleAppointmentSubmit);
    }
}

function closeAppointmentModal() {
    const modal = document.getElementById('newAppointmentModal');
    const form = document.getElementById('appointmentForm');

    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (form) {
        form.reset();
        // Remover mensagens de erro se existirem
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }
}

// Manipular submissão do formulário de novo agendamento
function handleAppointmentSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Validar campos obrigatórios
    const patientSearch = document.getElementById('patientSearch').value.trim();
    const doctorSearch = document.getElementById('doctorSearch').value.trim();
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const serviceType = document.getElementById('serviceType').value;

    // Validação básica
    if (!patientSearch) {
        showFieldError('patientSearch', 'Por favor, selecione um paciente');
        return;
    }

    if (!doctorSearch) {
        showFieldError('doctorSearch', 'Por favor, selecione um médico');
        return;
    }

    if (!date) {
        showFieldError('appointmentDate', 'Por favor, selecione uma data');
        return;
    }

    if (!time) {
        showFieldError('appointmentTime', 'Por favor, selecione um horário');
        return;
    }

    // Criar objeto do agendamento
    const newAppointment = {
        id: appointmentsData.length + 1,
        patient: patientSearch,
        professional: doctorSearch,
        date: date,
        time: time,
        type: serviceType,
        status: 'agendada',
        priority: document.getElementById('priority').value,
        insurance: document.getElementById('insurance').value,
        observations: document.getElementById('observations').value
    };

    // Adicionar aos dados
    appointmentsData.push(newAppointment);
    filteredAppointments = [...appointmentsData];

    // Atualizar exibição
    updateAppointmentsDisplay();

    // Fechar modal
    closeAppointmentModal();

    // Mostrar mensagem de sucesso
    alert(`Agendamento confirmado para ${newAppointment.patient} em ${formatDate(date)} às ${time}`);
}

// Mostrar mensagem de erro em um campo específico
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Remover erro anterior se existir
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Adicionar mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#d70015';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;

    field.parentElement.appendChild(errorDiv);
    field.style.borderColor = '#d70015';

    // Remover erro quando o campo for modificado
    field.addEventListener('input', function removeError() {
        field.style.borderColor = '#d2d2d7';
        const error = field.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
        }
        field.removeEventListener('input', removeError);
    });
}

// Formatar data para dd/mm/aaaa
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// ============================================
// Modal de Detalhes do Agendamento
// ============================================
function initDetailsModal() {
    const modal = document.getElementById('detailsModal');
    const closeBtn = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    if (!modal) return;

    // Fechar via botão (ícone)
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDetailsModal);
    }

    // Fechar via botão "Fechar" no footer
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDetailsModal);
    }

    // Editar: abre o modal de edição
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const id = parseInt(editBtn.dataset.id, 10);
            if (!isNaN(id)) {
                closeDetailsModal();
                openEditModal(id);
            }
        });
    }

    // Deletar: confirma e chama cancelAppointment (ou remove)
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const id = parseInt(deleteBtn.dataset.id, 10);
            if (isNaN(id)) return;
            const apt = appointmentsData.find(a => a.id === id);
            if (!apt) return;
            if (confirm(`Tem certeza que deseja excluir o agendamento de ${apt.patient}?`)) {
                // Remover do array de dados
                const idx = appointmentsData.findIndex(a => a.id === id);
                if (idx !== -1) appointmentsData.splice(idx, 1);
                filteredAppointments = [...appointmentsData];
                updateAppointmentsDisplay();
                closeDetailsModal();
            }
        });
    }

    // Fechar ao clicar fora do conteúdo (overlay)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDetailsModal();
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeDetailsModal();
        }
    });
}

function openDetailsModal(id) {
    const modal = document.getElementById('detailsModal');
    const modalPatientName = document.getElementById('modalPatientName');
    const modalBody = document.getElementById('modalBody');
    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    const apt = appointmentsData.find(a => a.id === id);
    if (!apt || !modal || !modalBody || !modalPatientName) {
        alert('Detalhes não encontrados');
        return;
    }

    // Popular conteúdo do modal
    modalPatientName.textContent = apt.patient || 'Detalhes do Agendamento';

    // Define a cor do badge de status
    let statusColor = '#d1fae5'; // confirmada (verde)
    let statusTextColor = '#065f46';

    if (apt.status === 'agendada') {
        statusColor = '#dbeafe'; // azul
        statusTextColor = '#1e40af';
    } else if (apt.status === 'realizada') {
        statusColor = '#f0fdf4'; // verde claro
        statusTextColor = '#166534';
    } else if (apt.status === 'cancelada') {
        statusColor = '#fee2e2'; // vermelho
        statusTextColor = '#991b1b';
    }

    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <strong>Data:</strong>
                <p>${formatDate(apt.date || '')}</p>
            </div>
            <div>
                <strong>Horário:</strong>
                <p>${apt.time || 'Não informado'}</p>
            </div>
            <div>
                <strong>Profissional:</strong>
                <p>${apt.professional || 'Não informado'}</p>
            </div>
            <div>
                <strong>Tipo:</strong>
                <p>${apt.type || 'Não informado'}</p>
            </div>
            <div>
                <strong>Status:</strong>
                <p><span style="padding: 4px 8px; border-radius: 4px; background: ${statusColor}; color: ${statusTextColor};">${capitalize(apt.status || 'agendada')}</span></p>
            </div>
            <div>
                <strong>Telefone:</strong>
                <p>${apt.phone || 'Não informado'}</p>
            </div>
            ${apt.priority ? `
            <div>
                <strong>Prioridade:</strong>
                <p>${capitalize(apt.priority)}</p>
            </div>
            ` : ''}
            ${apt.insurance ? `
            <div>
                <strong>Convênio:</strong>
                <p>${apt.insurance}</p>
            </div>
            ` : ''}
            ${apt.observations ? `
            <div style="grid-column: 1 / -1;">
                <strong>Observações:</strong>
                <p>${apt.observations}</p>
            </div>
            ` : ''}
        </div>
    `;

    // Armazenar id nos botões para ações futuras
    if (editBtn) editBtn.dataset.id = id;
    if (deleteBtn) deleteBtn.dataset.id = id;

    modal.classList.remove('hidden');
}

function closeDetailsModal() {
    const modal = document.getElementById('detailsModal');
    if (!modal) return;
    modal.classList.add('hidden');
}

// ============================================
// Modal de Edição de Agendamento
// ============================================
function openEditModal(id) {
    const apt = appointmentsData.find(a => a.id === id);
    if (!apt) {
        alert('Agendamento não encontrado');
        return;
    }

    const modal = document.getElementById('editAppointmentModal');
    if (!modal) return;

    // Preencher os campos do formulário com os dados do agendamento
    const patientSearch = modal.querySelector('#patientSearch');
    const doctorSearch = modal.querySelector('#doctorSearch');
    const appointmentDate = modal.querySelector('#appointmentDate');
    const appointmentTime = modal.querySelector('#appointmentTime');
    const serviceType = modal.querySelector('#serviceType');
    const priority = modal.querySelector('#priority');
    const insurance = modal.querySelector('#insurance');
    const observations = modal.querySelector('#observations');

    if (patientSearch) patientSearch.value = apt.patient || '';
    if (doctorSearch) doctorSearch.value = apt.professional || '';
    if (appointmentDate) appointmentDate.value = apt.date || '';
    if (appointmentTime) appointmentTime.value = apt.time || '';
    if (serviceType) serviceType.value = apt.type || 'Consulta';
    if (priority) priority.value = apt.priority || 'Normal';
    if (insurance) insurance.value = apt.insurance || '';
    if (observations) observations.value = apt.observations || '';

    // Armazenar o ID do agendamento para atualização
    modal.dataset.editingId = id;

    // Abrir modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeEditModal() {
    const modal = document.getElementById('editAppointmentModal');
    if (!modal) return;

    modal.classList.add('hidden');
    document.body.style.overflow = '';
    delete modal.dataset.editingId;
}

function initEditAppointmentModal() {
    const modal = document.getElementById('editAppointmentModal');
    if (!modal) return;

    const cancelBtn = modal.querySelector('#cancelAppointmentBtn');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const form = modal.querySelector('#appointmentForm');

    // Fechar modal ao clicar no botão cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeEditModal();
        });
    }

    // Fechar modal ao clicar no overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            closeEditModal();
        });
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeEditModal();
        }
    });

    // Submeter formulário de edição
    if (form) {
        form.addEventListener('submit', handleEditSubmit);
    }
}

function handleEditSubmit(e) {
    e.preventDefault();

    const modal = document.getElementById('editAppointmentModal');
    const editingId = parseInt(modal.dataset.editingId, 10);

    if (isNaN(editingId)) {
        alert('Erro ao identificar o agendamento');
        return;
    }

    // Buscar os dados do formulário
    const patientSearch = document.querySelector('#editAppointmentModal #patientSearch').value.trim();
    const doctorSearch = document.querySelector('#editAppointmentModal #doctorSearch').value.trim();
    const date = document.querySelector('#editAppointmentModal #appointmentDate').value;
    const time = document.querySelector('#editAppointmentModal #appointmentTime').value;
    const serviceType = document.querySelector('#editAppointmentModal #serviceType').value;

    // Validação básica
    if (!patientSearch || !doctorSearch || !date || !time) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    // Encontrar e atualizar o agendamento
    const aptIndex = appointmentsData.findIndex(a => a.id === editingId);
    if (aptIndex === -1) {
        alert('Agendamento não encontrado');
        return;
    }

    appointmentsData[aptIndex] = {
        ...appointmentsData[aptIndex],
        patient: patientSearch,
        professional: doctorSearch,
        date: date,
        time: time,
        type: serviceType,
        priority: document.querySelector('#editAppointmentModal #priority').value,
        insurance: document.querySelector('#editAppointmentModal #insurance').value,
        observations: document.querySelector('#editAppointmentModal #observations').value
    };

    // Atualizar lista filtrada
    filteredAppointments = [...appointmentsData];

    // Atualizar exibição
    updateAppointmentsDisplay();

    // Fechar modal
    closeEditModal();

    // Mostrar mensagem de sucesso
    alert(`Agendamento de ${patientSearch} atualizado com sucesso!`);
}
