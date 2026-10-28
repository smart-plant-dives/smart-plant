
const API_BASE = "http://localhost:8080/api";

// =====================================================
// ELEMENTOS DO HTML
// =====================================================

// Perfil

const inputDescricaoPlanta =
    document.getElementById("descricaoPlanta");

const selectVisibilidadePlanta =
    document.getElementById("visibilidadePlanta");

    const botaoVisibilidade =
    document.getElementById("botaoVisibilidade");

const textoVisibilidade =
    document.getElementById("textoVisibilidade");

const campoVisibilidade =
    document.getElementById("visibilidadePlanta");

const ajudaVisibilidade =
    document.getElementById("ajudaVisibilidade");

const botaoEditarPerfil = document.querySelector(".edit-profile");
const modalPerfil = document.getElementById("modalPerfil");
const cancelarPerfil = document.getElementById("cancelarPerfil");
const salvarPerfil = document.getElementById("salvarPerfil");

const inputNome = document.getElementById("inputNome");
const inputUsername = document.getElementById("inputUsername");
const inputInsta = document.getElementById("inputInsta");
const inputFace = document.getElementById("inputFace");
const inputSobre = document.getElementById("inputSobre");

const fotoPerfil = document.getElementById("fotoPerfil");
const fotoPreview = document.getElementById("fotoPreview");
const textoPlaceholder = document.getElementById("textoPlaceholder");
const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const btnTrocarFoto = document.getElementById("btnTrocarFoto");

const nomeUsuario = document.getElementById("nomeUsuario");
const username = document.getElementById("username");
const bioUsuario = document.getElementById("bioUsuario");

// Adicionar planta
const abrirModal = document.getElementById("abrirModal");
const modalPostagem = document.getElementById("modalPostagem");
const fecharModal = document.getElementById("fecharModal");
const btnSalvarPlanta = document.getElementById("btnSalvarPlanta");

const inputNomePlanta = document.getElementById("nomePlanta");
const inputEspecie = document.getElementById("especie");
const selectCategoria = document.getElementById("categoria");
const inputUrlImagem = document.getElementById("urlImagem");
const previewImagem = document.getElementById("previewImagem");
const placeholderImagem = document.getElementById("placeholderImagem");

// Editar planta
const modalEditar = document.getElementById("modalEditar");
const cancelarEdicao = document.getElementById("cancelarEdicao");
const salvarEdicao = document.getElementById("salvarEdicao");

const inputEditNome = document.getElementById("editNome");
const inputEditEspecie = document.getElementById("editEspecie");
const selectEditCategoria = document.getElementById("editCategoria");
const inputEditUrlImagem = document.getElementById("editUrlImagem");

// Lista e filtro
const cardsContainer = document.getElementById("cards");
const mensagemVazia = document.getElementById("mensagemVazia");
const selectFiltro = document.getElementById("opcoes");

// =====================================================
// VARIÁVEIS
// =====================================================

let categorias = [];
let plantas = [];
let categoriaFiltroAtual = "todas";
let idPlantaEmEdicao = null;
let imagemSelecionada = "";

// =====================================================
// LOCALSTORAGE E PERFIL
// =====================================================

function lerJSON(chave, padrao = null) {
    try {
        const valor = localStorage.getItem(chave);
        return valor ? JSON.parse(valor) : padrao;
    } catch (erro) {
        console.error(`Erro ao ler ${chave}:`, erro);
        return padrao;
    }
}

let usuarioSessao =
    lerJSON("usuarioSessao") ||
    lerJSON("perfil") ||
    {};

const perfilAnterior =
    lerJSON("perfilExtra") ||
    lerJSON("perfil") ||
    {};

function normalizarUsername(valor) {
    return String(valor || "")
        .trim()
        .replace(/^@+/, "")
        .replace(/\s+/g, "")
        .slice(0, 30);
}

