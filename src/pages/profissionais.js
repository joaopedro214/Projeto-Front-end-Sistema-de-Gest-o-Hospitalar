let professionalsData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadProfessionals();
    initModal();
    applyInputMasks();
    displayProfessionals();
});

// Carregar dados do localStorage
function loadProfessionals() {
    const saved = localStorage.getItem('professionals');
    if (saved) {
        professionalsData = JSON.parse(saved);
    } else {
        // Dados padrão
        professionalsData = [
            {
                id: 1,
                fullName: 'Dr. João Santos',
                specialty: 'Cardiologia',
                cpf: '123.456.789-00',
                crm: '12345-SP',
                email: 'joao.santos@email.com',
                phone: '(11) 98765-4321',
                status: 'ativo',
                initials: 'DJS',
                color: '#2b479b'
            },
            {
                id: 2,
                fullName: 'Dra. Ana Lima',
                specialty: 'Pediatria',
                cpf: '987.654.321-00',
                crm: '67890-SP',
                email: 'ana.lima@email.com',
                phone: '(11) 91234-5678',
                status: 'ativo',
                initials: 'DAL',
                color: '#2b479b'
            },
            {
                id: 3,
                fullName: 'Dr. Paulo Oliveira',
                specialty: 'Dermatologia',
                cpf: '456.789.123-00',
                crm: '98765-SP',
                email: 'paulo.oliveira@email.com',
                phone: '(11) 99876-5432',
                status: 'ativo',
                initials: 'DPO',
                color: '#2b479b'
            }
        ];
    }
}

// Gerar iniciais do nome
function getInitials(name) {
    const parts = name.split(' ').filter(part => part.length > 2);
    if (parts.length >= 2) {
        return parts[0][0] + parts[parts.length - 1][0];
    }
    return name.substring(0, 2);
}

