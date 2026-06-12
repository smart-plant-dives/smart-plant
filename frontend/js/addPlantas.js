// ================= MODAL PERFIL ================= 

const abrirModal = document.getElementById("abrirModal");
const fecharModal = document.getElementById("fecharModal");
const modal = document.getElementById("modalPostagem");

const btnAbrirPerfil = document.querySelector(".edit-profile"); 

const modalPerfil = document.getElementById("modalPerfil"); 

const cancelarPerfil = document.getElementById("cancelarPerfil"); 

const salvarPerfil = document.getElementById("salvarPerfil"); 

 

const inputNomePerfil = document.getElementById("inputNome"); 

const inputSobrePerfil = document.getElementById("inputSobre"); 

 

const nomePerfil = document.querySelector(".profile h2"); 

const bioPerfil = document.querySelector(".profile p"); 

 

// abrir modal 

btnAbrirPerfil.addEventListener("click", () => { 

    modalPerfil.classList.remove("hidden"); 

 

    inputNomePerfil.value = nomePerfil.innerText.replace("@", ""); 

    inputSobrePerfil.value = bioPerfil.innerText.trim(); 

}); 

 

// fechar 

cancelarPerfil.addEventListener("click", () => { 

    modalPerfil.classList.add("hidden"); 

}); 

 

// salvar 

salvarPerfil.addEventListener("click", () => { 

    nomePerfil.innerText = "@" + inputNomePerfil.value; 

    bioPerfil.innerText = inputSobrePerfil.value; 

 

    modalPerfil.classList.add("hidden"); 

}); 

 

 

// ================= FOTO PERFIL ================= 

 

const inputFotoPerfil = document.getElementById("inputFotoPerfil"); 

const btnTrocarFoto = document.getElementById("btnTrocarFoto"); 

const fotoPreview = document.getElementById("fotoPreview"); 

const textoPlaceholder = document.getElementById("textoPlaceholder"); 

const avatar = document.querySelector(".avatar"); 

 

btnTrocarFoto.addEventListener("click", () => { 

    inputFotoPerfil.click(); 

}); 

 

inputFotoPerfil.addEventListener("change", () => { 

    const file = inputFotoPerfil.files[0]; 

 

    if (file) { 

        const reader = new FileReader(); 

 

        reader.onload = function (e) { 

            fotoPreview.src = e.target.result; 

            fotoPreview.classList.remove("hidden"); 

            textoPlaceholder.style.display = "none"; 

 

            avatar.style.backgroundImage = `url(${e.target.result})`; 

            avatar.style.backgroundSize = "cover"; 

            avatar.style.backgroundPosition = "center"; 

        }; 

 

        reader.readAsDataURL(file); 

    } 

}); 

 

 

// ================= MODAL ADICIONAR ================= 

 

 

abrirModal.addEventListener("click", () => { 

    modal.classList.remove("hidden"); 

}); 

 

fecharModal.addEventListener("click", () => { 

    modal.classList.add("hidden"); 

}); 

 

 

// ================= UPLOAD IMAGEM ================= 

 

const inputFoto = document.getElementById("inputFoto"); 

const uploadArea = document.getElementById("uploadArea"); 

const uploadPlaceholder = document.getElementById("uploadPlaceholder"); 

 

let imagemBase64 = ""; 

 

uploadArea.addEventListener("click", () => { 

    inputFoto.click(); 

}); 

 

inputFoto.addEventListener("change", () => { 

    const file = inputFoto.files[0]; 

 

    if (file) { 

        const reader = new FileReader(); 

 

        reader.onload = function(e) { 

            imagemBase64 = e.target.result; 

 

            uploadPlaceholder.innerHTML = ` 

                <img src="${imagemBase64}"  

                style="width:100%; height:150px; object-fit:cover; border-radius:10px;"> 

            `; 

        }; 

 

        reader.readAsDataURL(file); 

    } 

}); 

 

 

// ================= CRIAR CARD ================= 

 

const btnSalvar = document.querySelector("#modalPostagem .btn-save"); 

 

const nome = document.getElementById("nomePlanta"); 

const especie = document.getElementById("especie"); 

const categoria = document.getElementById("categoria"); 

const descricao = document.getElementById("descricao"); 

const visibilidade = document.getElementById("visibilidade"); 

 

const cardsContainer = document.querySelector(".cards"); 

 

btnSalvar.addEventListener("click", () => { 

 

    if (!nome.value) { 

        alert("Digite o nome da planta!"); 

        return; 

    } 

 

    const novoCard = document.createElement("div"); 

    novoCard.classList.add("card"); 

 

    const tagPrivado = visibilidade.value === "privado" 

        ? `<span style="color:red; font-size:12px;">🔒 Privado</span>` 

        : ""; 

 

    novoCard.innerHTML = ` 

        <p class="user">@Melinda.22 ${tagPrivado}</p> 

        <img src="${imagemBase64 || 'https://via.placeholder.com/300'}"> 

        <h3>${nome.value}</h3> 

        <div data-categoria="${categoria.value}">${categoria.value}</div> 

        <div>${especie.value}</div> 

        <p>${descricao.value}</p> 

 

        <div class="actions"> 

            <button class="edit">✏</button> 

            <button class="delete">🗑</button> 

        </div> 

    `; 

 

    const botaoAdd = document.getElementById("abrirModal"); 

    cardsContainer.insertBefore(novoCard, botaoAdd); 

 

    modal.classList.add("hidden"); 

}); 

 

 