let perfilExtra = {
    username: normalizarUsername(
        perfilAnterior.username ||
        perfilAnterior.nomeUsuario ||
        usuarioSessao.login ||
        usuarioSessao.username ||
        ""
    ),
    instagram: perfilAnterior.instagram || "",
    facebook: perfilAnterior.facebook || "",
    sobre: perfilAnterior.sobre || "",
    foto: perfilAnterior.foto || ""
};

function salvarDadosPerfil() {
    localStorage.setItem(
        "perfilExtra",
        JSON.stringify(perfilExtra)
    );

    const perfilAntigo = lerJSON("perfil", {}) || {};

    localStorage.setItem(
        "perfil",
        JSON.stringify({
            ...perfilAntigo,
            nome: usuarioSessao.nome || "",
            username: perfilExtra.username,
            nomeUsuario: perfilExtra.username,
            instagram: perfilExtra.instagram,
            facebook: perfilExtra.facebook,
            sobre: perfilExtra.sobre,
            foto: perfilExtra.foto
        })
    );

    localStorage.setItem(
        "usuarioSessao",
        JSON.stringify(usuarioSessao)
    );
}

// =====================================================
// LINKS DAS REDES SOCIAIS
// =====================================================

function renderizarPerfil() {
    if (nomeUsuario) {
        nomeUsuario.textContent = usuarioSessao.nome || "";
    }

    if (username) {
        username.textContent = perfilExtra.username
            ? `@${perfilExtra.username}`
            : "@usuario";
    }

    if (bioUsuario) {
        bioUsuario.textContent = perfilExtra.sobre || "";
    }

    if (fotoPerfil) {
        if (perfilExtra.foto) {
            fotoPerfil.src = perfilExtra.foto;
            fotoPerfil.style.display = "block";
        } else {
            fotoPerfil.removeAttribute("src");
            fotoPerfil.style.display = "none";
        }
    }

    atualizarLinkSocial(
        document.getElementById("linkInstagram"),
        perfilExtra.instagram,
        "Instagram"
    );

    atualizarLinkSocial(
        document.getElementById("linkFacebook"),
        perfilExtra.facebook,
        "Facebook"
    );
}

// =====================================================
// MODAL DO PERFIL
// =====================================================

if (botaoEditarPerfil && modalPerfil) {
    botaoEditarPerfil.addEventListener("click", () => {
        inputNome.value = usuarioSessao.nome || "";
        inputUsername.value = perfilExtra.username || "";
        inputInsta.value = perfilExtra.instagram || "";
        inputFace.value = perfilExtra.facebook || "";
        inputSobre.value = perfilExtra.sobre || "";

        if (perfilExtra.foto) {
            fotoPreview.src = perfilExtra.foto;
            fotoPreview.classList.remove("hidden");
            textoPlaceholder.style.display = "none";
        } else {
            fotoPreview.removeAttribute("src");
            fotoPreview.classList.add("hidden");
            textoPlaceholder.style.display = "block";
        }

        modalPerfil.classList.remove("hidden");
    });
}

if (cancelarPerfil) {
    cancelarPerfil.addEventListener("click", () => {
        modalPerfil.classList.add("hidden");
    });
}

if (salvarPerfil) {
    salvarPerfil.addEventListener("click", () => {
        const nome = inputNome.value.trim();
        const novoUsername = normalizarUsername(
            inputUsername.value
        );

        if (!nome) {
            alert("Digite seu nome.");
            inputNome.focus();
            return;
        }

        if (!novoUsername) {
            alert("Digite um nome de usuário.");
            inputUsername.focus();
            return;
        }

        usuarioSessao = {
            ...usuarioSessao,
            nome
        };

        perfilExtra.username = novoUsername;
        perfilExtra.instagram = inputInsta.value.trim();
        perfilExtra.facebook = inputFace.value.trim();
        perfilExtra.sobre = inputSobre.value.trim();

        salvarDadosPerfil();
        renderizarPerfil();

        modalPerfil.classList.add("hidden");

        alert("Perfil atualizado com sucesso!");
    });
}

