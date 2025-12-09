let medicalRecordsData = [];
let filteredRecords = [];

document.addEventListener('DOMContentLoaded', function () {
    loadMedicalRecords();
    displayMedicalRecords();
    initButtons();
    initFilters();
    initModal();
    applyInputMasks();
});

// Carregar dados do localStorage
function loadMedicalRecords() {
    const saved = localStorage.getItem('medicalRecords');
    if (saved) {
        medicalRecordsData = JSON.parse(saved);
    } else {
        medicalRecordsData = [
            {
                id: 1,
                name: 'Maria Silva',
                cpf: '123.456.789-00',
                phone: '(11) 98765-4321',
                lastConsultation: '15/10/2025',
                birthDate: '1985-03-15',
                email: 'maria.silva@email.com',
                bloodType: 'O+',
                address: 'Rua das Flores, 123',
                allergies: 'Penicilina',
                medications: 'Losartana 50mg',
                medicalHistory: 'Hipertensão',
                mainComplaint: '',
                diagnosis: '',
                prescription: '',
                observations: ''
            },
            {
                id: 2,
                name: 'Pedro Costa',
                cpf: '987.654.321-00',
                phone: '(11) 91234-5678',
                lastConsultation: '20/10/2025',
                birthDate: '1978-07-22',
                email: 'pedro.costa@email.com',
                bloodType: 'A+',
                address: 'Av. Principal, 456',
                allergies: 'Nenhuma alergia conhecida',
                medications: 'Metformina 850mg',
                medicalHistory: 'Diabetes tipo 2',
                mainComplaint: '',
                diagnosis: '',
                prescription: '',
                observations: ''
            },
            {
                id: 3,
                name: 'Julia Oliveira',
                cpf: '456.789.123-00',
                phone: '(11) 99876-5432',
                lastConsultation: '25/10/2025',
                birthDate: '1992-11-10',
                email: 'julia.oliveira@email.com',
                bloodType: 'B+',
                address: 'Praça Central, 789',
                allergies: 'Látex',
                medications: 'Anticoncepcional oral',
                medicalHistory: 'Sem histórico relevante',
                mainComplaint: '',
                diagnosis: '',
                prescription: '',
                observations: ''
            }
        ];
        saveMedicalRecords();
    }
    filteredRecords = [...medicalRecordsData];
}

