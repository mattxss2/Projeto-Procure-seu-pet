const { useState, useEffect } = React;

const defaultPetsProcura = [
    { id: 1, nome: "Max", raca: "Golden Retriever", cor: "Dourado", porte: "Grande", ownerName: "Carlos", contato: "(83) 98888-1111", endereco: "Parque do Povo, Campina Grande", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTbFp6HPsYuCNE1l5BLntnpCBlC2_mxtkcdcPOpflfOmxJwl8As-nHEoM9i8f3wcZKq24&usqp=CAU" },
    { id: 2, nome: "Mia", raca: "Vira-lata", cor: "Branco", porte: "Médio", ownerName: "Ana", contato: "(83) 97777-2222", endereco: "Próximo à Praça da Bandeira", imagem: "https://i.pinimg.com/736x/9c/36/a8/9c36a8e4979816cea407cfd5d604b37c.jpg" },
    { id: 3, nome: "Thor", raca: "Bulldog Francês", cor: "Creme", porte: "Pequeno", ownerName: "Pedro", contato: "(83) 96666-3333", endereco: "Açude Velho, perto do Museu", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj7Yk9NEUMc8KUNo1zy41MsjzhKndt9l-qyw&s" }
];
const defaultPetsEncontrados = [
    { id: 4, nome: "Luna", raca: "Siamês", cor: "Branco e Cinza", porte: "Pequeno", ownerName: "Juliana", contato: "Encontrado e seguro!", endereco: "Bairro do Catolé", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKxPwOxo95lYEec8CAs8WSkR7YU7xZgW5lbA&s" },
    { id: 5, nome: "Rocky", raca: "Pastor Alemão", cor: "Preto e Marrom", porte: "Grande", ownerName: "Mariana", contato: "Já está com o dono!", endereco: "Universidade Federal (UFCG)", imagem: "https://i.ytimg.com/vi/c8F0zuqR8pc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAj-TLQ67p9ty4UEhEOO9NqIIxVMAg" }
];

// --- Componente Sucesso de envio ---
function SuccessModal({ message, onClose }) {
    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content success-modal" onClick={e => e.stopPropagation()}>
                <i className="fas fa-check-circle success-icon"></i>
                <h3>Sucesso!</h3>
                <p>{message}</p>
                <button className="btn-details" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}

// --- Componente PetCard ---
function PetCard({ pet, onCardClick, onMarkAsFound, onDeletePet, isProcura }) {
    return (
        <div className="pet-card">
            <img src={pet.imagem || 'https://via.placeholder.com/300x200?text=Sem+Foto'} alt={`Foto de ${pet.nome}`} className="pet-card-image" onClick={() => onCardClick(pet)} />
            <div className="pet-card-info">
                <h3>{pet.nome}</h3>
                <p><strong>Raça:</strong> {pet.raca}</p>
                <p><strong>Cor:</strong> {pet.cor}</p>
                <p><strong>Porte:</strong> {pet.porte}</p>
                <button className="btn-details" onClick={() => onCardClick(pet)}>Mais Informações</button>
            </div>
            <div className="pet-card-actions">
                {isProcura ? (
                    <button className="action-btn btn-found" onClick={() => onMarkAsFound(pet.id)}>
                        <i className="fas fa-check-circle"></i> Marcar como Encontrado
                    </button>
                ) : (
                    <button className="action-btn btn-delete" onClick={() => onDeletePet(pet.id)}>
                        <i className="fas fa-trash-alt"></i> Remover
                    </button>
                )}
            </div>
        </div>
    );
}

// --- Componente Formulario ---
function AddPetForm({ onAddPet }) {
    const [petName, setPetName] = useState('');
    const [race, setRace] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    // Função para formatar o número de telefone
    const handleContactChange = (e) => {
        // 1. Limpa o valor, deixando apenas os dígitos
        let value = e.target.value.replace(/\D/g, '');
        // 2. Limita a 11 caracteres
        value = value.substring(0, 11);
        
        let formattedValue = value;

        // 3. Aplica a máscara (XX) XXXXX-XXXX
        if (value.length > 2) {
            formattedValue = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        }
        if (value.length > 7) {
            formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
        }

        setContact(formattedValue);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!petName.trim()) newErrors.petName = "O nome do pet é obrigatório.";
        if (!race.trim()) newErrors.race = "A raça é obrigatória.";
        if (!ownerName.trim()) newErrors.ownerName = "O nome do dono é obrigatório.";
        
        const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
        if (!phoneRegex.test(contact)) {
            newErrors.contact = "Formato inválido. Use (XX) XXXXX-XXXX";
        }
        if (!size) newErrors.size = "Selecione o porte.";
        if (!image) newErrors.image = "A foto do pet é obrigatória.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            const newPet = { 
                id: Date.now(), 
                nome: petName, 
                raca: race, 
                cor: color, 
                porte: size, 
                ownerName: ownerName,
                contato: contact, 
                endereco: address, 
                imagem: reader.result 
            };
            onAddPet(newPet);
        };
        reader.readAsDataURL(image);
    };
// --- RENDERIZA O FORMULÁRIO ---
    return (
        <React.Fragment>
            <h2>Informações do Pet Perdido</h2>
            <form id="add-pet-form" onSubmit={handleSubmit} noValidate>
                {/* Outros campos do formulário permanecem iguais */}
                <label>Nome do Pet:</label>
                <input type="text" value={petName} onChange={e => setPetName(e.target.value)} />
                {errors.petName && <span className="error-message">{errors.petName}</span>}

                <label>Raça:</label>
                <input type="text" value={race} onChange={e => setRace(e.target.value)} />
                {errors.race && <span className="error-message">{errors.race}</span>}

                <label>Cor Predominante:</label>
                <input type="text" value={color} onChange={e => setColor(e.target.value)} />

                <label>Porte:</label>
                <select value={size} onChange={e => setSize(e.target.value)}>
                    <option value="">Selecione o porte</option>
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                </select>
                {errors.size && <span className="error-message">{errors.size}</span>}

                <label>Nome do Dono:</label>
                <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
                {errors.ownerName && <span className="error-message">{errors.ownerName}</span>}
                
                <label>Telefone para Contato:</label>
                {/* ATUALIZADO: O input de telefone agora usa a nova função e tem um maxLength */}
                <input 
                    type="tel" 
                    value={contact} 
                    onChange={handleContactChange} 
                    placeholder="(XX) XXXXX-XXXX"
                    maxLength="15" 
                />
                {errors.contact && <span className="error-message">{errors.contact}</span>}

                <label>Último local visto:</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} />

                <label>Foto do Pet:</label>
                <input type="file" onChange={e => setImage(e.target.files[0])} accept="image/*" />
                {errors.image && <span className="error-message">{errors.image}</span>}
                
                <button type="submit">Cadastrar Pet</button>
            </form>
        </React.Fragment>
    );
}