// =====================================================
// FOTO DO PERFIL
// =====================================================

if (btnTrocarFoto) {
    btnTrocarFoto.addEventListener("click", () => {
        inputFotoPerfil.click();
    });
}

if (inputFotoPerfil) {
    inputFotoPerfil.addEventListener("change", () => {
        const arquivo = inputFotoPerfil.files[0];

        if (!arquivo) return;

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {
            alert("Selecione uma imagem JPG, PNG ou WEBP.");
            inputFotoPerfil.value = "";
            return;
        }

        if (arquivo.size > 2 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 2 MB.");
            inputFotoPerfil.value = "";
            return;
        }

        const leitor = new FileReader();

        leitor.onload = evento => {
            perfilExtra.foto = evento.target.result;

            salvarDadosPerfil();
            renderizarPerfil();

            fotoPreview.src = perfilExtra.foto;
            fotoPreview.classList.remove("hidden");
            textoPlaceholder.style.display = "none";
        };

        leitor.onerror = () => {
            alert("Não foi possível carregar a foto.");
        };

        leitor.readAsDataURL(arquivo);
    });
}


// =====================================================
// MODAL DE ADICIONAR PLANTA
// =====================================================

if (abrirModal && modalPostagem) {
    abrirModal.addEventListener("click", () => {
        if (inputNomePlanta) inputNomePlanta.value = "";
        if (inputEspecie) inputEspecie.value = "";
        if (inputUrlImagem) inputUrlImagem.value = "";

        if (inputDescricaoPlanta) {
            inputDescricaoPlanta.value = "";
        }

        if (selectVisibilidadePlanta) {
            selectVisibilidadePlanta.value = "PUBLICA";
        }

        imagemSelecionada = "";

        if (previewImagem) {
            previewImagem.removeAttribute("src");
            previewImagem.style.display = "none";
        }

        if (placeholderImagem) {
            placeholderImagem.style.display = "flex";
        }

        if (botaoVisibilidade) {
            botaoVisibilidade.classList.add("publica");
            botaoVisibilidade.classList.remove("privada");
            botaoVisibilidade.setAttribute("aria-pressed", "false");
        }

        if (textoVisibilidade) {
            textoVisibilidade.textContent = "Pública";
        }

        if (ajudaVisibilidade) {
            ajudaVisibilidade.textContent =
                "Sua planta poderá aparecer na galeria.";
        }

        modalPostagem.classList.remove("hidden");
    });

    abrirModal.setAttribute("role", "button");
    abrirModal.setAttribute("tabindex", "0");

    abrirModal.addEventListener("keydown", evento => {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirModal.click();
        }
    });
}

if (fecharModal && modalPostagem) {
    fecharModal.addEventListener("click", () => {
        modalPostagem.classList.add("hidden");
    });
}

// =====================================================
// PRÉ-VISUALIZAÇÃO DA FOTO DA PLANTA
// =====================================================

if (inputUrlImagem) {
    inputUrlImagem.addEventListener("change", () => {
        const arquivo = inputUrlImagem.files[0];

        if (!arquivo) return;

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {
            alert("Selecione uma imagem JPG, PNG ou WEBP.");
            inputUrlImagem.value = "";
            return;
        }

        if (arquivo.size > 2 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 2 MB.");
            inputUrlImagem.value = "";
            return;
        }

        const leitor = new FileReader();

        leitor.onload = evento => {
            imagemSelecionada = evento.target.result;
            previewImagem.src = imagemSelecionada;
            previewImagem.style.display = "block";
            placeholderImagem.style.display = "none";
        };

        leitor.onerror = () => {
            alert("Não foi possível carregar a imagem.");
        };

        leitor.readAsDataURL(arquivo);
    });
}

// =====================================================
// CARREGAR CATEGORIAS
// =====================================================