// Exibir prontuários
function displayMedicalRecords() {
    const tableContainer = document.getElementById('recordsTableContainer');
    const tableBody = document.getElementById('recordsTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tableBody || !emptyState || !tableContainer) return;

    const recordsToDisplay = filteredRecords.length > 0 ? filteredRecords : medicalRecordsData;

    if (recordsToDisplay.length === 0) {
        tableContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    tableContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    tableBody.innerHTML = '';

    recordsToDisplay.forEach(record => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.cpf}</td>
            <td>${record.phone}</td>
            <td>${record.lastConsultation}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editRecord(${record.id})">
                        <i class="fas fa-pen"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="deleteRecord(${record.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Inicializar filtros
function initFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const clearBtn = document.getElementById('clearBtn');
    const searchInput = document.getElementById('filterSearch');

    if (filterBtn) {
        filterBtn.addEventListener('click', applyFilters);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }

    // Busca em tempo real
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

// Aplicar filtros
function applyFilters() {
    const search = document.getElementById('filterSearch')?.value.toLowerCase() || '';
    const bloodType = document.getElementById('filterBloodType')?.value || '';
    const date = document.getElementById('filterDate')?.value || '';

    filteredRecords = medicalRecordsData.filter(record => {
        let match = true;

        // Filtro de busca (nome ou CPF)
        if (search && !record.name.toLowerCase().includes(search) && !record.cpf.includes(search)) {
            match = false;
        }

        // Filtro de tipo sanguíneo
        if (bloodType && record.bloodType !== bloodType) {
            match = false;
        }

        // Filtro de data
        if (date && record.lastConsultation) {
            // Converter data de dd/mm/yyyy para yyyy-mm-dd para comparação
            const [day, month, year] = record.lastConsultation.split('/');
            const recordDate = `${year}-${month}-${day}`;
            if (recordDate !== date) {
                match = false;
            }
        }

        return match;
    });

    displayMedicalRecords();
}

// Limpar filtros
function clearFilters() {
    const searchInput = document.getElementById('filterSearch');
    const bloodTypeSelect = document.getElementById('filterBloodType');
    const dateInput = document.getElementById('filterDate');

    if (searchInput) searchInput.value = '';
    if (bloodTypeSelect) bloodTypeSelect.value = '';
    if (dateInput) dateInput.value = '';

    filteredRecords = [...medicalRecordsData];
    displayMedicalRecords();
}

// Editar prontuário
function editRecord(recordId) {
    const record = medicalRecordsData.find(r => r.id === recordId);
    if (record) {
        openEditRecordModal(record);
    }
}

// Excluir prontuário
function deleteRecord(recordId) {
    const record = medicalRecordsData.find(r => r.id === recordId);
    if (record && confirm(`Deseja realmente excluir o prontuário de ${record.name}?`)) {
        medicalRecordsData = medicalRecordsData.filter(r => r.id !== recordId);
        saveMedicalRecords();
        filteredRecords = [...medicalRecordsData];
        displayMedicalRecords();
    }
}

// Inicializar botões
function initButtons() {
    const newRecordBtn = document.getElementById('newRecordBtn');

    if (newRecordBtn) {
        newRecordBtn.addEventListener('click', openNewRecordModal);
    }
}

// Inicializar modal
function initModal() {
    const newRecordModal = document.getElementById('newRecordModal');
    const editRecordModal = document.getElementById('editRecordModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const editCancelBtn = document.getElementById('editCancelBtn');
    const recordForm = document.getElementById('recordForm');
    const editRecordForm = document.getElementById('editRecordForm');

    // Fechar modal de novo registro
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeNewRecordModal);
    }

    if (newRecordModal) {
        const modalOverlay = newRecordModal.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeNewRecordModal);
        }
    }

    // Fechar modal de edição
    if (editCancelBtn) {
        editCancelBtn.addEventListener('click', closeEditRecordModal);
    }

    if (editRecordModal) {
        const editModalOverlay = editRecordModal.querySelector('.modal-overlay');
        if (editModalOverlay) {
            editModalOverlay.addEventListener('click', closeEditRecordModal);
        }
    }

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeNewRecordModal();
            closeEditRecordModal();
        }
    });

    // Submeter formulário de novo registro
    if (recordForm) {
        recordForm.addEventListener('submit', handleNewRecordFormSubmit);
    }

    // Submeter formulário de edição
    if (editRecordForm) {
        editRecordForm.addEventListener('submit', handleEditRecordFormSubmit);
    }
}

// Aplicar máscaras
function applyInputMasks() {
    const phoneInput = document.getElementById('phone');
    const cpfInput = document.getElementById('cpf');
    const editPhoneInput = document.getElementById('editPhone');
    const editCpfInput = document.getElementById('editCpf');

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }

    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = maskCPF(e.target.value);
        });
    }

    if (editPhoneInput) {
        editPhoneInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }

    if (editCpfInput) {
        editCpfInput.addEventListener('input', (e) => {
            e.target.value = maskCPF(e.target.value);
        });
    }
}

// Máscara de telefone
function maskPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
}

// Máscara de CPF
function maskCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
}

