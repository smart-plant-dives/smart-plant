const API_BASE = "http://localhost:8080/api/planta";

// SESSÃO DO USUÁRIO
const usuarioSessao = JSON.parse(
    localStorage.getItem("usuarioSessao") ||
    localStorage.getItem("perfil") ||
    "null"
);

let perfilExtra = JSON.parse(
    localStorage.getItem("perfilExtra") || "null"
) || {
    username: "@" + ((usuarioSessao && usuarioSessao.login) || "usuario"),
    instagram: "",
    facebook: "",
    sobre: "",
    foto: ""
};

let categorias = [];
let plantas = [];
let categoriaFiltroAtual = "todas";
let idPlantaEmEdicao = null;

// ELEMENTOS DA PÁGINA
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

// MOSTRAR PERFIL
function renderizarPerfil() {
    nomeUsuarioSpan.innerText =
        (usuarioSessao && usuarioSessao.nome) || "";

    usernameH2.innerText = perfilExtra.username || "";
    bioUsuarioP.innerText = perfilExtra.sobre || "";

    if (perfilExtra.foto) {
        fotoPerfilImg.src = perfilExtra.foto;
    }
}

renderizarPerfil();

// CARREGAR CATEGORIAS
async function carregarCategorias() {
    try {
        const resposta = await fetch(`${API_BASE}/categoria`);

        if (!resposta.ok) {
            throw new Error(
                `Erro ao carregar categorias: ${resposta.status}`
            );
        }

        categorias = await resposta.json();

        selectCategoria.innerHTML =
            '<option value="">Selecionar categoria</option>';

        selectEditCategoria.innerHTML =
            '<option value="">Selecione a categoria</option>';

        selectFiltro.innerHTML =
            '<option value="todas">Todas</option>';

        categorias.forEach(cat => {
            selectCategoria.innerHTML += `
                <option value="${cat.id}">
                    ${cat.nomeCategoria}
                </option>
            `;

            selectEditCategoria.innerHTML += `
                <option value="${cat.id}">
                    ${cat.nomeCategoria}
                </option>
            `;

            selectFiltro.innerHTML += `
                <option value="${cat.id}">
                    ${cat.nomeCategoria}
                </option>
            `;
        });

    } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);
    }
}

// CATEGORIA DA PLANTA
function nomeDaCategoria(planta) {
    return planta.nomeCategoria
        ? planta.nomeCategoria.nomeCategoria
        : "Sem categoria";
}

function idDaCategoria(planta) {
    return planta.nomeCategoria
        ? planta.nomeCategoria.id
        : "";
}

// MOSTRAR CARDS
function renderizarCards() {
    cardsContainer
        .querySelectorAll(".card:not(.add)")
        .forEach(card => card.remove());

    const plantasFiltradas =
        categoriaFiltroAtual === "todas"
            ? plantas
            : plantas.filter(planta =>
                String(idDaCategoria(planta)) ===
                String(categoriaFiltroAtual)
            );

    plantasFiltradas.forEach(planta => {
        const card = document.createElement("div");

        card.classList.add("card");
        card.dataset.id = planta.id;

        const imagem = document.createElement("img");
        imagem.src =
            planta.url ||
            "https://via.placeholder.com/300?text=Sem+imagem";
        imagem.alt = planta.nomePlanta || "Planta";

        const nome = document.createElement("h3");
        nome.textContent = planta.nomePlanta || "Sem nome";

        const categoria = document.createElement("p");
        categoria.textContent = nomeDaCategoria(planta);

        const especie = document.createElement("p");
        especie.textContent = planta.especie || "Espécie não informada";

        const acoes = document.createElement("div");
        acoes.classList.add("actions");

        const editar = document.createElement("button");
        editar.type = "button";
        editar.classList.add("edit");
        editar.textContent = "✏";
        editar.title = "Editar planta";

        editar.addEventListener("click", () => {
            abrirEdicao(planta.id);
        });

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.classList.add("delete");
        excluir.textContent = "🗑";
        excluir.title = "Excluir planta";

        excluir.addEventListener("click", () => {
            apagarPlanta(planta.id);
        });

        acoes.append(editar, excluir);
        card.append(imagem, nome, categoria, especie, acoes);

        cardsContainer.insertBefore(card, abrirModalBtn);
    });

    mensagemVazia.style.display =
        plantasFiltradas.length === 0 ? "block" : "none";
}