// --- COMPONENTE PRINCIPAL: App ---
function App() {
    const [petsProcura, setPetsProcura] = useState([]);
    const [petsEncontrados, setPetsEncontrados] = useState([]);
    const [currentPage, setCurrentPage] = useState('procura');
    const [selectedPet, setSelectedPet] = useState(null);
    const [isDarkMode, setDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const procuraData = localStorage.getItem('petsProcura');
        const encontradosData = localStorage.getItem('petsEncontrados');
        setPetsProcura(procuraData ? JSON.parse(procuraData) : defaultPetsProcura);
        setPetsEncontrados(encontradosData ? JSON.parse(encontradosData) : defaultPetsEncontrados);
        
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        document.body.classList.toggle('dark-mode', savedDarkMode);
    }, []);

    useEffect(() => { localStorage.setItem('petsProcura', JSON.stringify(petsProcura)); }, [petsProcura]);
    useEffect(() => { localStorage.setItem('petsEncontrados', JSON.stringify(petsEncontrados)); }, [petsEncontrados]);
    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode);
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const handleAddPet = (newPet) => {
        setPetsProcura(prevPets => [newPet, ...prevPets]);
        setCurrentPage('procura');
        setShowSuccessModal(true);
    };

    const handleMarkAsFound = (petId) => {
        const petToMove = petsProcura.find(p => p.id === petId);
        if (petToMove) {
            setPetsProcura(petsProcura.filter(p => p.id !== petId));
            setPetsEncontrados([petToMove, ...petsEncontrados]);
        }
    };

    const handleDeletePet = (petId) => {
        setPetsEncontrados(petsEncontrados.filter(p => p.id !== petId));
    };
    
    // Função para resetar os dados
    const handleResetData = () => {
        if (confirm("Você tem certeza que deseja resetar todos os dados? Todos os pets cadastrados serão perdidos.")) {
            localStorage.removeItem('petsProcura');
            localStorage.removeItem('petsEncontrados');
            window.location.reload();
        }
    };

    const filteredPets = petsProcura.filter(pet =>
        pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.raca.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <React.Fragment>
            {/* CÓDIGO DO HEADER */}
            <header>
                <div className="header-content">
                    <h1><i className="fas fa-paw"></i> Encontre seu Pet</h1>
                    <nav>
                        <button className={`nav-btn ${currentPage === 'procura' ? 'active' : ''}`} onClick={() => setCurrentPage('procura')}>A Procura</button>
                        <button className={`nav-btn ${currentPage === 'encontrados' ? 'active' : ''}`} onClick={() => setCurrentPage('encontrados')}>Encontrados</button>
                        <button className={`nav-btn ${currentPage === 'adicionar' ? 'active' : ''}`} onClick={() => setCurrentPage('adicionar')}>Adicionar Pet</button>
                    </nav>
                </div>
                <div className="theme-switcher">
                    <i className="fas fa-sun"></i>
                    <label className="switch">
                        <input type="checkbox" checked={isDarkMode} onChange={() => setDarkMode(!isDarkMode)} />
                        <span className="slider round"></span>
                    </label>
                    <i className="fas fa-moon"></i>
                </div>
            </header>

            {/* CÓDIGO DO MAIN */}
            <main>
                {currentPage === 'procura' && (
                    <section className="page active">
                        <div className="page-header">
                            <h2>Pets à Procura</h2>
                            <div className="search-container">
                                <i className="fas fa-search"></i>
                                <input type="text" id="search-input" placeholder="Buscar por nome, raça..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        {filteredPets.length > 0 ? (
                            <div className="pets-grid">
                                {filteredPets.map(pet => <PetCard key={pet.id} pet={pet} onCardClick={setSelectedPet} onMarkAsFound={handleMarkAsFound} isProcura={true} />)}
                            </div>
                        ) : <p className="empty-message">Nenhum pet encontrado com esses critérios.</p>}
                    </section>
                )}

                {currentPage === 'encontrados' && (
                     <section className="page active">
                         <h2>Pets Já Encontrados</h2>
                         {petsEncontrados.length > 0 ? (
                             <div className="pets-grid">
                                 {petsEncontrados.map(pet => <PetCard key={pet.id} pet={pet} onCardClick={setSelectedPet} onDeletePet={handleDeletePet} isProcura={false} />)}
                             </div>
                         ) : <p className="empty-message">Ainda não há pets na lista de encontrados.</p>}
                     </section>
                )}

                {currentPage === 'adicionar' && <section className="page active"><AddPetForm onAddPet={handleAddPet} /></section>}
            </main>

            {/* CÓDIGO DO MODAL DE DETALHES */}
            {selectedPet && (
                <div className="modal active" onClick={() => setSelectedPet(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-button" onClick={() => setSelectedPet(null)}>&times;</span>
                        <img id="modal-pet-image" src={selectedPet.imagem || 'https://via.placeholder.com/400x300?text=Sem+Foto'} alt={`Foto de ${selectedPet.nome}`} />
                        <h3 id="modal-pet-name">{selectedPet.nome}</h3>
                        <p><strong>Dono(a):</strong> <span>{selectedPet.ownerName || 'Não informado'}</span></p>
                        <p><strong>Raça:</strong> <span>{selectedPet.raca}</span></p>
                        <p><strong>Cor:</strong> <span>{selectedPet.cor}</span></p>
                        <p><strong>Porte:</strong> <span>{selectedPet.porte}</span></p>
                        <p><strong>Contato:</strong> <span>{selectedPet.contato}</span></p>
                        <p><strong>Último local visto:</strong> <span>{selectedPet.endereco}</span></p>
                    </div>
                </div>
            )}
            
            {showSuccessModal && (
                <SuccessModal 
                    message="O seu pet foi cadastrado e já está na lista 'A Procura'." 
                    onClose={() => setShowSuccessModal(false)} 
                />
            )}

            {/* Botão de Reset Flutuante */}
            <button className="reset-btn" onClick={handleResetData} title="Resetar Dados">
                <i className="fas fa-sync-alt"></i>
            </button>
        </React.Fragment>
    );
}

// --- Renderiza a aplicação na div #root (FORMA CORRETA) ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);