async function carregarCategorias() {
    try {
        const resposta = await fetch(`${API_BASE}/categoria`);

        if (!resposta.ok) {
            throw new Error(
                `Erro ao carregar categorias: HTTP ${resposta.status}`
            );
        }

        const dados = await resposta.json();

        categorias = Array.isArray(dados)
            ? dados
            : Array.isArray(dados.content)
                ? dados.content
                : [];

        selectCategoria.innerHTML =
            '<option value="">Selecionar categoria</option>';

        selectEditCategoria.innerHTML =
            '<option value="">Selecione a categoria</option>';

        selectFiltro.innerHTML =
            '<option value="todas">Todas</option>';

        categorias.forEach(cat => {
            const id = cat.idCategoria ?? cat.id_categoria ?? cat.id;
            const nome = cat.nomeCategoria ??
                cat.nome ??
                cat.descricao ??
                "";

            const opcaoNova = new Option(nome, id);
            const opcaoEdicao = new Option(nome, id);
            const opcaoFiltro = new Option(nome, id);

            selectCategoria.add(opcaoNova);
            selectEditCategoria.add(opcaoEdicao);
            selectFiltro.add(opcaoFiltro);
        });

    } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);
    }
}

// =====================================================
// FUNÇÕES AUXILIARES DAS PLANTAS
// =====================================================

function nomeDaCategoria(planta) {
    return planta.nomeCategoria?.nomeCategoria ||
        "Sem categoria";
}

function idDaCategoria(planta) {
    return planta.nomeCategoria?.id ?? "";
}

// =====================================================
// CARREGAR PLANTAS DO USUÁRIO
// =====================================================

async function carregarPlantas() {
    if (!usuarioSessao || !usuarioSessao.id) {
        plantas = [];
        renderizarCards();

        console.warn(
            "ID do usuário não encontrado. Entre novamente na sua conta."
        );

        return;
    }

    try {
        const resposta = await fetch(
            `${API_BASE}/planta/usuario/${usuarioSessao.id}`
        );

        if (!resposta.ok) {
            throw new Error(
                `Erro ao carregar plantas: HTTP ${resposta.status}`
            );
        }

        plantas = await resposta.json();
        renderizarCards();

    } catch (erro) {
        console.error("Erro ao carregar plantas:", erro);
    }
}

// =====================================================
// RENDERIZAR CARDS
// =====================================================

function renderizarCards() {
    if (!cardsContainer) return;

    cardsContainer
        .querySelectorAll(".card:not(.add)")
        .forEach(card => card.remove());

    const filtradas =
        categoriaFiltroAtual === "todas"
            ? plantas
            : plantas.filter(planta =>
                String(idDaCategoria(planta)) ===
                String(categoriaFiltroAtual)
            );

    filtradas.forEach(planta => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.id = planta.id;

        const imagem = document.createElement("img");
        imagem.src = planta.url ||
            "https://via.placeholder.com/300?text=Sem+imagem";
        imagem.alt = planta.nomePlanta || "Planta";

        const nome = document.createElement("h3");
        nome.textContent = planta.nomePlanta || "Sem nome";

        const categoria = document.createElement("p");
        categoria.textContent = nomeDaCategoria(planta);

        const especie = document.createElement("p");
        especie.textContent =
            planta.especie || "Espécie não informada";

        const acoes = document.createElement("div");
        acoes.className = "actions";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "edit";
        editar.textContent = "✏";
        editar.title = "Editar planta";

        editar.addEventListener("click", () => {
            abrirEdicao(planta.id);
        });

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.className = "delete";
        excluir.textContent = "🗑";
        excluir.title = "Excluir planta";

        excluir.addEventListener("click", () => {
            apagarPlanta(planta.id);
        });

        acoes.append(editar, excluir);
        card.append(imagem, nome, categoria, especie, acoes);

        if (abrirModal && abrirModal.parentNode === cardsContainer) {
            cardsContainer.insertBefore(card, abrirModal);
        } else {
            cardsContainer.appendChild(card);
        }
    });

    if (mensagemVazia) {
        mensagemVazia.style.display =
            filtradas.length === 0 ? "block" : "none";
    }
}

