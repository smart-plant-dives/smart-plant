const API_BASE = "http://localhost:8080/api";

//secao
const usuarioSessao = JSON.parse(localStorage.getItem("usuarioSessao") || "null");

if (!usuarioSessao) {
    window.location.href = "cadastroUsuarioo.html";
    throw new Error("Voce não possui uma conta!");
}

let perfilExtra = JSON.parse(localStorage.getItem("perfilExtra") || "null") || {
    username: "@" + (usuarioSessao.login || "usuario"),
    instagram: "",
    facebook: "",
    sobre: "",
    foto: ""
};

let categorias = [];      // [{id, nomeCategoria}]
let plantas = [];         // cache da última listagem
let categoriaFiltroAtual = "todas";

//elementos
const cardsContainer = document.getElementById("cards");
const abrirModalBtn = document.getElementById("abrirModal");
const mensagemVazia = document.getElementById("mensagemVazia");
const selectFiltro = document.getElementById("opcoes");

const modalPostagem = document.getElementById("modalPostagem");
const fecharModalBtn = document.getElementById("fecharModal");
const btnSalvarPlanta = document.getElementById("btnSalvarPlanta");
const inputNomePlanta = document.getElementById("nomePlanta");
const inputEspecie = document.getElementById("especie");
const selectCategoria = document.getElementById("categoria");
const inputUrlImagem = document.getElementById("urlImagem");

const modalEditar = document.getElementById("modalEditar");
const cancelarEdicaoBtn = document.getElementById("cancelarEdicao");
const salvarEdicaoBtn = document.getElementById("salvarEdicao");
const inputEditNome = document.getElementById("editNome");
const inputEditEspecie = document.getElementById("editEspecie");
const selectEditCategoria = document.getElementById("editCategoria");
const inputEditUrlImagem = document.getElementById("editUrlImagem");
let idPlantaEmEdicao = null;

const modalPerfil = document.getElementById("modalPerfil");
const btnAbrirPerfil = document.querySelector(".edit-profile");
const cancelarPerfilBtn = document.getElementById("cancelarPerfil");
const salvarPerfilBtn = document.getElementById("salvarPerfil");
const inputNomePerfil = document.getElementById("inputNome");
const inputInstaPerfil = document.getElementById("inputInsta");
const inputFacePerfil = document.getElementById("inputFace");
const inputSobrePerfil = document.getElementById("inputSobre");

const fotoPerfilImg = document.getElementById("fotoPerfil");
const nomeUsuarioSpan = document.getElementById("nomeUsuario");
const usernameH2 = document.getElementById("username");
const bioUsuarioP = document.getElementById("bioUsuario");

const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const btnTrocarFoto = document.getElementById("btnTrocarFoto");
const fotoPreview = document.getElementById("fotoPreview");
const textoPlaceholder = document.getElementById("textoPlaceholder");

//mostra perfil
function renderizarPerfil() {
    nomeUsuarioSpan.innerText = usuarioSessao.nome || "";
    usernameH2.innerText = perfilExtra.username || "";
    bioUsuarioP.innerText = perfilExtra.sobre || "";

    if (perfilExtra.foto) {
        fotoPerfilImg.src = perfilExtra.foto;
    }
}

renderizarPerfil();

//mostra as categorias
async function carregarCategorias() {
    try {
        const resposta = await fetch(`${API_BASE}/categoria`);
        categorias = await resposta.json();

        // Select do modal de adicionar
        selectCategoria.innerHTML = '<option value="">Selecionar categoria</option>';
        categorias.forEach(cat => {
            selectCategoria.innerHTML += `<option value="${cat.id}">${cat.nomeCategoria}</option>`;
        });

        // Select do modal de editar
        selectEditCategoria.innerHTML = '<option value="">Selecione a categoria</option>';
        categorias.forEach(cat => {
            selectEditCategoria.innerHTML += `<option value="${cat.id}">${cat.nomeCategoria}</option>`;
        });

        // Select de filtro no topo da página
        selectFiltro.innerHTML = '<option value="todas">Todas</option>';
        categorias.forEach(cat => {
            selectFiltro.innerHTML += `<option value="${cat.id}">${cat.nomeCategoria}</option>`;
        });

    } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);
    }
}

