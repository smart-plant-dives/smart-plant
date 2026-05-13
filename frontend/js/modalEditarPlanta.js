document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalPostagem');
    const btnAbrir = document.getElementById('btnAbrirModal');
    const imgPreview = document.getElementById('imgPreview');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const inputFoto = document.getElementById('inputFoto');
    const dropzone = document.getElementById('dropzone');

    // 1. GERAR CATEGORIAS
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

    // 2. UPLOAD E BUSCA AUTOMÁTICA
    dropzone.onclick = () => inputFoto.click();

    inputFoto.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                imgPreview.src = ev.target.result;
                imgPreview.classList.remove('hidden');
                uploadPlaceholder.classList.add('hidden');

                // Lógica: se o arquivo tiver "cacto" no nome, busca na API GBIF
                const nomeArq = file.name.toLowerCase();
                if (nomeArq.includes('cacto')) {
                    buscarNaSuaAPI("Cactaceae", "Cactos");
                } else if (nomeArq.includes('jiboia')) {
                    buscarNaSuaAPI("Epipremnum", "Folhagens");
                } else if (nomeArq.includes('suculenta')) {
                    buscarNaSuaAPI("Echeveria", "Suculentas");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    async function buscarNaSuaAPI(termo, categoriaAlvo) {
        const labelEspecie = document.querySelector('#selectEspecie .label');
        const labelCategoria = document.querySelector('#selectCategoria .label');
        
        labelEspecie.innerText = "Buscando...";

        try {
            const response = await fetch(`https://api.gbif.org/v1/species/suggest?q=${termo}`);
            const data = await response.json();
            
            if (data.length > 0) {
                labelEspecie.innerText = data[0].canonicalName;
                document.querySelector('#selectEspecie .select-header').classList.add('selected');
            }

            labelCategoria.innerText = categoriaAlvo;
            document.querySelector('#selectCategoria .select-header').classList.add('selected');
            
            // Marca o quadradinho verde
            marcarOpcaoAtiva('resCategorias', categoriaAlvo);
            
        } catch (err) {
            labelEspecie.innerText = termo; // Fallback
        }
    }

    function selecionarUnico(elemento, valor, parentId) {
        const parent = document.getElementById(parentId);
        Array.from(parent.querySelectorAll('.option-item')).forEach(el => el.classList.remove('active'));
        elemento.classList.add('active');
        parent.querySelector('.label').innerText = valor;
        parent.querySelector('.select-header').classList.add('selected');
        parent.querySelector('.select-options').classList.add('hidden');
    }

    function marcarOpcaoAtiva(containerId, valor) {
        document.querySelectorAll(`#${containerId} .option-item`).forEach(item => {
            if(item.innerText.trim() === valor) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    // INTERFACE
    if(btnAbrir) btnAbrir.onclick = () => { limparModal(); modal.classList.add('active'); };
    window.onclick = (e) => { if (e.target == modal) modal.classList.remove('active'); };
    
    document.querySelectorAll('.select-header').forEach(header => {
        header.onclick = (e) => {
            e.stopPropagation();
            header.nextElementSibling.classList.toggle('hidden');
        };
    });

    document.getElementById('btnPrivacidade').onclick = function() {
        const txt = document.getElementById('pvtText');
        const ico = document.getElementById('pvtIcon');
        if (txt.innerText === "Público") {
            txt.innerText = "Privado";
            ico.innerText = "🔒︎";
        } else {
            txt.innerText = "Público";
            ico.innerText = "🌐";
        }
    };

    function limparModal() {
        imgPreview.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        document.querySelector('#selectEspecie .label').innerText = "Selecionar espécie";
        document.querySelector('#selectCategoria .label').innerText = "Selecionar categoria";
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.option-item').forEach(el => el.classList.remove('active'));
    }
});