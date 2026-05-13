document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalPostagem');
    const btnAbrir = document.getElementById('btnAbrirModal');
    let isPublic = true;
    let cardSendoEditadoID = null; 

    // --- 1. ABRIR E FECHAR ---
    if(btnAbrir) {
        btnAbrir.onclick = () => {
            cardSendoEditadoID = null;
            limparCamposModal();
            document.getElementById('modalTitulo').innerText = "Adicionar Planta";
            document.getElementById('btnSalvar').innerText = "Salvar";
            modal.classList.add('active');
        };
    }
    
    window.onclick = (e) => { if (e.target == modal) modal.classList.remove('active'); };

    // --- 2. FUNÇÃO PARA ABRIR EM MODO EDIÇÃO ---
    window.abrirEdicao = (idDoCard) => {
        cardSendoEditadoID = idDoCard;
        const card = document.getElementById(idDoCard);

        document.getElementById('modalTitulo').innerText = "Editar Planta";
        document.getElementById('btnSalvar').innerText = "Salvar alterações ✔️";

        document.getElementById('nomePlanta').value = card.querySelector('.titulo-planta').innerText;
        document.getElementById('descricao').value = card.querySelector('.desc-planta').innerText;
        document.getElementById('imgPreview').src = card.querySelector('.img-planta').src;
        document.getElementById('imgPreview').classList.remove('hidden');
        document.getElementById('uploadPlaceholder').classList.add('hidden');
        
        document.querySelector('#selectEspecie .label').innerText = card.querySelector('.especie-planta').innerText;
        document.querySelector('#selectCategoria .label').innerText = card.querySelector('.categoria-planta').innerText;

        modal.classList.add('active');
    };

    // --- 3. BUSCA DE ESPÉCIES (API) ---
    const inputBusca = document.querySelector('.api-search');
    const containerEspecies = document.getElementById('resEspecies');

    inputBusca.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length < 3) {
            containerEspecies.innerHTML = '<p class="aviso" style="padding:10px; font-size:11px; color:#999;">Digite pelo menos 3 letras...</p>';
            return;
        }

        try {
            const response = await fetch(`https://api.gbif.org/v1/species/suggest?q=${query}&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c`);
            const data = await response.json();
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
        } catch (err) { console.error("Erro API:", err); }
    });

    // --- 4. CATEGORIAS ---
    const categorias = ["Suculentas", "Cactos", "Flores de Época", "Folhagens", "Frutíferas", "Ornamentais", "Medicinais", "Hortaliças"];
    const containerCat = document.getElementById('resCategorias');
    
    categorias.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerText = cat;
        div.onclick = (event) => {
            event.stopPropagation();
            selecionarUnico(div, cat, 'selectCategoria');
        };
        containerCat.appendChild(div);
    });

    function selecionarUnico(elemento, valor, parentId) {
        const parent = document.getElementById(parentId);
        Array.from(parent.querySelectorAll('.option-item')).forEach(el => el.classList.remove('active'));
        elemento.classList.add('active'); 
        const header = parent.querySelector('.select-header');
        header.querySelector('.label').innerText = valor;
        header.classList.add('selected');
        parent.querySelector('.select-options').classList.add('hidden');
    }

    document.querySelectorAll('.select-header').forEach(header => {
        header.onclick = (e) => {
            e.stopPropagation();
            const lista = header.nextElementSibling;
            lista.classList.toggle('hidden');
        };
    });

    // --- 5. PRIVACIDADE E UPLOAD ---
    const btnPrivacidade = document.getElementById('btnPrivacidade');
    btnPrivacidade.onclick = () => {
        isPublic = !isPublic;
        document.getElementById('pvtText').innerText = isPublic ? "Público" : "Privado";
        document.getElementById('pvtIcon').innerText = isPublic ? "🌐" : "🔒︎";
        btnPrivacidade.classList.toggle('privado', !isPublic);
    };

    const dropzone = document.getElementById('dropzone');
    const inputFoto = document.getElementById('inputFoto');
    const imgPreview = document.getElementById('imgPreview');

    dropzone.onclick = () => inputFoto.click();

    inputFoto.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                imgPreview.src = ev.target.result;
                imgPreview.classList.remove('hidden');
                document.getElementById('uploadPlaceholder').classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    };

    // --- 6. SALVAR ---
    document.getElementById('btnSalvar').onclick = () => {
        const nome = document.getElementById('nomePlanta').value;
        if (!nome) return alert("Dê um nome para sua planta!");

        if (cardSendoEditadoID) {
            const card = document.getElementById(cardSendoEditadoID);
            card.querySelector('.titulo-planta').innerText = nome;
            card.querySelector('.especie-planta').innerText = document.querySelector('#selectEspecie .label').innerText;
            card.querySelector('.categoria-planta').innerText = document.querySelector('#selectCategoria .label').innerText;
            card.querySelector('.desc-planta').innerText = document.getElementById('descricao').value;
            card.querySelector('.img-planta').src = imgPreview.src;
        }
        
        modal.classList.remove('active');
        limparCamposModal();
    };

    function limparCamposModal() {
        document.getElementById('nomePlanta').value = "";
        document.getElementById('descricao').value = "";
        document.querySelector('#selectEspecie .label').innerText = "Selecionar espécie";
        document.querySelector('#selectCategoria .label').innerText = "Selecionar categoria";
        imgPreview.classList.add('hidden');
        document.getElementById('uploadPlaceholder').classList.remove('hidden');
    }
});