// CARREGAR PLANTAS DO USUÁRIO
async function carregarPlantas() {
    try {
        if (!usuarioSessao || !usuarioSessao.id) {
            plantas = [];
            renderizarCards();
            return;
        }

        const resposta = await fetch(
            `${API_BASE}/planta/usuario/${usuarioSessao.id}`
        );

        if (!resposta.ok) {
            throw new Error(
                `Erro ao carregar plantas: ${resposta.status}`
            );
        }

        plantas = await resposta.json();
        renderizarCards();

    } catch (erro) {
        console.error("Erro ao carregar plantas:", erro);
    }
}

// FILTRAR CATEGORIAS
selectFiltro.addEventListener("change", () => {
    categoriaFiltroAtual = selectFiltro.value;
    renderizarCards();
});

// ABRIR MODAL DE ADICIONAR PLANTA
abrirModalBtn.setAttribute("role", "button");
abrirModalBtn.setAttribute("tabindex", "0");

abrirModalBtn.addEventListener("click", () => {
    inputNomePlanta.value = "";
    inputEspecie.value = "";
    selectCategoria.value = "";
    inputUrlImagem.value = "";

    modalPostagem.classList.remove("hidden");
});

abrirModalBtn.addEventListener("keydown", evento => {
    if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        abrirModalBtn.click();
    }
});

// FECHAR MODAL
fecharModalBtn.addEventListener("click", () => {
    modalPostagem.classList.add("hidden");
});

// SALVAR NOVA PLANTA
btnSalvarPlanta.addEventListener("click", async () => {
    const nomePlanta = inputNomePlanta.value.trim();
    const especie = inputEspecie.value.trim();
    const categoriaId = selectCategoria.value;
    const url = inputUrlImagem.value.trim();

    if (!nomePlanta || !especie || !categoriaId) {
        alert("Preencha o nome, a espécie e a categoria.");
        return;
    }

    if (!usuarioSessao || !usuarioSessao.id) {
        alert(
            "Sua sessão não foi encontrada. Entre novamente na sua conta."
        );
        return;
    }

    const novaPlanta = {
        nomePlanta: nomePlanta,
        especie: especie,
        nomeCategoria: {
            id: Number(categoriaId)
        },
        url: url
    };

    try {
        const resposta = await fetch(
            `${API_BASE}/planta/usuario/${usuarioSessao.id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaPlanta)
            }
        );

        if (!resposta.ok) {
            throw new Error(
                `Não foi possível salvar a planta. HTTP ${resposta.status}`
            );
        }

        modalPostagem.classList.add("hidden");

        await carregarPlantas();

        alert("Planta cadastrada com sucesso!");

    } catch (erro) {
        console.error("Erro ao salvar planta:", erro);
        alert(erro.message);
    }
});

// ABRIR MODAL DE EDIÇÃO
function abrirEdicao(id) {
    const planta = plantas.find(
        item => String(item.id) === String(id)
    );

    if (!planta) return;

    idPlantaEmEdicao = id;

    inputEditNome.value = planta.nomePlanta || "";
    inputEditEspecie.value = planta.especie || "";
    selectEditCategoria.value = idDaCategoria(planta) || "";
    inputEditUrlImagem.value = planta.url || "";

    modalEditar.classList.remove("hidden");
}

// CANCELAR EDIÇÃO
cancelarEdicaoBtn.addEventListener("click", () => {
    modalEditar.classList.add("hidden");
    idPlantaEmEdicao = null;
});

// SALVAR EDIÇÃO
salvarEdicaoBtn.addEventListener("click", async () => {
    if (idPlantaEmEdicao === null) return;

    const plantaAtualizada = {
        nomePlanta: inputEditNome.value.trim(),
        especie: inputEditEspecie.value.trim(),
        nomeCategoria: selectEditCategoria.value
            ? { id: Number(selectEditCategoria.value) }
            : null,
        url: inputEditUrlImagem.value.trim()
    };

    try {
        const resposta = await fetch(
            `${API_BASE}/planta/${idPlantaEmEdicao}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(plantaAtualizada)
            }
        );

        if (!resposta.ok) {
            throw new Error(
                `Não foi possível atualizar a planta. HTTP ${resposta.status}`
            );
        }

        modalEditar.classList.add("hidden");
        idPlantaEmEdicao = null;

        await carregarPlantas();

        alert("Planta atualizada com sucesso!");

    } catch (erro) {
        console.error("Erro ao atualizar planta:", erro);
        alert(erro.message);
    }
});

