let patientsData = [];
let filteredPatients = [];

document.addEventListener('DOMContentLoaded', function () {
    loadPatients();
    initFilters();
    initModal();
    initEditPatientModal();
    initPatientFormModal();
    applyInputMasks();
    displayPatients(patientsData);
});

// Carregar dados do localStorage
function loadPatients() {
    const saved = localStorage.getItem('patients');
    if (saved) {
        patientsData = JSON.parse(saved);
    } else {
        // Dados padrão se não houver cadastros
        patientsData = [
            {
                id: 1,
                fullName: 'Maria Silva',
                cpf: '123.456.789-00',
                phone: '(11) 98765-4321',
                email: 'maria.silva@email.com',
                birthDate: '1985-05-15',
                gender: 'feminino',
                lastVisit: '15/10/2025',
                status: 'ativo',
                city: 'São Paulo',
                state: 'SP'
            },
            {
                id: 2,
                fullName: 'Pedro Costa',
                cpf: '987.654.321-00',
                phone: '(11) 91234-5678',
                email: 'pedro.costa@email.com',
                birthDate: '1978-03-22',
                gender: 'masculino',
                lastVisit: '20/10/2025',
                status: 'ativo',
                city: 'São Paulo',
                state: 'SP'
            },
            {
                id: 3,
                fullName: 'Julia Oliveira',
                cpf: '456.789.123-00',
                phone: '(11) 99876-5432',
                email: 'julia.oliveira@email.com',
                birthDate: '1990-07-10',
                gender: 'feminino',
                lastVisit: '25/10/2025',
                status: 'ativo',
                city: 'São Paulo',
                state: 'SP'
            }
        ];
    }
}

// Inicializar filtros
function initFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const clearBtn = document.getElementById('clearBtn');
    const searchInput = document.getElementById('filterSearch');

    filterBtn.addEventListener('click', applyFilters);
    clearBtn.addEventListener('click', clearFilters);

    // Busca em tempo real
    searchInput.addEventListener('input', applyFilters);
}

// Aplicar filtros
function applyFilters() {
    const search = document.getElementById('filterSearch').value.toLowerCase();
    const status = document.getElementById('filterStatus').value;

    filteredPatients = patientsData.filter(patient => {
        let match = true;

        if (search && !patient.fullName.toLowerCase().includes(search) && !patient.cpf.includes(search)) {
            match = false;
        }

        if (status && patient.status !== status) {
            match = false;
        }

        return match;
    });

    displayPatients(filteredPatients);

    // Mostrar mensagem se nenhum resultado
    if (filteredPatients.length === 0 && (search || status)) {
        showNoResultsMessage();
    }
}

// Mostrar mensagem de nenhum resultado
function showNoResultsMessage() {
    const tbody = document.getElementById('patientsTableBody');
    const emptyState = document.getElementById('emptyState');
    const patientsTable = document.getElementById('patientsTable');

    emptyState.classList.remove('hidden');
    emptyState.innerHTML = `
        <div class="empty-state-content">
            <div class="empty-state-icon">
                <i class="fas fa-search"></i>
            </div>
            <h2>Nenhum Resultado</h2>
            <p>Nenhum paciente encontrado com os critérios de busca.</p>
            <p class="empty-state-hint">Tente ajustar os filtros.</p>
        </div>
    `;
    patientsTable.classList.add('hidden');
}

// Limpar filtros
function clearFilters() {
    document.getElementById('filterSearch').value = '';
    document.getElementById('filterStatus').value = '';
    filteredPatients = [...patientsData];
    displayPatients(patientsData);
}

// Exibir pacientes na tabela
function displayPatients(patients) {
    const tbody = document.getElementById('patientsTableBody');
    const emptyState = document.getElementById('emptyState');
    const patientsTable = document.getElementById('patientsTable');
    tbody.innerHTML = '';

    if (patients.length === 0) {
        emptyState.classList.remove('hidden');
        patientsTable.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    patientsTable.classList.remove('hidden');

    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.fullName}</td>
            <td>${patient.cpf}</td>
            <td>${patient.phone}</td>
            <td>${patient.lastVisit || 'Sem registros'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" title="Editar" onclick="openEditPatientModal(${patient.id})">
                        <i class="fas fa-pen"></i>Editar
                    </button>
                    <button class="btn-delete" title="Excluir" onclick="deletePatient(${patient.id})">
                        <i class="fas fa-trash"></i>Excluir
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Inicializar modal
function initModal() {
    const modal = document.getElementById('detailsModal');
    const closeModal = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const editBtn = document.getElementById('editBtn');

    closeModal.addEventListener('click', () => closePatientModal());
    closeModalBtn.addEventListener('click', () => closePatientModal());

    // Botão de editar
    editBtn.addEventListener('click', () => {
        const patientId = modal.dataset.patientId;
        if (patientId) {
            openEditPatientModal(parseInt(patientId));
        }
    });

    // Fechar modal ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePatientModal();
        }
    });
}

