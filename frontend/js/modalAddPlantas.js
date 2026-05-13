document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalPostagem');
    const btnAbrir = document.getElementById('btnAbrirModal');
    const imgPreview = document.getElementById('imgPreview');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const inputFoto = document.getElementById('inputFoto');
    const dropzone = document.getElementById('dropzone');

    let isPublic = true;

    // --- 1. CONFIGURAÇÃO DE CATEGORIAS ---
    const categorias = ["Suculentas", "Cactos", "Flores de Época", "Folhagens", "Frutíferas", "Ornamentais"];
    const containerCat = document.getElementById('resCategorias');

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

    // --- 2. LOGICA DE UPLOAD E AUTO-PREENCHIMENTO ---
    dropzone.onclick = () => inputFoto.click();

    inputFoto.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                imgPreview.src = ev.target.result;
                imgPreview.classList.remove('hidden');
                uploadPlaceholder.classList.add('hidden');

                // Lógica de "IA" baseada no nome do arquivo para usar sua API GBIF
                const nomeArquivo = file.name.toLowerCase();
                
                if (nomeArquivo.includes('cacto')) {
                    dispararBuscaAPI("Cactaceae", "Cactos");
                } else if (nomeArquivo.includes('suculenta')) {
                    dispararBuscaAPI("Echeveria", "Suculentas");
                } else if (nomeArquivo.includes('jiboia')) {
                    dispararBuscaAPI("Epipremnum", "Folhagens");
                } else {
                    // Caso não reconheça, limpa para seleção manual
                    document.querySelector('#selectEspecie .label').innerText = "Selecionar espécie";
                    document.querySelector('#selectCategoria .label').innerText = "Selecionar categoria";
                }
            };
            reader.readAsDataURL(file);
        }
    };

    async function dispararBuscaAPI(termo, categoriaAlvo) {
        const labelEspecie = document.querySelector('#selectEspecie .label');
        const labelCategoria = document.querySelector('#selectCategoria .label');

        labelEspecie.innerText = "Buscando na API...";

        try {
            // Usando a API que você já possui
            const res = await fetch(`https://api.gbif.org/v1/species/suggest?q=${termo}&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c`);
            const data = await res.json();
            
            if (data.length > 0) {
                labelEspecie.innerText = data[0].canonicalName;
                document.getElementById('selectEspecie').classList.add('selected');
            }

            // Preenche Categoria e ativa o quadradinho verde
            labelCategoria.innerText = categoriaAlvo;
            document.getElementById('selectCategoria').classList.add('selected');
            marcarOpcaoAtiva('resCategorias', categoriaAlvo);

        } catch (err) {
            console.error("Erro GBIF:", err);
            labelEspecie.innerText = "Erro ao buscar";
        }
    }

    // --- 3. FUNÇÕES DE INTERFACE ---
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

    if(btnAbrir) btnAbrir.onclick = () => { limparCamposModal(); modal.classList.add('active'); };
    window.onclick = (e) => { if (e.target == modal) modal.classList.remove('active'); };
    
    document.querySelectorAll('.select-header').forEach(header => {
        header.onclick = (e) => {
            e.stopPropagation();
            const options = header.nextElementSibling;
            // Fecha outros abertos
            document.querySelectorAll('.select-options').forEach(opt => {
                if(opt !== options) opt.classList.add('hidden');
            });
            options.classList.toggle('hidden');
        };
    });

    const btnPrivacidade = document.getElementById('btnPrivacidade');
    btnPrivacidade.onclick = () => {
        isPublic = !isPublic;
        document.getElementById('pvtText').innerText = isPublic ? "Público" : "Privado";
        document.getElementById('pvtIcon').innerText = isPublic ? "🌐" : "🔒︎";
    };

    function limparCamposModal() {
        document.getElementById('nomePlanta').value = "";
        document.querySelector('#selectEspecie .label').innerText = "Selecionar espécie";
        document.querySelector('#selectCategoria .label').innerText = "Selecionar categoria";
        imgPreview.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.option-item').forEach(el => el.classList.remove('active'));
    }
});