//mostra as plantas
function nomeDaCategoria(planta) {
    return planta.nomeCategoria ? planta.nomeCategoria.nomeCategoria : "Sem categoria";
}

function idDaCategoria(planta) {
    return planta.nomeCategoria ? planta.nomeCategoria.id : "";
}

function renderizarCards() {
    // remove todos os cards de planta, mas preserva a mensagem vazia e o botão "+"
    cardsContainer.querySelectorAll(".card:not(.add)").forEach(card => card.remove());

    const plantasFiltradas = categoriaFiltroAtual === "todas"
        ? plantas
        : plantas.filter(p => String(idDaCategoria(p)) === String(categoriaFiltroAtual));

    plantasFiltradas.forEach(planta => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.id = planta.id;

        card.innerHTML = `
            <img src="${planta.url || 'https://via.placeholder.com/300?text=Sem+imagem'}" alt="${planta.nomePlanta}">
            <h3>${planta.nomePlanta}</h3>
            <div data-categoria="${idDaCategoria(planta)}">${nomeDaCategoria(planta)}</div>
            <div data-especie="${planta.especie}">${planta.especie}</div>
            <div class="actions">
                <button class="edit" data-id="${planta.id}">✏</button>
                <button class="delete" data-id="${planta.id}">🗑</button>
            </div>
        `;

        cardsContainer.insertBefore(card, abrirModalBtn);
    });

    mensagemVazia.style.display = plantasFiltradas.length === 0 ? "block" : "none";

    // liga os botões de editar/apagar dos cards recém-criados
    cardsContainer.querySelectorAll(".edit").forEach(btn => {
        btn.addEventListener("click", () => abrirEdicao(Number(btn.dataset.id)));
    });
    cardsContainer.querySelectorAll(".delete").forEach(btn => {
        btn.addEventListener("click", () => apagarPlanta(Number(btn.dataset.id)));
    });
}

async function carregarPlantas() {
    try {
        const resposta = await fetch(`${API_BASE}/planta/usuario/${usuarioSessao.id}`);
        plantas = await resposta.json();
        renderizarCards();
    } catch (erro) {
        console.error("Erro ao carregar plantas:", erro);
    }
}

selectFiltro.addEventListener("change", () => {
    categoriaFiltroAtual = selectFiltro.value;
    renderizarCards();
});

//add planta
abrirModalBtn.addEventListener("click", () => {
    inputNomePlanta.value = "";
    inputEspecie.value = "";
    selectCategoria.value = "";
    inputUrlImagem.value = "";
    modalPostagem.classList.remove("hidden");
});

fecharModalBtn.addEventListener("click", () => {
    modalPostagem.classList.add("hidden");
});