// =====================================================
// FILTRO DE CATEGORIAS
// =====================================================

if (selectFiltro) {
    selectFiltro.addEventListener("change", () => {
        categoriaFiltroAtual = selectFiltro.value;
        renderizarCards();
    });
}

// =====================================================
// SALVAR NOVA PLANTA
// =====================================================


if (btnSalvarPlanta) {
    btnSalvarPlanta.addEventListener("click", async () => {
        const nome = inputNomePlanta?.value.trim() || "";
        const especie = inputEspecie?.value.trim() || "";
        const descricao = inputDescricaoPlanta?.value.trim() || "";
        const visibilidade =
            selectVisibilidadePlanta?.value || "PUBLICA";

        if (!nome || !especie) {
            alert("Preencha o nome e a espécie da planta.");
            return;
        }

        if (!usuarioSessao || !usuarioSessao.id) {
            alert("Entre novamente na sua conta para cadastrar plantas.");
            return;
        }

        const novaPlanta = {
            nomePlanta: nome,
            especie: especie,
            descricao: descricao,
            visibilidade: visibilidade,
            url: imagemSelecionada || ""
        };

        // Continue aqui com o fetch para a API.
    });
}
if (btnSalvarPlanta) {
    btnSalvarPlanta.addEventListener("click", async () => {
        const nome = inputNomePlanta.value.trim();
        const especie = inputEspecie.value.trim();
        const categoriaId = selectCategoria.value;
        const descricao = inputDescricaoPlanta?.value.trim() || "";
        const visibilidade = selectVisibilidadePlanta?.value || "PUBLICA";

        if (!nome || !especie ) {
            alert("Preencha o nome, a espécie e a categoria.");
            return;
        }

        if (!usuarioSessao || !usuarioSessao.id) {
            alert("Entre novamente na sua conta para cadastrar plantas.");
            return;
        }

        if (campoVisibilidade) {
    campoVisibilidade.value = "PUBLICA";
}

if (textoVisibilidade) {
    textoVisibilidade.textContent = "Pública";
}

if (botaoVisibilidade) {
    botaoVisibilidade.classList.add("publica");
    botaoVisibilidade.classList.remove("privada");
    botaoVisibilidade.setAttribute("aria-pressed", "false");
}

if (ajudaVisibilidade) {
    ajudaVisibilidade.textContent =
        "Sua planta poderá aparecer na galeria.";
}

        const novaPlanta = {
            nomePlanta: nome,
            especie,
            nomeCategoria: {
                id: Number(categoriaId)
            },
            url: imagemSelecionada || ""
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
                    `Erro ao salvar planta: HTTP ${resposta.status}`
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


}

// =====================================================
// ABRIR MODAL DE EDIÇÃO DA PLANTA
// =====================================================

function abrirEdicao(id) {
    const planta = plantas.find(
        item => String(item.id) === String(id)
    );

    if (!planta) return;

    idPlantaEmEdicao = id;

    inputEditNome.value = planta.nomePlanta || "";
    inputEditEspecie.value = planta.especie || "";
    selectEditCategoria.value = idDaCategoria(planta);
    inputEditUrlImagem.value = planta.url || "";

    modalEditar.classList.remove("hidden");
}

// =====================================================
// CANCELAR EDIÇÃO
// =====================================================

if (cancelarEdicao) {
    cancelarEdicao.addEventListener("click", () => {
        modalEditar.classList.add("hidden");
        idPlantaEmEdicao = null;
    });
}

// =====================================================
// SALVAR EDIÇÃO
// =====================================================

if (salvarEdicao) {
    salvarEdicao.addEventListener("click", async () => {
        if (idPlantaEmEdicao === null) return;

        const nome = inputEditNome.value.trim();
        const especie = inputEditEspecie.value.trim();
        const categoriaId = selectEditCategoria.value;

        if (!nome || !especie || !categoriaId) {
            alert("Preencha o nome, a espécie e a categoria.");
            return;
        }

        const plantaAtualizada = {
            nomePlanta: nome,
            especie,
            nomeCategoria: {
                id: Number(categoriaId)
            },
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
                    `Erro ao atualizar planta: HTTP ${resposta.status}`
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
}

// =====================================================
// EXCLUIR PLANTA
// =====================================================

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
                `Erro ao excluir planta: HTTP ${resposta.status}`
            );
        }

        await carregarPlantas();

        alert("Planta excluída com sucesso!");

    } catch (erro) {
        console.error("Erro ao excluir planta:", erro);
        alert(erro.message);
    }
}

// =====================================================
// CATEGORIAS COM AUTOCOMPLETE
// =====================================================

const campoCategoria = document.getElementById("categoria");
const sugestoesCategorias = document.getElementById("sugestoesCategorias");
const erroCategoria = document.getElementById("erroCategoria");

const API_CATEGORIAS_URL = "http://localhost:8080/api/categoria";

let categoriasDisponiveis = [];
let categoriaSelecionada = null;

function obterNomeCategoria(categoria) {
    if (typeof categoria === "string") {
        return categoria;
    }

    return (
        categoria.nomeCategoria ??
        categoria.nome ??
        categoria.descricao ??
        categoria.nome_categoria ??
        ""
    );
}

function obterIdCategoria(categoria) {
    if (typeof categoria === "string") {
        return null;
    }

    return (
        categoria.idCategoria ??
        categoria.id_categoria ??
        categoria.id ??
        null
    );
}

// Carrega as categorias disponíveis para o autocomplete.
// Usa a lista carregada anteriormente quando possível.
async function carregarCategoriasAutocomplete() {
    try {
        const resposta = await fetch(API_CATEGORIAS_URL);

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível carregar as categorias."
            );
        }

        const dados = await resposta.json();

        categoriasDisponiveis = Array.isArray(dados)
            ? dados
            : Array.isArray(dados.content)
                ? dados.content
                : [];

    } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);

        categoriasDisponiveis = [];

        if (sugestoesCategorias) {
            sugestoesCategorias.innerHTML = `
                <div class="sugestao-categoria">
                    Não foi possível carregar as categorias.
                </div>
            `;
        }
    }
}

