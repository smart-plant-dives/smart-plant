document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalPostagem');
    const btnAbrir = document.getElementById('btnAbrirModal');
    const btnSalvar = document.getElementById('btnSalvar');
    const btnPrivacidade = document.getElementById('btnPrivacidade');
    
    let cardSendoEditadoID = null; 
    let estadoPublico = true; // Gerencia privacidade

    // --- 1. ABRIR MODO ADICIONAR ---
    if(btnAbrir) {
        btnAbrir.onclick = () => {
            cardSendoEditadoID = null;
            limparCamposModal();
            document.getElementById('modalTitulo').innerText = "Adicionar Planta";
            btnSalvar.innerText = "Salvar";
            modal.classList.add('active');
        };
    }

    // --- 2. ABRIR MODO EDITAR (ACIONADO PELO LÁPIS) ---
    window.abrirEdicao = (idDoCard) => {
        cardSendoEditadoID = idDoCard;
        const card = document.getElementById(idDoCard);

        document.getElementById('modalTitulo').innerText = "Editar Planta";
        btnSalvar.innerText = "Salvar alterações";

        // Preencher dados básicos
        document.getElementById('nomePlanta').value = card.querySelector('.titulo-planta').innerText;
        document.getElementById('descricao').value = card.querySelector('.desc-planta').innerText;
        document.getElementById('imgPreview').src = card.querySelector('.img-planta').src;
        document.getElementById('imgPreview').classList.remove('hidden');
        document.getElementById('uploadPlaceholder').classList.add('hidden');
        
        // Sincronizar Labels dos Selects
        document.querySelector('#selectEspecie .label').innerText = card.querySelector('.especie-planta').innerText;
        document.querySelector('#selectCategoria .label').innerText = card.querySelector('.categoria-planta').innerText;

        // Sincronizar Privacidade
        const pvtAtual = card.getAttribute('data-privacidade');
        estadoPublico = (pvtAtual === 'publico');
        atualizarVisualPrivacidade();

        modal.classList.add('active');
    };

    // --- 3. PRIVACIDADE ---
    btnPrivacidade.onclick = () => {
        estadoPublico = !estadoPublico;
        atualizarVisualPrivacidade();
    };

    function atualizarVisualPrivacidade() {
    const pvtText = document.getElementById('pvtText');
    const pvtIcon = document.getElementById('pvtIcon');

    if (estadoPublico) {
        pvtText.innerText = "Público";
        pvtIcon.innerText = "🌐";
    } else {
        pvtText.innerText = "Privado";
        pvtIcon.innerText = "🔒"; 
    }
    
    // Opcional: removemos a classe 'privado' se não for mais usar cor cinza no botão todo
    btnPrivacidade.classList.toggle('privado', !estadoPublico);
}

    // --- 4. API E CATEGORIAS (IGUAL AO SEU ORIGINAL) ---
    const inputBusca = document.querySelector('.api-search');
    const containerEspecies = document.getElementById('resEspecies');

    inputBusca.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length < 3) return;
        try {
            const response = await fetch(`https://api.gbif.org/v1/species/suggest?q=${query}&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c`);
            const data = await response.json();
            containerEspecies.innerHTML = ''; 
            data.forEach(item => {
                if (item.canonicalName) {
                    const div = document.createElement('div');
                    div.className = 'option-item';
                    div.innerText = item.canonicalName;
                    div.onclick = (event) => { event.stopPropagation(); selecionarUnico(div, item.canonicalName, 'selectEspecie'); };
                    containerEspecies.appendChild(div);
                }
            });
        } catch (err) { console.error(err); }
    });

    const categorias = ["Suculentas", "Cactos", "Folhagens", "Ornamentais", "Frutíferas"];
    const containerCat = document.getElementById('resCategorias');
    categorias.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerText = cat;
        div.onclick = (e) => { e.stopPropagation(); selecionarUnico(div, cat, 'selectCategoria'); };
        containerCat.appendChild(div);
    });

    function selecionarUnico(elemento, valor, parentId) {
        const parent = document.getElementById(parentId);
        Array.from(parent.querySelectorAll('.option-item')).forEach(el => el.classList.remove('active'));
        elemento.classList.add('active'); 
        parent.querySelector('.label').innerText = valor;
        parent.querySelector('.select-options').classList.add('hidden');
    }

    document.querySelectorAll('.select-header').forEach(header => {
        header.onclick = (e) => { e.stopPropagation(); header.nextElementSibling.classList.toggle('hidden'); };
    });

    // --- 5. SALVAR ---
    btnSalvar.onclick = () => {
        const nome = document.getElementById('nomePlanta').value;
        if (!nome) return alert("Dê um nome para sua planta!");

        if (cardSendoEditadoID) {
            const card = document.getElementById(cardSendoEditadoID);
            card.querySelector('.titulo-planta').innerText = nome;
            card.querySelector('.especie-planta').innerText = document.querySelector('#selectEspecie .label').innerText;
            card.querySelector('.categoria-planta').innerText = document.querySelector('#selectCategoria .label').innerText;
            card.querySelector('.desc-planta').innerText = document.getElementById('descricao').value;
            card.querySelector('.img-planta').src = document.getElementById('imgPreview').src;
            
            // Salva Privacidade
            const status = estadoPublico ? 'publico' : 'privado';
            card.setAttribute('data-privacidade', status);
            if(card.querySelector('.status-icon')) card.querySelector('.status-icon').innerText = estadoPublico ? '🌐' : '🔒︎';
            
            alert("Planta atualizada!");
        }
        modal.classList.remove('active');
    };

    function limparCamposModal() {
        document.getElementById('nomePlanta').value = "";
        document.getElementById('descricao').value = "";
        document.getElementById('imgPreview').classList.add('hidden');
        document.getElementById('uploadPlaceholder').classList.remove('hidden');
        document.querySelector('#selectEspecie .label').innerText = "Selecionar espécie";
        document.querySelector('#selectCategoria .label').innerText = "Selecionar categoria";
        estadoPublico = true;
        atualizarVisualPrivacidade();
    }

    // Fechar ao clicar fora
    window.onclick = (e) => { if (e.target == modal) modal.classList.remove('active'); };

    // Upload de foto
    document.getElementById('dropzone').onclick = () => document.getElementById('inputFoto').click();
    document.getElementById('inputFoto').onchange = (e) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = document.getElementById('imgPreview');
            img.src = ev.target.result;
            img.classList.remove('hidden');
            document.getElementById('uploadPlaceholder').classList.add('hidden');
        };
        reader.readAsDataURL(e.target.files[0]);
    };
});