// ================= DELETAR ================= 

 

document.addEventListener("click", (e) => { 

    if (e.target.classList.contains("delete")) { 

        e.target.closest(".card").remove(); 

    } 

}); 

 

 

// ================= EDITAR CARD ================= 

 

const modalEditar = document.getElementById("modalEditar"); 

const cancelarEdicao = document.getElementById("cancelarEdicao"); 

const salvarEdicao = document.getElementById("salvarEdicao"); 

 

const editNome = document.getElementById("editNome"); 

const editDescricao = document.getElementById("editDescricao"); 

 

let cardEditando = null; 

 

document.addEventListener("click", (e) => { 

    if (e.target.classList.contains("edit")) { 

 

        cardEditando = e.target.closest(".card"); 

 

        editNome.value = cardEditando.querySelector("h3").innerText; 

        editDescricao.value = cardEditando.querySelector("p:not(.user)").innerText; 

 

        modalEditar.classList.remove("hidden"); 

    } 

}); 

 

cancelarEdicao.addEventListener("click", () => { 

    modalEditar.classList.add("hidden"); 

}); 

 

salvarEdicao.addEventListener("click", () => { 

    if (!cardEditando) return; 

 

    cardEditando.querySelector("h3").innerText = editNome.value; 

    cardEditando.querySelector("p:not(.user)").innerText = editDescricao.value; 

 

    modalEditar.classList.add("hidden"); 

}); 

 

 

// ================= FILTRO ================= 

 

const select = document.getElementById("opcoes"); 

const mensagem = document.getElementById("mensagemVazia"); 

 

select.addEventListener("change", () => { 

 

    const valor = select.value; 

    const cards = document.querySelectorAll(".card:not(.add)"); 

 

    let visiveis = 0; 

 

    cards.forEach(card => { 

 

        const categoriaEl = card.querySelector("[data-categoria]"); 

        if (!categoriaEl) return; 

 

        const categoria = categoriaEl.dataset.categoria; 

 

        if (valor === "todas" || categoria === valor) { 

            card.style.display = "block"; 

            visiveis++; 

        } else { 

            card.style.display = "none"; 

        } 

    }); 

 

    mensagem.style.display = visiveis === 0 ? "block" : "none"; 

}); 

 

const cadeado = document.createElement("div"); 

cadeado.classList.add("cadeado"); 

 

if (visibilidade.value !== "privado") { 

    cadeado.classList.add("hidden"); 

} 

 



 

btnSalvar.addEventListener("click", () => { 

 

    if (!nome.value) { 

        alert("Digite o nome da planta!"); 

        return; 

    } 

 

    const novoCard = document.createElement("div"); 

    novoCard.classList.add("card"); 

 

    // 🔒 AQUI 

    const cadeado = document.createElement("div"); 

    cadeado.classList.add("cadeado"); 

 

    if (visibilidade.value !== "privado") { 

        cadeado.classList.add("hidden"); 

    } 

 

    cadeado.textContent = "🔒"; 

    novoCard.appendChild(cadeado); 

 

    // resto do card 

    novoCard.innerHTML += ` 

        <p class="user">@Melinda.22</p> 

        <img src="${imagemBase64 || 'https://via.placeholder.com/300'}"> 

        <h3>${nome.value}</h3> 

        <div data-categoria="${categoria.value}">${categoria.value}</div> 

        <div>${especie.value}</div> 

        <p>${descricao.value}</p> 

 

        <div class="actions"> 

            <button class="edit"> EDITAR </button> 

            <button class="delete">🗑</button> 

        </div> 

    `; 

 

    const botaoAdd = document.getElementById("abrirModal"); 

    cardsContainer.insertBefore(novoCard, botaoAdd); 

 

    modal.classList.add("hidden"); 

}); 

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

    // O 'async' avisa que esta função fará uma operação de rede que pode demorar
