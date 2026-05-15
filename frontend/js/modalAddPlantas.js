document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalPostagem');
    const btnAbrir = document.getElementById('btnAbrirModal');
    const imgPreview = document.getElementById('imgPreview');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const inputFoto = document.getElementById('inputFoto');
    const dropzone = document.getElementById('dropzone');
    
    // Elementos da Busca Manual
    const inputBuscaEspecie = document.querySelector('.api-search');
    const containerResultados = document.getElementById('resEspecies');

    let isPublic = true;

    // --- 1. CONFIGURAÇÃO DE CATEGORIAS ---
    const categorias = ["Suculentas", "Cactos", "Flores de Época", "Folhagens", "Frutíferas", "Ornamentais"];
    const containerCat = document.getElementById('resCategorias');

    if (containerCat) {
        containerCat.innerHTML = ''; // Limpa para evitar duplicatas
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

    // --- 2. BUSCA MANUAL (DIGITAR 3 LETRAS) ---
    if (inputBuscaEspecie) {
        inputBuscaEspecie.addEventListener('input', async (e) => {
            const termo = e.target.value;

            if (termo.length >= 3) {
                containerResultados.innerHTML = '<p class="aviso">Buscando...</p>';
                
                try {
                    const res = await fetch(`https://api.gbif.org/v1/species/suggest?q=${termo}&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c`);
                    const data = await res.json();

                    containerResultados.innerHTML = ''; 

                    if (data.length > 0) {
                        data.forEach(item => {
                            const p = document.createElement('p');
                            p.style.padding = "8px 12px";
                            p.style.cursor = "pointer";
                            p.style.fontSize = "13px";
                            p.style.borderBottom = "1px solid #eee";
                            p.innerText = item.canonicalName;
                            
                            p.onclick = () => {
                                const labelEspecie = document.querySelector('#selectEspecie .label');
                                labelEspecie.innerText = item.canonicalName;
                                document.getElementById('selectEspecie').classList.add('selected');
                                document.querySelector('#selectEspecie .select-options').classList.add('hidden');
                                inputBuscaEspecie.value = ''; // Limpa a busca
                            };
                            containerResultados.appendChild(p);
                        });
                    } else {
                        containerResultados.innerHTML = '<p class="aviso">Nenhuma espécie encontrada.</p>';
                    }
                } catch (err) {
                    containerResultados.innerHTML = '<p class="aviso">Erro ao conectar com a API.</p>';
                }
            } else {
                containerResultados.innerHTML = '<p class="aviso">Digite 3 letras para buscar...</p>';
            }
        });
    }

    // --- 3. LOGICA DE UPLOAD E AUTO-PREENCHIMENTO (VIA NOME ARQUIVO) ---
    if (dropzone) {
        dropzone.onclick = () => inputFoto.click();
    }

    inputFoto.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                imgPreview.src = ev.target.result;
                imgPreview.classList.remove('hidden');
                uploadPlaceholder.classList.add('hidden');

                const nomeArquivo = file.name.toLowerCase();
                
                if (nomeArquivo.includes('cacto')) {
                    dispararBuscaAPI("Cactaceae", "Cactos");
                } else if (nomeArquivo.includes('suculenta')) {
                    dispararBuscaAPI("Echeveria", "Suculentas");
                } else if (nomeArquivo.includes('jiboia')) {
                    dispararBuscaAPI("Epipremnum", "Folhagens");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    async function dispararBuscaAPI(termo, categoriaAlvo) {
        const labelEspecie = document.querySelector('#selectEspecie .label');
        const labelCategoria = document.querySelector('#selectCategoria .label');

        labelEspecie.innerText = "Identificando...";

        try {
            const res = await fetch(`https://api.gbif.org/v1/species/suggest?q=${termo}&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c`);
            const data = await res.json();
            
            if (data.length > 0) {
                labelEspecie.innerText = data[0].canonicalName;
                document.getElementById('selectEspecie').classList.add('selected');
            }

            labelCategoria.innerText = categoriaAlvo;
            document.getElementById('selectCategoria').classList.add('selected');
            marcarOpcaoAtiva('resCategorias', categoriaAlvo);

        } catch (err) {
            console.error("Erro GBIF:", err);
            labelEspecie.innerText = "Erro ao buscar";
        }
    }

    // --- 4. FUNÇÕES DE INTERFACE ---
    function selecionarUnico(elemento, valor, parentId) {
        const parent = document.getElementById(parentId);
        Array.from(parent.querySelectorAll('.option-item')).forEach(el => el.classList.remove('active'));
        elemento.classList.add('active');
        parent.querySelector('.label').innerText = valor;
        parent.querySelector('.select-header').classList.add('selected');
        parent.querySelector('.select-options').classList.add('hidden');
    }

    function marcarOpcaoAtiva(containerId, valor) {
        const items = document.querySelectorAll(`#${containerId} .option-item`);
        items.forEach(item => {
            if(item.innerText.trim() === valor) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    // Controle do Modal
    if(btnAbrir) btnAbrir.onclick = () => { limparCamposModal(); modal.classList.add('active'); };
    
    window.onclick = (e) => { 
        if (e.target == modal) {
            modal.classList.remove('active');
            fecharTodosSelects();
        }
    };
    
    // Toggle dos Selects
    document.querySelectorAll('.select-header').forEach(header => {
        header.onclick = (e) => {
            e.stopPropagation();
            const options = header.nextElementSibling;
            fecharTodosSelects(options);
            options.classList.toggle('hidden');
        };
    });

    function fecharTodosSelects(exceto = null) {
        document.querySelectorAll('.select-options').forEach(opt => {
            if(opt !== exceto) opt.classList.add('hidden');
        });
    }

    function limparCamposModal() {
        document.getElementById('nomePlanta').value = "";
        document.getElementById('descricao').value = "";
        if(inputBuscaEspecie) inputBuscaEspecie.value = "";
        document.querySelector('#selectEspecie .label').innerText = "Selecionar espécie";
        document.querySelector('#selectCategoria .label').innerText = "Selecionar categoria";
        imgPreview.classList.add('hidden');
        imgPreview.src = "";
        uploadPlaceholder.classList.remove('hidden');
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.option-item').forEach(el => el.classList.remove('active'));
        containerResultados.innerHTML = '<p class="aviso">Digite 3 letras para buscar...</p>';
    }
});