// Ver detalhes do paciente
function viewPatientDetails(patientId) {
    const patient = patientsData.find(p => p.id === patientId);

    if (!patient) return;

    const modal = document.getElementById('detailsModal');
    const modalPatientName = document.getElementById('modalPatientName');
    const modalBody = document.getElementById('modalBody');

    modalPatientName.textContent = patient.fullName;

    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <strong>CPF:</strong>
                <p>${patient.cpf}</p>
            </div>
            <div>
                <strong>Telefone:</strong>
                <p>${patient.phone}</p>
            </div>
            <div>
                <strong>Email:</strong>
                <p>${patient.email}</p>
            </div>
            <div>
                <strong>Data de Nascimento:</strong>
                <p>${formatDate(patient.birthDate)}</p>
            </div>
            <div>
                <strong>Gênero:</strong>
                <p>${capitalize(patient.gender)}</p>
            </div>
            <div>
                <strong>Status:</strong>
                <p><span style="padding: 4px 8px; border-radius: 4px; background: #d1fae5; color: #065f46;">${capitalize(patient.status)}</span></p>
            </div>
            <div>
                <strong>Cidade:</strong>
                <p>${patient.city}</p>
            </div>
            <div>
                <strong>Estado:</strong>
                <p>${patient.state}</p>
            </div>
            <div>
                <strong>Última Visita:</strong>
                <p>${patient.lastVisit || 'Sem registros'}</p>
            </div>
        </div>
    `;

    // Armazenar ID do paciente no modal para uso no botão editar
    modal.dataset.patientId = patientId;
    modal.classList.remove('hidden');
}

// Fechar modal
function closePatientModal() {
    const modal = document.getElementById('detailsModal');
    modal.classList.add('hidden');
}

// Funções auxiliares
function formatDate(dateString) {
    if (!dateString) return 'Não informado';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Excluir paciente
function deletePatient(patientId) {
    const patient = patientsData.find(p => p.id === patientId);
    if (patient && confirm(`Tem certeza que deseja excluir o paciente ${patient.fullName}?`)) {
        const index = patientsData.findIndex(p => p.id === patientId);
        if (index !== -1) {
            patientsData.splice(index, 1);
            savePatients();
            filteredPatients = [...patientsData];
            displayPatients(filteredPatients.length > 0 ? filteredPatients : patientsData);
            alert(`Paciente ${patient.fullName} excluído com sucesso!`);
        }
    }
}

// ============================================
// Modal de Edição de Paciente
// ============================================

function openEditPatientModal(patientId) {
    const patient = patientsData.find(p => p.id === patientId);
    if (!patient) return;

    const modal = document.getElementById('editPatientModal');
    if (!modal) return;

    // Preencher o formulário com os dados do paciente
    document.getElementById('editFullName').value = patient.fullName || '';
    document.getElementById('editCpf').value = patient.cpf || '';
    document.getElementById('editBirthDate').value = patient.birthDate || '';
    document.getElementById('editGender').value = patient.gender || '';
    document.getElementById('editEmail').value = patient.email || '';
    document.getElementById('editPhone').value = patient.phone || '';
    document.getElementById('editCep').value = patient.cep || '';
    document.getElementById('editStreet').value = patient.street || '';
    document.getElementById('editNumber').value = patient.number || '';
    document.getElementById('editComplement').value = patient.complement || '';
    document.getElementById('editCity').value = patient.city || '';
    document.getElementById('editState').value = patient.state || '';
    document.getElementById('editBloodType').value = patient.bloodType || '';
    document.getElementById('editAllergies').value = patient.allergies || '';
    document.getElementById('editMedicalHistory').value = patient.medicalHistory || '';
    document.getElementById('editInsurance').value = patient.insurance || '';
    document.getElementById('editEmergencyName').value = patient.emergencyName || '';
    document.getElementById('editEmergencyPhone').value = patient.emergencyPhone || '';
    document.getElementById('editRelationship').value = patient.relationship || '';

    // Armazenar o ID do paciente sendo editado
    modal.dataset.editingPatientId = patientId;

    // Fechar modal de detalhes
    closePatientModal();

    // Abrir modal de edição
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeEditPatientModal() {
    const modal = document.getElementById('editPatientModal');
    const form = document.getElementById('editPatientForm');
    const successMessage = document.getElementById('editSuccessMessage');

    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        delete modal.dataset.editingPatientId;
    }

    if (form) {
        form.reset();
        // Remover mensagens de erro
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.classList.remove('show');
            msg.textContent = '';
        });
        // Resetar bordas
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }

    if (successMessage) {
        successMessage.classList.add('hidden');
    }
}

function initEditPatientModal() {
    const modal = document.getElementById('editPatientModal');
    const cancelBtn = document.getElementById('cancelEditPatientBtn');
    const form = document.getElementById('editPatientForm');
    const modalOverlay = modal?.querySelector('.modal-overlay');

    if (!modal) return;

    // Fechar modal ao clicar no botão cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeEditPatientModal());
    }

    // Fechar modal ao clicar no overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => closeEditPatientModal());
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeEditPatientModal();
        }
    });

    // Submeter formulário de edição
    if (form) {
        form.addEventListener('submit', handleEditPatientFormSubmit);

        // Aplicar máscaras aos campos de edição
        applyEditInputMasks();
    }
}

function applyEditInputMasks() {
    const cpfInput = document.getElementById('editCpf');
    const phoneInput = document.getElementById('editPhone');
    const emergencyPhoneInput = document.getElementById('editEmergencyPhone');
    const cepInput = document.getElementById('editCep');

    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = maskCPF(e.target.value);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }

    if (emergencyPhoneInput) {
        emergencyPhoneInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }

    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            e.target.value = maskCEP(e.target.value);
        });
    }
}

function handleEditPatientFormSubmit(e) {
    e.preventDefault();

    const modal = document.getElementById('editPatientModal');
    const patientId = parseInt(modal.dataset.editingPatientId);
    const patientIndex = patientsData.findIndex(p => p.id === patientId);

    if (patientIndex === -1) {
        alert('Erro ao encontrar paciente');
        return;
    }

    const form = document.getElementById('editPatientForm');
    const formData = new FormData(form);

    // Atualizar dados do paciente
    patientsData[patientIndex] = {
        ...patientsData[patientIndex],
        fullName: formData.get('fullName'),
        cpf: formData.get('cpf'),
        birthDate: formData.get('birthDate'),
        gender: formData.get('gender'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        cep: formData.get('cep'),
        street: formData.get('street'),
        number: formData.get('number'),
        complement: formData.get('complement') || '',
        city: formData.get('city'),
        state: formData.get('state'),
        bloodType: formData.get('bloodType') || '',
        allergies: formData.get('allergies') || '',
        medicalHistory: formData.get('medicalHistory') || '',
        insurance: formData.get('insurance') || '',
        emergencyName: formData.get('emergencyName'),
        emergencyPhone: formData.get('emergencyPhone'),
        relationship: formData.get('relationship') || ''
    };

    savePatients();
    displayPatients(patientsData);

    // Mostrar mensagem de sucesso
    const successMessage = document.getElementById('editSuccessMessage');
    if (successMessage) {
        successMessage.classList.remove('hidden');
    }

    // Fechar modal após 2 segundos
    setTimeout(() => {
        closeEditPatientModal();
    }, 2000);
}

// ============================================
// Modal de Cadastro de Paciente
// ============================================

function initPatientFormModal() {
    const newPatientBtn = document.getElementById('newPatientBtn');
    const newPatientBtnEmpty = document.getElementById('newPatientBtnEmpty');
    const modal = document.getElementById('newPatientModal');
    const cancelBtn = document.getElementById('cancelPatientBtn');
    const form = document.getElementById('patientForm');
    const modalOverlay = modal?.querySelector('.modal-overlay');

    if (!modal) return;

    // Abrir modal pelos botões
    const openModal = () => openPatientModal();

    if (newPatientBtn) {
        newPatientBtn.addEventListener('click', openModal);
    }

    if (newPatientBtnEmpty) {
        newPatientBtnEmpty.addEventListener('click', openModal);
    }

    // Reativar listener caso o botão seja recriado dinamicamente
    document.addEventListener('click', (e) => {
        if (e.target.id === 'newPatientBtnEmpty' || e.target.closest('#newPatientBtnEmpty')) {
            openModal();
        }
    });

    // Fechar modal ao clicar no botão cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closePatientFormModal());
    }

    // Fechar modal ao clicar no overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => closePatientFormModal());
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closePatientFormModal();
        }
    });

    // Submeter formulário
    if (form) {
        form.addEventListener('submit', handlePatientFormSubmit);

        // Validação em tempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
        });
    }
}

function openPatientModal() {
    const modal = document.getElementById('newPatientModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Focar no primeiro campo
    const firstInput = document.getElementById('fullName');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closePatientFormModal() {
    const modal = document.getElementById('newPatientModal');
    const form = document.getElementById('patientForm');
    const successMessage = document.getElementById('successMessage');

    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (form) {
        form.reset();
        // Remover mensagens de erro
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.classList.remove('show');
            msg.textContent = '';
        });
        // Resetar bordas
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }

    if (successMessage) {
        successMessage.classList.add('hidden');
    }
}

// Aplicar máscaras aos campos
function applyInputMasks() {
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('phone');
    const emergencyPhoneInput = document.getElementById('emergencyPhone');
    const cepInput = document.getElementById('cep');

    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = maskCPF(e.target.value);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }

    if (emergencyPhoneInput) {
        emergencyPhoneInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }

    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            e.target.value = maskCEP(e.target.value);
        });
    }
}

// Máscaras de entrada
function maskCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14);
}

function maskPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 15);
}

function maskCEP(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
}

// Validar campo individual
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const errorElement = document.getElementById(fieldName + 'Error');

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'fullName':
            if (!value) {
                isValid = false;
                errorMessage = 'Nome completo é obrigatório';
            } else if (value.length < 5) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 5 caracteres';
            }
            break;

        case 'cpf':
            if (!value) {
                isValid = false;
                errorMessage = 'CPF é obrigatório';
            } else if (!validateCPF(value)) {
                isValid = false;
                errorMessage = 'CPF inválido';
            }
            break;

        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'Email é obrigatório';
            } else if (!validateEmail(value)) {
                isValid = false;
                errorMessage = 'Email inválido';
            }
            break;

        case 'phone':
        case 'emergencyPhone':
            if (!value) {
                isValid = false;
                errorMessage = 'Telefone é obrigatório';
            } else if (value.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Telefone inválido';
            }
            break;

        case 'birthDate':
            if (!value) {
                isValid = false;
                errorMessage = 'Data de nascimento é obrigatória';
            } else if (!validateAge(value)) {
                isValid = false;
                errorMessage = 'Paciente deve ter pelo menos 18 anos';
            }
            break;

        case 'cep':
            if (value && value.replace(/\D/g, '').length !== 8) {
                isValid = false;
                errorMessage = 'CEP inválido';
            }
            break;
    }

    if (errorElement) {
        if (isValid) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
            field.style.borderColor = '';
        } else {
            errorElement.classList.add('show');
            errorElement.textContent = errorMessage;
            field.style.borderColor = '#d70015';
        }
    }

    return isValid;
}

// Validar todos os campos
function validatePatientForm() {
    const form = document.getElementById('patientForm');
    if (!form) return false;

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Validadores
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age >= 18;
}

// Enviar formulário
function handlePatientFormSubmit(e) {
    e.preventDefault();

    if (!validatePatientForm()) {
        return;
    }

    const form = document.getElementById('patientForm');
    const formData = new FormData(form);

    const patient = {
        id: Date.now(),
        fullName: formData.get('fullName'),
        cpf: formData.get('cpf'),
        birthDate: formData.get('birthDate'),
        gender: formData.get('gender'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        cep: formData.get('cep'),
        street: formData.get('street'),
        number: formData.get('number'),
        complement: formData.get('complement') || '',
        city: formData.get('city'),
        state: formData.get('state'),
        bloodType: formData.get('bloodType') || '',
        allergies: formData.get('allergies') || '',
        medicalHistory: formData.get('medicalHistory') || '',
        insurance: formData.get('insurance') || '',
        emergencyName: formData.get('emergencyName'),
        emergencyPhone: formData.get('emergencyPhone'),
        relationship: formData.get('relationship') || '',
        status: 'ativo',
        lastVisit: '',
        createdAt: new Date().toISOString()
    };

    // Adicionar aos dados
    patientsData.push(patient);
    savePatients();

    // Atualizar lista
    filteredPatients = [...patientsData];
    displayPatients(patientsData);

    // Mostrar mensagem de sucesso
    showPatientSuccessMessage();

    // Limpar formulário
    form.reset();

    // Fechar modal após 2 segundos
    setTimeout(() => {
        closePatientFormModal();
    }, 2000);
}

// Mostrar mensagem de sucesso
function showPatientSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.remove('hidden');
    }
}

// Salvar dados no localStorage
function savePatients() {
    localStorage.setItem('patients', JSON.stringify(patientsData));
}