// Exibir profissionais
function displayProfessionals() {
    const grid = document.getElementById('professionalsGrid');
    const emptyState = document.getElementById('emptyState');

    if (!professionalsData || professionalsData.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    grid.innerHTML = '';

    professionalsData.forEach(professional => {
        const card = document.createElement('div');
        card.className = 'professional-card';

        const initials = professional.initials || getInitials(professional.fullName);

        card.innerHTML = `
            <div class="card-header">
                <div class="professional-avatar" style="background-color: ${professional.color || '#2b479b'}">
                    ${initials.toUpperCase()}
                </div>
                <div class="professional-info">
                    <h3 class="professional-name">${professional.fullName}</h3>
                    <p class="professional-specialty">${professional.specialty}</p>
                </div>
            </div>
            <div class="card-body">
                <p class="professional-crm">CRM: ${professional.crm || 'Não informado'}</p>
                <div class="card-status-row">
                    <span class="status-badge status-${professional.status}">${capitalize(professional.status)}</span>
                    <div class="card-action-buttons">
                        <button class="btn-edit" onclick="viewDetails(${professional.id})"><i class="fas fa-pen"></i>Editar</button>
                        <button class="btn-delete" onclick="deleteProfessional(${professional.id})"><i class="fas fa-trash"></i>Excluir</button>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-agenda" onclick="viewAgenda(${professional.id})">Ver Agenda</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Ver agenda do profissional
function viewAgenda(professionalId) {
    const professional = professionalsData.find(p => p.id === professionalId);
    if (professional) {
        alert(`Abrindo agenda de ${professional.fullName}`);
        // Aqui você pode redirecionar para a página de agenda
        // window.location.href = `agenda.html?professional=${professionalId}`;
    }
}

// Ver detalhes do profissional
function viewDetails(professionalId) {
    const professional = professionalsData.find(p => p.id === professionalId);
    if (professional) {
        openEditProfessionalModal(professional);
    }
}

// Excluir profissional
function deleteProfessional(professionalId) {
    const professional = professionalsData.find(p => p.id === professionalId);
    if (professional && confirm(`Deseja realmente excluir o profissional ${professional.fullName}?`)) {
        professionalsData = professionalsData.filter(p => p.id !== professionalId);
        saveProfessionals();
        displayProfessionals();
    }
}

// Inicializar modal
function initModal() {
    const newProfessionalBtn = document.getElementById('newProfessionalBtn');
    const newProfessionalBtnEmpty = document.getElementById('newProfessionalBtnEmpty');
    const modal = document.getElementById('newProfessionalModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('professionalForm');
    const modalOverlay = modal?.querySelector('.modal-overlay');

    if (!modal) return;

    // Abrir modal
    const openModal = () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    if (newProfessionalBtn) {
        newProfessionalBtn.addEventListener('click', openModal);
    }

    if (newProfessionalBtnEmpty) {
        newProfessionalBtnEmpty.addEventListener('click', openModal);
    }

    // Fechar modal
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeModal());
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => closeModal());
    }

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Submeter formulário
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Edit Modal
    const editModal = document.getElementById('editProfessionalModal');
    const editCancelBtn = document.getElementById('editCancelBtn');
    const editForm = document.getElementById('editProfessionalForm');
    const editModalOverlay = editModal?.querySelector('.modal-overlay');

    if (editModal) {
        // Fechar edit modal
        if (editCancelBtn) {
            editCancelBtn.addEventListener('click', () => closeEditProfessionalModal());
        }

        if (editModalOverlay) {
            editModalOverlay.addEventListener('click', () => closeEditProfessionalModal());
        }

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !editModal.classList.contains('hidden')) {
                closeEditProfessionalModal();
            }
        });

        // Submeter formulário de edição
        if (editForm) {
            editForm.addEventListener('submit', handleEditProfessionalFormSubmit);
        }
    }
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('newProfessionalModal');
    const form = document.getElementById('professionalForm');
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

// Aplicar máscaras
function applyInputMasks() {
    const phoneInput = document.getElementById('phone');
    const cpfInput = document.getElementById('cpf');
    const cnpjInput = document.getElementById('cnpj');
    const crmInput = document.getElementById('crm');

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

    if (cnpjInput) {
        cnpjInput.addEventListener('input', (e) => {
            e.target.value = maskCNPJ(e.target.value);
        });
    }

    if (crmInput) {
        crmInput.addEventListener('input', (e) => {
            e.target.value = maskCRM(e.target.value);
        });
    }

    // Máscaras para modal de edição
    const editPhoneInput = document.getElementById('editPhone');
    const editCpfInput = document.getElementById('editCpf');
    const editCnpjInput = document.getElementById('editCnpj');
    const editCrmInput = document.getElementById('editCrm');

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

    if (editCnpjInput) {
        editCnpjInput.addEventListener('input', (e) => {
            e.target.value = maskCNPJ(e.target.value);
        });
    }

    if (editCrmInput) {
        editCrmInput.addEventListener('input', (e) => {
            e.target.value = maskCRM(e.target.value);
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

// Máscara de CNPJ
function maskCNPJ(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
        .slice(0, 18);
}

// Máscara de CRM
function maskCRM(value) {
    return value
        .replace(/[^0-9A-Z-]/gi, '')
        .toUpperCase()
        .slice(0, 15);
}

// Submeter formulário
function handleFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('professionalForm');
    const formData = new FormData(form);

    const professional = {
        id: Date.now(),
        fullName: formData.get('fullName'),
        cpf: formData.get('cpf') || '',
        cnpj: formData.get('cnpj') || '',
        crm: formData.get('crm') || '',
        phone: formData.get('phone'),
        email: formData.get('email'),
        specialty: formData.get('specialty'),
        insurance: formData.get('insurance') || '',
        observation: formData.get('observation') || '',
        status: 'ativo',
        initials: getInitials(formData.get('fullName')),
        color: '#2b479b',
        createdAt: new Date().toISOString()
    };

    professionalsData.push(professional);
    saveProfessionals();
    displayProfessionals();

    // Mostrar mensagem de sucesso
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.remove('hidden');
    }

    // Fechar modal após 2 segundos
    setTimeout(() => {
        closeModal();
    }, 2000);
}

// Salvar no localStorage
function saveProfessionals() {
    localStorage.setItem('professionals', JSON.stringify(professionalsData));
}

// Abrir modal de edição
function openEditProfessionalModal(professional) {
    const editModal = document.getElementById('editProfessionalModal');
    if (!editModal) return;

    // Preencher campos do formulário
    document.getElementById('editProfessionalId').value = professional.id;
    document.getElementById('editFullName').value = professional.fullName;
    document.getElementById('editCpf').value = professional.cpf || '';
    document.getElementById('editCnpj').value = professional.cnpj || '';
    document.getElementById('editPhone').value = professional.phone;
    document.getElementById('editEmail').value = professional.email;
    document.getElementById('editCrm').value = professional.crm || '';
    document.getElementById('editSpecialty').value = professional.specialty;
    document.getElementById('editInsurance').value = professional.insurance || '';
    document.getElementById('editStatus').value = professional.status;
    document.getElementById('editObservation').value = professional.observation || '';

    // Abrir modal
    editModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de edição
function closeEditProfessionalModal() {
    const editModal = document.getElementById('editProfessionalModal');
    const editForm = document.getElementById('editProfessionalForm');
    const editSuccessMessage = document.getElementById('editSuccessMessage');

    if (editModal) {
        editModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (editForm) {
        editForm.reset();
    }

    if (editSuccessMessage) {
        editSuccessMessage.classList.add('hidden');
    }
}

// Submeter formulário de edição
function handleEditProfessionalFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('editProfessionalForm');
    const formData = new FormData(form);
    const professionalId = parseInt(document.getElementById('editProfessionalId').value);

    // Encontrar índice do profissional
    const index = professionalsData.findIndex(p => p.id === professionalId);
    if (index === -1) return;

    // Atualizar dados
    professionalsData[index] = {
        ...professionalsData[index],
        fullName: formData.get('fullName'),
        cpf: formData.get('cpf') || '',
        cnpj: formData.get('cnpj') || '',
        crm: formData.get('crm') || '',
        phone: formData.get('phone'),
        email: formData.get('email'),
        specialty: formData.get('specialty'),
        insurance: formData.get('insurance') || '',
        status: formData.get('status'),
        observation: formData.get('observation') || '',
        initials: getInitials(formData.get('fullName'))
    };

    saveProfessionals();
    displayProfessionals();

    // Mostrar mensagem de sucesso
    const editSuccessMessage = document.getElementById('editSuccessMessage');
    if (editSuccessMessage) {
        editSuccessMessage.classList.remove('hidden');
    }

    // Fechar modal após 2 segundos
    setTimeout(() => {
        closeEditProfessionalModal();
    }, 2000);
}

// Função auxiliar
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