btnSalvarPlanta.addEventListener("click", async () => {
    const nomePlanta = inputNomePlanta.value.trim();
    const especie = inputEspecie.value.trim();
    const categoriaId = selectCategoria.value;
    const url = inputUrlImagem.value.trim();

    if (!nomePlanta || !especie || !categoriaId) {
        alert("Preencha nome, espécie e categoria.");
        return;
    }

    const novaPlanta = {
        nomePlanta: nomePlanta,
        especie: especie,
        nomeCategoria: { id: Number(categoriaId) },
        url: url
    };

    try {
        const resposta = await fetch(`${API_BASE}/planta/usuario/${usuarioSessao.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaPlanta)
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível salvar a planta.");
        }

        modalPostagem.classList.add("hidden");
        await carregarPlantas();

    } catch (erro) {
        console.error("Erro ao salvar planta:", erro);
        alert(erro.message);
    }
});

//editra planta
function abrirEdicao(id) {
    const planta = plantas.find(p => p.id === id);
    if (!planta) return;

    idPlantaEmEdicao = id;
    inputEditNome.value = planta.nomePlanta || "";
    inputEditEspecie.value = planta.especie || "";
    selectEditCategoria.value = idDaCategoria(planta) || "";
    inputEditUrlImagem.value = planta.url || "";

    modalEditar.classList.remove("hidden");
}

cancelarEdicaoBtn.addEventListener("click", () => {
    modalEditar.classList.add("hidden");
    idPlantaEmEdicao = null;
});

salvarEdicaoBtn.addEventListener("click", async () => {
    if (idPlantaEmEdicao === null) return;

    const plantaAtualizada = {
        nomePlanta: inputEditNome.value.trim(),
        especie: inputEditEspecie.value.trim(),
        nomeCategoria: selectEditCategoria.value ? { id: Number(selectEditCategoria.value) } : null,
        url: inputEditUrlImagem.value.trim()
    };

    try {
        const resposta = await fetch(`${API_BASE}/planta/${idPlantaEmEdicao}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(plantaAtualizada)
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível atualizar a planta.");
        }

        modalEditar.classList.add("hidden");
        idPlantaEmEdicao = null;
        await carregarPlantas();

    } catch (erro) {
        console.error("Erro ao atualizar planta:", erro);
        alert(erro.message);
    }
});

// apaga planta
async function apagarPlanta(id) {
    if (!confirm("Deseja apagar essa planta?")) return;

    try {
        const resposta = await fetch(`${API_BASE}/planta/${id}`, { method: "DELETE" });

        if (!resposta.ok) {
            throw new Error("Não foi possível apagar a planta.");
        }

        await carregarPlantas();

    } catch (erro) {
        console.error("Erro ao apagar planta:", erro);
        alert(erro.message);
    }
}

//edit perfil
btnAbrirPerfil.addEventListener("click", () => {
    inputNomePerfil.value = usuarioSessao.nome || "";
    inputInstaPerfil.value = perfilExtra.instagram || "";
    inputFacePerfil.value = perfilExtra.facebook || "";
    inputSobrePerfil.value = perfilExtra.sobre || "";

    if (perfilExtra.foto) {
        fotoPreview.src = perfilExtra.foto;
        fotoPreview.classList.remove("hidden");
        textoPlaceholder.style.display = "none";
    }

    modalPerfil.classList.remove("hidden");
});

cancelarPerfilBtn.addEventListener("click", () => {
    modalPerfil.classList.add("hidden");
});

salvarPerfilBtn.addEventListener("click", () => {
    usuarioSessao.nome = inputNomePerfil.value.trim() || usuarioSessao.nome;
    localStorage.setItem("usuarioSessao", JSON.stringify(usuarioSessao));

    perfilExtra.instagram = inputInstaPerfil.value.trim();
    perfilExtra.facebook = inputFacePerfil.value.trim();
    perfilExtra.sobre = inputSobrePerfil.value.trim();
    localStorage.setItem("perfilExtra", JSON.stringify(perfilExtra));

    renderizarPerfil();
    modalPerfil.classList.add("hidden");
});

btnTrocarFoto.addEventListener("click", () => {
    inputFotoPerfil.click();
});

inputFotoPerfil.addEventListener("change", () => {
    const arquivo = inputFotoPerfil.files[0];
    if (!arquivo) return;

    if (arquivo.size > 2 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 2MB");
        inputFotoPerfil.value = "";
        return;
    }

    const leitor = new FileReader();
    leitor.onload = (e) => {
        perfilExtra.foto = e.target.result;
        localStorage.setItem("perfilExtra", JSON.stringify(perfilExtra));

        fotoPreview.src = perfilExtra.foto;
        fotoPreview.classList.remove("hidden");
        textoPlaceholder.style.display = "none";

        renderizarPerfil();
    };
    leitor.readAsDataURL(arquivo);
});

//carrega categoruas e plantas logo que abrir
(async function iniciar() {
    await carregarCategorias();
    await carregarPlantas();
})();