// EXCLUIR PLANTA
async function apagarPlanta(id) {
    if (!confirm("Deseja realmente excluir esta planta?")) {
        return;
    }

    try {
        const resposta = await fetch(
            `${API_BASE}/planta/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!resposta.ok) {
            throw new Error(
                `Não foi possível excluir a planta. HTTP ${resposta.status}`
            );
        }

        await carregarPlantas();

    } catch (erro) {
        console.error("Erro ao excluir planta:", erro);
        alert(erro.message);
    }
}

// ABRIR EDIÇÃO DO PERFIL
btnAbrirPerfil.addEventListener("click", () => {
    inputNomePerfil.value =
        (usuarioSessao && usuarioSessao.nome) || "";

    inputInstaPerfil.value = perfilExtra.instagram || "";
    inputFacePerfil.value = perfilExtra.facebook || "";
    inputSobrePerfil.value = perfilExtra.sobre || "";

    if (perfilExtra.foto) {
        fotoPreview.src = perfilExtra.foto;
        fotoPreview.classList.remove("hidden");
        textoPlaceholder.style.display = "none";
    } else {
        fotoPreview.classList.add("hidden");
        textoPlaceholder.style.display = "block";
    }

    modalPerfil.classList.remove("hidden");
});

// CANCELAR PERFIL
cancelarPerfilBtn.addEventListener("click", () => {
    modalPerfil.classList.add("hidden");
});

// SALVAR PERFIL
salvarPerfilBtn.addEventListener("click", () => {
    if (usuarioSessao) {
        usuarioSessao.nome =
            inputNomePerfil.value.trim() || usuarioSessao.nome;

        localStorage.setItem(
            "usuarioSessao",
            JSON.stringify(usuarioSessao)
        );
    }

    perfilExtra.instagram = inputInstaPerfil.value.trim();
    perfilExtra.facebook = inputFacePerfil.value.trim();
    perfilExtra.sobre = inputSobrePerfil.value.trim();

    localStorage.setItem(
        "perfilExtra",
        JSON.stringify(perfilExtra)
    );

    renderizarPerfil();
    modalPerfil.classList.add("hidden");
});

// ABRIR SELETOR DE FOTO
btnTrocarFoto.addEventListener("click", () => {
    inputFotoPerfil.click();
});

// TROCAR FOTO DO PERFIL
inputFotoPerfil.addEventListener("change", () => {
    const arquivo = inputFotoPerfil.files[0];

    if (!arquivo) return;

    if (arquivo.size > 2 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 2 MB.");
        inputFotoPerfil.value = "";
        return;
    }

    const leitor = new FileReader();

    leitor.onload = evento => {
        perfilExtra.foto = evento.target.result;

        localStorage.setItem(
            "perfilExtra",
            JSON.stringify(perfilExtra)
        );

        fotoPreview.src = perfilExtra.foto;
        fotoPreview.classList.remove("hidden");
        textoPlaceholder.style.display = "none";

        renderizarPerfil();
    };

    leitor.readAsDataURL(arquivo);
});

// INICIALIZAR PÁGINA
(async function iniciar() {
    await carregarCategorias();
    await carregarPlantas();
})();