async function carregarCatalogo(){
    try {
        // 1. Fazemos a chamada (GET) para a rota da nossa API Java
        const resposta = await fetch("http://localhost:8080/api/especie");

        // 2. Convertemos o texto que a API devolve num objeto JavaScript (JSON)
        const especie = await resposta.json();

        // 3. Capturamos a <div> vazia que deixamos no HTML
        const divLista = document.getElementById("lista-especie");
        divLista.innerHTML = ""; // Limpa a área antes de desenhar

       // 4. Percorremos cada produto que veio do banco de dados
        produtos.forEach(especie => {
            
            // Garantimos que é um número, fixamos 2 casas e trocamos ponto por vírgula
            let precoFormatado = parseFloat(produto.preco).toFixed(2).replace('.', ',');
            // O += vai "empilhando" o HTML de cada doce dentro da div principal
            divLista.innerHTML += `
                <div class="card">
                    <h3>${produto.nome}</h3>
                    <p style="color: #ff1493; font-weight: bold; margin-top: 10px;">
                        R$ ${precoFormatado}
                    </p>
                </div>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar catálogo:", erro);
        document.getElementById("lista-produtos").innerHTML = "<p>Erro ao carregar doces.</p>";
    }
}

// Executa a função assim que o utilizador abre a página
carregarCatalogo();


async function carregarPlantas() {
    const resposta = await fetch("http://localhost:8080/api/plantas");
    const plantas = await resposta.json();

    const container = document.getElementById("container-plantas");

    plantas.forEach(planta => {
        const card = document.createElement("article");
        card.classList.add("plant-card");

        // 🔥 DADOS (igual você fazia no HTML)
        card.dataset.nome = planta.nome;
        card.dataset.especie = planta.especie;
        card.dataset.categoria = planta.categoria;
        card.dataset.descricao = planta.descricao;
        card.dataset.img = planta.imagem;

        // 👇 CONTEÚDO VISÍVEL (ANTES DO CLIQUE)
        card.innerHTML = `
            <img src="${planta.imagem}" alt="${planta.nome}">
            <h3>${planta.nome}</h3>
            <p class="especie">${planta.especie}</p>
            <p class="categoria">${planta.categoria}</p>
        `;

        container.appendChild(card);
    });
}

carregarPlantas();

// ==========================================
// 1. VERIFICAÇÃO DE SESSÃO
// ==========================================
const usuarioLocal = localStorage.getItem("usuarioSessao");

if (!usuarioLocal) {
    window.location.href = "login.html";
} else {
    const usuarioObj = JSON.parse(usuarioLocal);
    document.getElementById("nomeUsuario").innerText = usuarioObj.nome;
}

// ==========================================
// 2. LISTAR PLANTAS (GET)
// ==========================================
async function listarPlantas() {
    const resposta = await fetch("http://localhost:8080/plantas");
    const plantas = await resposta.json();

    const container = document.getElementById("cards");

    // limpa tudo (menos o botão +)
    container.innerHTML = `
        <div class="card add" id="abrirModal">
            <span>+</span>
            <p>Adicionar nova planta</p>
        </div>
    `;

    plantas.forEach(planta => {
        container.innerHTML += `
            <div class="card">
                <div class="cadeado ${planta.visibilidade === 'privado' ? '' : 'hidden'}">🔒</div>

                <p class="user">@${planta.usuarioNome || "user"}</p>

                <img src="${planta.imagem || 'https://via.placeholder.com/150'}">

                <h3>${planta.nome}</h3>

                <div>${planta.categoria}</div>
                <div>${planta.especie}</div>

                <p>${planta.descricao || ""}</p>

                <div class="actions">
                    <button onclick="editarPlanta(${planta.id})">✏</button>
                    <button onclick="deletarPlanta(${planta.id})">🗑</button>
                </div>
            </div>
        `;
    });
}

// ==========================================
// 3. ABRIR / FECHAR MODAL
// ==========================================

document.getElementById("abrirModal").addEventListener("click", () => {
    modal.classList.remove("hidden");
});

document.getElementById("fecharModal").addEventListener("click", () => {
    modal.classList.add("hidden");
});

// ==========================================
// 4. CADASTRAR PLANTA (POST)
// ==========================================
document.querySelector(".btn-save").addEventListener("click", async () => {

    const novaPlanta = {
        nome: document.getElementById("nomePlanta").value,
        especie: document.getElementById("especie").value,
        categoria: document.getElementById("categoria").value,
        descricao: document.getElementById("descricao").value,
        visibilidade: document.getElementById("visibilidade").value,
        imagem: "" // pode implementar upload depois
    };

    const resposta = await fetch("http://localhost:8080/api/plantas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaPlanta)
    });

    if (resposta.ok) {
        modal.classList.add("hidden");
        listarPlantas();
    } else {
        alert("Erro ao salvar planta");
    }
});

// ==========================================
// 5. DELETAR PLANTA (DELETE)
// ==========================================
async function deletarPlanta(id) {
    const confirmacao = confirm("Deseja deletar essa planta?");

    if (confirmacao) {
        await fetch(`http://localhost:8080/plantas/${id}`, {
            method: "DELETE"
        });

        listarPlantas();
    }
}

// ==========================================
// 6. EDITAR (SIMPLES - ALERTA POR ENQUANTO)
// ==========================================
function editarPlanta(id) {
    alert("Implementar edição da planta ID: " + id);
}

// ==========================================
// 7. INICIAR
// ==========================================
listarPlantas();

//
//  8. API DAS ESPECIES

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