function mostrarSugestoesCategorias() {
    if (!campoCategoria || !sugestoesCategorias) return;

    const texto = campoCategoria.value.trim().toLowerCase();

    categoriaSelecionada = null;
    campoCategoria.removeAttribute("data-categoria-selecionada");

    if (erroCategoria) {
        erroCategoria.classList.remove("visivel");
    }

    if (!texto) {
        sugestoesCategorias.innerHTML = "";
        sugestoesCategorias.style.display = "none";
        return;
    }

    const resultados = categoriasDisponiveis.filter(categoria =>
        obterNomeCategoria(categoria).toLowerCase().includes(texto)
    );

    sugestoesCategorias.innerHTML = "";

    if (resultados.length === 0) {
        sugestoesCategorias.innerHTML = `
            <div class="sugestao-categoria">
                Nenhuma categoria encontrada.
            </div>
        `;
        sugestoesCategorias.style.display = "block";
        return;
    }

    resultados.forEach(categoria => {
        const nome = obterNomeCategoria(categoria);

        const opcao = document.createElement("div");
        opcao.className = "sugestao-categoria";
        opcao.textContent = nome;
        opcao.tabIndex = 0;
        opcao.setAttribute("role", "option");

        function selecionar() {
            campoCategoria.value = nome;
            categoriaSelecionada = categoria;

            sugestoesCategorias.innerHTML = "";
            sugestoesCategorias.style.display = "none";

            if (erroCategoria) {
                erroCategoria.classList.remove("visivel");
            }
        }

        opcao.addEventListener("click", selecionar);

        opcao.addEventListener("keydown", evento => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                selecionar();
            }
        });

        sugestoesCategorias.appendChild(opcao);
    });

    sugestoesCategorias.style.display = "block";
}

