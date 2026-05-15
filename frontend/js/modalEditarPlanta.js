document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS PRINCIPAIS ---
    const modal = document.getElementById('modalPostagem');
    const btnAbrir = document.getElementById('btnAbrirModal');
    const btnSalvar = document.getElementById('btnSalvar');
    
    const inputFoto = document.getElementById('inputFoto');
    const imgPreview = document.getElementById('imgPreview');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    
    const inputBusca = document.querySelector('.api-search');
    const containerEspecies = document.getElementById('resEspecies');
    const containerCat = document.getElementById('resCategorias');

    let cardSendoEditadoID = null; 
    let estadoPublico = true;

    // --- 1. CONFIGURAÇÃO INICIAL DE CATEGORIAS ---
    const categorias = ["Suculentas", "Cactos", "Folhagens", "Ornamentais", "Frutíferas", "Pendentes"];
    
    if (containerCat) {
        containerCat.innerHTML = ''; 
        categorias.forEach(cat => {
            const div = document.createElement('div');
            div.className = 'option-item';
            div.innerText = cat;
            div.onclick = (e) => {
                e.stopPropagation();
                selecionarUnico(div, cat, 'selectCategoria');
            };
            containerCat.appendChild(div);
        });
    }

    // --- 2. LOGICA DE PRIVACIDADE (DROPDOWN) ---
    window.setPrivacidade = (ePublico, icone, texto) => {
        estadoPublico = ePublico;
        document.getElementById('pvtIcon').innerText = icone;
        document.getElementById('pvtText').innerText = texto;
        
        // Fecha o menu de privacidade
        document.querySelector('#selectPrivacidade .select-options').classList.add('hidden');
        document.querySelector('#selectPrivacidade .select-header').classList.add('selected');
    };

    // --- 3. UPLOAD DE IMAGEM ---
    document.getElementById('dropzone').onclick = () => inputFoto.click();

    inputFoto.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                imgPreview.src = ev.target.result;
                imgPreview.classList.remove('hidden');
                uploadPlaceholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    };

    // --- 4. BUSCA DE ESPÉCIES (API GBIF) ---
    inputBusca.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length < 3) {
            containerEspecies.innerHTML = '<p class="aviso">Digite 3 letras...</p>';
            return;
        }

        try {
            const res = await fetch(`https://api.gbif.org/v1/species/suggest?q=${query}&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c`);
            const data = await res.json();
            
            containerEspecies.innerHTML = ''; 
            data.forEach(item => {
                if (item.canonicalName) {
                    const div = document.createElement('div');
                    div.className = 'option-item';
                    div.innerText = item.canonicalName;
                    div.onclick = (event) => {
                        event.stopPropagation();
                        selecionarUnico(div, item.canonicalName, 'selectEspecie');
                    };
                    containerEspecies.appendChild(div);
                }
            });
        } catch (err) {
            console.error("Erro API:", err);
        }
    });

    // --- 5. FUNÇÕES DE EDIÇÃO E ABERTURA ---
    window.abrirEdicao = (idDoCard) => {
        cardSendoEditadoID = idDoCard;
        const card = document.getElementById(idDoCard);

        document.getElementById('modalTitulo').innerText = "Editar Planta";
        btnSalvar.innerText = "Salvar alterações";

        // Preencher dados
        document.getElementById('nomePlanta').value = card.querySelector('.titulo-planta').innerText;
        document.getElementById('descricao').value = card.querySelector('.desc-planta').innerText;
        
        const imgCard = card.querySelector('.img-planta').src;
        imgPreview.src = imgCard;
        imgPreview.classList.remove('hidden');
        uploadPlaceholder.classList.add('hidden');
        
        // Labels dos Selects
        document.querySelector('#selectEspecie .label').innerText = card.querySelector('.especie-planta').innerText;
        document.querySelector('#selectCategoria .label').innerText = card.querySelector('.categoria-planta').innerText;

        // Sincronizar Privacidade
        const pvt = card.getAttribute('data-privacidade');
        if (pvt === 'publico') setPrivacidade(true, '🌐', 'Público');
        else setPrivacidade(false, '🔒', 'Privado');

        modal.classList.add('active');
    };

    if(btnAbrir) {
        btnAbrir.onclick = () => {
            cardSendoEditadoID = null;
            limparCamposModal();
            document.getElementById('modalTitulo').innerText = "Adicionar Planta";
            btnSalvar.innerText = "Salvar";
            modal.classList.add('active');
        };
    }

    // --- 6. SALVAR E AUXILIARES ---
    btnSalvar.onclick = () => {
        const nome = document.getElementById('nomePlanta').value;
        if (!nome) return alert("Dê um nome para sua planta!");

        if (cardSendoEditadoID) {
            const card = document.getElementById(cardSendoEditadoID);
            card.querySelector('.titulo-planta').innerText = nome;
            card.querySelector('.especie-planta').innerText = document.querySelector('#selectEspecie .label').innerText;
            card.querySelector('.categoria-planta').innerText = document.querySelector('#selectCategoria .label').innerText;
            card.querySelector('.desc-planta').innerText = document.getElementById('descricao').value;
            card.querySelector('.img-planta').src = imgPreview.src;
            
            const status = estadoPublico ? 'publico' : 'privado';
            card.setAttribute('data-privacidade', status);
            card.querySelector('.status-icon').innerText = estadoPublico ? '🌐' : '🔒';
        }
        modal.classList.remove('active');
    };

    function selecionarUnico(elemento, valor, parentId) {
        const parent = document.getElementById(parentId);
        parent.querySelector('.label').innerText = valor;
        parent.querySelector('.select-options').classList.add('hidden');
        parent.querySelector('.select-header').classList.add('selected');
    }

    // Controle Global de Abertura de Selects
    document.querySelectorAll('.select-header').forEach(header => {
        header.onclick = (e) => {
            e.stopPropagation();
            const options = header.nextElementSibling;
            document.querySelectorAll('.select-options').forEach(opt => {
                if(opt !== options) opt.classList.add('hidden');
            });
            options.classList.toggle('hidden');
        };
    });

    function limparCamposModal() {
        document.getElementById('nomePlanta').value = "";
        document.getElementById('descricao').value = "";
        imgPreview.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        document.querySelector('#selectEspecie .label').innerText = "Selecionar espécie";
        document.querySelector('#selectCategoria .label').innerText = "Selecionar categoria";
        setPrivacidade(true, '🌐', 'Público');
    }

    window.onclick = (e) => { 
        if (e.target == modal) modal.classList.remove('active');
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.select-options').forEach(opt => opt.classList.add('hidden'));
        }
    };
});