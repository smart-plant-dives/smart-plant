document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalPostagem');
    const inputNome = document.getElementById('nomePlanta');
    const inputDesc = document.getElementById('descricao');
    const imgPreview = document.getElementById('imgPreview');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const btnSalvar = document.getElementById('btnSalvar');
    const inputFoto = document.getElementById('inputFoto');

    let cardEditando = null;
    let estadoPublico = true; 

    document.addEventListener("click", (e) => {
        // Se clicar no elemento com classe 'edit' ou dentro dele (ícone)
        if (e.target.classList.contains("edit") || e.target.closest(".edit")) {
            
            cardEditando = e.target.closest(".card");

            if (cardEditando) {

                inputNome.value = cardEditando.querySelector("h3").innerText;

                const pDesc = cardEditando.querySelector("p:not(.user)");
                inputDesc.value = pDesc ? pDesc.innerText : "";

                const fotoCard = cardEditando.querySelector("img").src;
                imgPreview.src = fotoCard;
                imgPreview.classList.remove("hidden");
                uploadPlaceholder.classList.add("hidden");

                const iconCard = cardEditando.querySelector(".status-icon") || cardEditando.querySelector(".cadeado");
                if (iconCard && iconCard.innerText === "🔒") {
                    setPrivacidade(false, '🔒', 'Privado');
                } else {
                    setPrivacidade(true, '🌐', 'Público');
                }

                modal.classList.add("active");
            }
        }
    });

    const inputBusca = document.querySelector('.api-search');
    const containerEspecies = document.getElementById('resEspecies');

    inputBusca.addEventListener('input', async (e) => {
        const query = e.target.value;
        
        if (query.length < 3) {
            containerEspecies.innerHTML = '<p class="aviso">Digite 3 letras para buscar...</p>';
            return;
        }

        try {
            const res = await fetch(`https://api.gbif.org/v1/species/suggest?q=${query}`);
            const data = await res.json();
            containerEspecies.innerHTML = ''; 

            data.forEach(item => {
                const div = document.createElement('div');
                div.className = 'option-item';
                div.innerText = item.canonicalName;
                div.onclick = (ev) => {
                    ev.stopPropagation();
                    document.querySelector('#selectEspecie .label').innerText = item.canonicalName;
                    document.querySelector('#selectEspecie .select-options').classList.add('hidden');
                };
                containerEspecies.appendChild(div);
            });
        } catch (err) { console.error("Erro na API de espécies", err); }
    });

    window.setPrivacidade = (pub, ico, txt) => {
        estadoPublico = pub;
        document.getElementById('pvtIcon').innerText = ico;
        document.getElementById('pvtText').innerText = txt;
        document.querySelector('#selectPrivacidade .select-options').classList.add('hidden');
    };

    document.querySelectorAll('.select-header').forEach(header => {
        header.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.select-options').forEach(opt => {
                if (opt !== header.nextElementSibling) opt.classList.add('hidden');
            });
            header.nextElementSibling.classList.toggle('hidden');
        };
    });

    const categorias = ["Suculentas", "Cactos", "Folhagens", "Ornamentais", "Frutíferas"];
    const containerCat = document.getElementById('resCategorias');
    if (containerCat) {
        categorias.forEach(cat => {
            const div = document.createElement('div');
            div.className = 'option-item';
            div.innerText = cat;
            div.onclick = (e) => {
                e.stopPropagation();
                document.querySelector('#selectCategoria .label').innerText = cat;
                containerCat.classList.add('hidden');
            };
            containerCat.appendChild(div);
        });
    }

    btnSalvar.onclick = () => {
        if (!inputNome.value) return alert("A planta precisa de um nome!");

        if (cardEditando) {

            cardEditando.querySelector("h3").innerText = inputNome.value;
            
            const pDesc = cardEditando.querySelector("p:not(.user)");
            if (pDesc) pDesc.innerText = inputDesc.value;

            cardEditando.querySelector("img").src = imgPreview.src;

            const statusIcon = cardEditando.querySelector(".status-icon") || cardEditando.querySelector(".cadeado");
            if (statusIcon) {
                statusIcon.innerText = estadoPublico ? '🌐' : '🔒';

                if (estadoPublico) statusIcon.classList.add('hidden');
                else statusIcon.classList.remove('hidden');
            }

            modal.classList.remove("active");
        }
    };

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

    window.onclick = (e) => { if (e.target == modal) modal.classList.remove('active'); };
    document.addEventListener('keydown', (e) => { if (e.key === "Escape") modal.classList.remove('active'); });
});