// Abrir modal de novo registro
function openNewRecordModal() {
    const modal = document.getElementById('newRecordModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Fechar modal de novo registro
function closeNewRecordModal() {
    const modal = document.getElementById('newRecordModal');
    const form = document.getElementById('recordForm');
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

// Abrir modal de edição
function openEditRecordModal(record) {
    const modal = document.getElementById('editRecordModal');
    if (!modal) return;

    // Preencher campos do formulário
    document.getElementById('editRecordId').value = record.id;
    document.getElementById('editFullName').value = record.name;
    document.getElementById('editBirthDate').value = record.birthDate || '';
    document.getElementById('editCpf').value = record.cpf;
    document.getElementById('editPhone').value = record.phone || '';
    document.getElementById('editEmail').value = record.email || '';
    document.getElementById('editBloodType').value = record.bloodType || '';
    document.getElementById('editAddress').value = record.address || '';
    document.getElementById('editAllergies').value = record.allergies || '';
    document.getElementById('editMedications').value = record.medications || '';
    document.getElementById('editMedicalHistory').value = record.medicalHistory || '';
    document.getElementById('editMainComplaint').value = record.mainComplaint || '';
    document.getElementById('editDiagnosis').value = record.diagnosis || '';
    document.getElementById('editPrescription').value = record.prescription || '';
    document.getElementById('editObservations').value = record.observations || '';

    // Abrir modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de edição
function closeEditRecordModal() {
    const modal = document.getElementById('editRecordModal');
    const form = document.getElementById('editRecordForm');
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

// Submeter formulário de novo registro
function handleNewRecordFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('recordForm');
    const formData = new FormData(form);

    const today = new Date();
    const lastConsultation = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const record = {
        id: Date.now(),
        name: formData.get('fullName'),
        birthDate: formData.get('birthDate'),
        cpf: formData.get('cpf'),
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        bloodType: formData.get('bloodType') || '',
        address: formData.get('address') || '',
        allergies: formData.get('allergies') || '',
        medications: formData.get('medications') || '',
        medicalHistory: formData.get('medicalHistory') || '',
        mainComplaint: formData.get('mainComplaint') || '',
        diagnosis: formData.get('diagnosis') || '',
        prescription: formData.get('prescription') || '',
        observations: formData.get('observations') || '',
        lastConsultation: lastConsultation,
        createdAt: new Date().toISOString()
    };

    medicalRecordsData.push(record);
    saveMedicalRecords();
    filteredRecords = [...medicalRecordsData];
    displayMedicalRecords();

    // Mostrar mensagem de sucesso
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.remove('hidden');
    }

    // Fechar modal após 2 segundos
    setTimeout(() => {
        closeNewRecordModal();
    }, 2000);
}

// Submeter formulário de edição
function handleEditRecordFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('editRecordForm');
    const formData = new FormData(form);
    const recordId = parseInt(document.getElementById('editRecordId').value);

    const recordIndex = medicalRecordsData.findIndex(r => r.id === recordId);
    if (recordIndex === -1) return;

    const today = new Date();
    const lastConsultation = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    medicalRecordsData[recordIndex] = {
        ...medicalRecordsData[recordIndex],
        name: formData.get('fullName'),
        birthDate: formData.get('birthDate'),
        cpf: formData.get('cpf'),
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        bloodType: formData.get('bloodType') || '',
        address: formData.get('address') || '',
        allergies: formData.get('allergies') || '',
        medications: formData.get('medications') || '',
        medicalHistory: formData.get('medicalHistory') || '',
        mainComplaint: formData.get('mainComplaint') || '',
        diagnosis: formData.get('diagnosis') || '',
        prescription: formData.get('prescription') || '',
        observations: formData.get('observations') || '',
        lastConsultation: lastConsultation,
        updatedAt: new Date().toISOString()
    };

    saveMedicalRecords();
    filteredRecords = [...medicalRecordsData];
    displayMedicalRecords();

    // Mostrar mensagem de sucesso
    const successMessage = document.getElementById('editSuccessMessage');
    if (successMessage) {
        successMessage.classList.remove('hidden');
    }

    // Fechar modal após 2 segundos
    setTimeout(() => {
        closeEditRecordModal();
    }, 2000);
}

// Salvar no localStorage
function saveMedicalRecords() {
    localStorage.setItem('medicalRecords', JSON.stringify(medicalRecordsData));
}