if (campoCategoria && sugestoesCategorias) {
    campoCategoria.addEventListener(
        "input",
        mostrarSugestoesCategorias
    );

    document.addEventListener("click", evento => {
        if (
            !campoCategoria.contains(evento.target) &&
            !sugestoesCategorias.contains(evento.target)
        ) {
            sugestoesCategorias.style.display = "none";
        }
    });
}

function validarCategoriaSelecionada() {
    if (!categoriaSelecionada) {
        if (erroCategoria) {
            erroCategoria.classList.add("visivel");
        }

        if (campoCategoria) {
            campoCategoria.focus();
        }

        return false;
    }

    return true;
}

function obterCategoriaSelecionada() {
    if (!validarCategoriaSelecionada()) {
        return null;
    }

    return categoriaSelecionada;
}

// =====================================================
// INICIALIZAR
// =====================================================

async function iniciarPagina() {
    renderizarPerfil();

    await carregarCategorias();
    await carregarCategoriasAutocomplete();
    await carregarPlantas();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarPagina
    );
} else {
    iniciarPagina();
}


document.addEventListener("DOMContentLoaded", function () {
    const dadosSalvos = localStorage.getItem("smartPlantPerfil");

    if (!dadosSalvos) {
        return;
    }

    const perfil = JSON.parse(dadosSalvos);

    // Exibe nome, username e descrição
    document.getElementById("nomeUsuario").textContent =
        perfil.nome || "";

    document.getElementById("username").textContent =
        perfil.username || "";

    document.getElementById("bioUsuario").textContent =
        perfil.sobre || "";

    // Exibe a foto do perfil
    const fotoPerfil = document.getElementById("fotoPerfil");

    if (perfil.foto) {
        fotoPerfil.src = perfil.foto;
    } else {
        fotoPerfil.src =
            "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }

    // Configura os links das redes sociais
    function configurarRede(id, endereco) {
        const link = document.getElementById(id);

        if (!link) return;

        if (endereco && endereco.trim()) {
            let url = endereco.trim();

            if (!/^https?:\/\//i.test(url)) {
                url = "https://" + url;
            }

            try {
                const urlValidada = new URL(url);

                if (!["https:", "http:"].includes(urlValidada.protocol)) {
                    throw new Error("URL inválida");
                }

                link.href = urlValidada.href;
                link.style.display = "inline-flex";
            } catch (erro) {
                link.style.display = "none";
            }
        } else {
            link.style.display = "none";
        }
    }

    configurarRede("linkInstagram", perfil.instagram);
    configurarRede("linkFacebook", perfil.facebook);
});

if (
    botaoVisibilidade &&
    textoVisibilidade &&
    campoVisibilidade &&
    ajudaVisibilidade
) {
    botaoVisibilidade.addEventListener("click", () => {
        const agoraPublica = campoVisibilidade.value !== "PUBLICA";

        campoVisibilidade.value = agoraPublica ? "PUBLICA" : "PRIVADA";

        textoVisibilidade.textContent = agoraPublica
            ? "Pública"
            : "Privada";

        ajudaVisibilidade.textContent = agoraPublica
            ? "Sua planta poderá aparecer na galeria."
            : "Sua planta ficará visível somente para você.";

        botaoVisibilidade.classList.toggle("publica", agoraPublica);
        botaoVisibilidade.classList.toggle("privada", !agoraPublica);

        botaoVisibilidade.setAttribute(
            "aria-pressed",
            String(!agoraPublica)
        );
    });
}


