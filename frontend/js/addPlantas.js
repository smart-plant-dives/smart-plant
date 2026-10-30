
const API_BASE = "http://localhost:8080/api";

// =====================================================
// ELEMENTOS DO HTML
// =====================================================

// Perfil
const botaoEditarPerfil = document.querySelector(".edit-profile");
const modalPerfil = document.getElementById("modalPerfil");
const cancelarPerfil = document.getElementById("cancelarPerfil");
const salvarPerfil = document.getElementById("salvarPerfil");

const inputNome = document.getElementById("inputNome");
const inputUsername = document.getElementById("inputUsername");
const inputSobre = document.getElementById("inputSobre");
const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const fotoPerfil = document.getElementById("fotoPerfil");
const fotoPreview = document.getElementById("fotoPreview");
const textoPlaceholder = document.getElementById("textoPlaceholder");
const btnTrocarFoto = document.getElementById("btnTrocarFoto");

const nomeUsuario = document.getElementById("nomeUsuario");
const username = document.getElementById("username");
const bioUsuario = document.getElementById("bioUsuario");

// Cadastro de planta
const abrirModal = document.getElementById("abrirModal");
const modalPostagem = document.getElementById("modalPostagem");
const fecharModal = document.getElementById("fecharModal");
const btnSalvarPlanta = document.getElementById("btnSalvarPlanta");

const inputNomePlanta = document.getElementById("nomePlanta");

// CORREÇÃO: o campo de espécie no HTML chama-se categoriaPlanta.
const inputEspecie = document.getElementById("categoriaPlanta");

const inputDescricaoPlanta = document.getElementById("descricaoPlanta");
const inputUrlImagem = document.getElementById("urlImagem");
const previewImagem = document.getElementById("previewImagem");
const placeholderImagem = document.getElementById("placeholderImagem");

const campoVisibilidade = document.getElementById("visibilidadePlanta");
const botaoVisibilidade = document.getElementById("botaoVisibilidade");
const textoVisibilidade = document.getElementById("textoVisibilidade");
const ajudaVisibilidade = document.getElementById("ajudaVisibilidade");

// Lista e filtro
const cardsContainer = document.getElementById("cards");
const mensagemVazia = document.getElementById("mensagemVazia");
const selectFiltro = document.getElementById("opcoes");

// Alertas personalizados
const modalAlerta = document.getElementById("modalAlerta");
const tituloAlerta = document.getElementById("tituloAlerta");
const mensagemAlerta = document.getElementById("mensagemAlerta");
const btnFecharAlerta = document.getElementById("btnFecharAlerta");

// =====================================================
// VARIÁVEIS
// =====================================================

let plantas = [];
let categoriaFiltroAtual = "todas";
let imagemSelecionada = "";
let alertaAberto = false;
let filaAlertas = [];
let focoAnteriorAlerta = null;

// =====================================================
// ALERTAS PERSONALIZADOS
// =====================================================

function mostrarAlerta(texto, titulo = "Atenção") {
    return new Promise(resolve => {
        filaAlertas.push({
            texto: String(texto),
            titulo,
            resolve
        });

        processarFilaAlertas();
    });
}

function processarFilaAlertas() {
    if (alertaAberto || filaAlertas.length === 0) {
        return;
    }

    if (!modalAlerta || !btnFecharAlerta) {
        const alerta = filaAlertas.shift();

        // Fallback se o modal não existir no HTML.
        window.alertOriginal?.(alerta.texto);
        alerta.resolve();
        processarFilaAlertas();
        return;
    }

    alertaAberto = true;

    const alerta = filaAlertas.shift();
    focoAnteriorAlerta = document.activeElement;

    tituloAlerta.textContent = alerta.titulo;
    mensagemAlerta.textContent = alerta.texto;

    modalAlerta.hidden = false;
    btnFecharAlerta.focus();

    modalAlerta.dataset.alertaAtual = "aberto";
    modalAlerta._resolverAtual = alerta.resolve;
}

function fecharAlerta() {
    if (!alertaAberto) return;

    modalAlerta.hidden = true;
    alertaAberto = false;

    const resolver = modalAlerta._resolverAtual;
    modalAlerta._resolverAtual = null;

    if (typeof resolver === "function") {
        resolver();
    }

    if (
        focoAnteriorAlerta &&
        typeof focoAnteriorAlerta.focus === "function"
    ) {
        focoAnteriorAlerta.focus();
    }

    processarFilaAlertas();
}

if (btnFecharAlerta) {
    btnFecharAlerta.addEventListener("click", fecharAlerta);
}

if (modalAlerta) {
    modalAlerta.addEventListener("click", evento => {
        if (evento.target === modalAlerta) {
            fecharAlerta();
        }
    });
}

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" && alertaAberto) {
        fecharAlerta();
    }
});

// Substitui alert() para que as mensagens existentes usem o modal.
if (!window.alertOriginal) {
    window.alertOriginal = window.alert.bind(window);
}

window.alert = texto => mostrarAlerta(texto);

// =====================================================
// LEITURA E ARMAZENAMENTO DO PERFIL
// =====================================================

function lerJSON(chave, padrao = {}) {
    try {
        const valor = localStorage.getItem(chave);
        return valor ? JSON.parse(valor) : padrao;
    } catch (erro) {
        console.error(`Erro ao ler ${chave}:`, erro);
        return padrao;
    }
}

let usuarioSessao =
    lerJSON("usuarioSessao", null) ||
    lerJSON("perfil", {});

const perfilAnterior =
    lerJSON("perfilExtra", null) ||
    lerJSON("smartPlantPerfil", null) ||
    lerJSON("perfil", {});

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
        usuarioSessao.username ||
        usuarioSessao.login ||
        ""
    ),
    sobre: perfilAnterior.sobre || "",
    instagram: perfilAnterior.instagram || "",
    facebook: perfilAnterior.facebook || "",
    foto: perfilAnterior.foto || ""
};

function salvarDadosPerfil() {
    localStorage.setItem(
        "perfilExtra",
        JSON.stringify(perfilExtra)
    );

    localStorage.setItem(
        "usuarioSessao",
        JSON.stringify(usuarioSessao)
    );

    localStorage.setItem(
        "perfil",
        JSON.stringify({
            ...lerJSON("perfil"),
            ...usuarioSessao,
            username: perfilExtra.username,
            nomeUsuario: perfilExtra.username,
            sobre: perfilExtra.sobre,
            instagram: perfilExtra.instagram,
            facebook: perfilExtra.facebook,
            foto: perfilExtra.foto
        })
    );
}

function renderizarPerfil() {
    if (nomeUsuario) {
        nomeUsuario.textContent = usuarioSessao.nome || "";
    }

    if (username) {
        username.textContent = perfilExtra.username
            ? `@${perfilExtra.username}`
            : "";
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
}

// =====================================================
// EDITAR PERFIL
// =====================================================

if (botaoEditarPerfil && modalPerfil) {
    botaoEditarPerfil.addEventListener("click", () => {
        inputNome.value = usuarioSessao.nome || "";
        inputUsername.value = perfilExtra.username || "";
        inputSobre.value = perfilExtra.sobre || "";

        if (fotoPreview && textoPlaceholder) {
            if (perfilExtra.foto) {
                fotoPreview.src = perfilExtra.foto;
                fotoPreview.classList.remove("hidden");
                textoPlaceholder.style.display = "none";
            } else {
                fotoPreview.removeAttribute("src");
                fotoPreview.classList.add("hidden");
                textoPlaceholder.style.display = "block";
            }
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
    salvarPerfil.addEventListener("click", async () => {
        const nome = inputNome.value.trim();
        const novoUsername = normalizarUsername(inputUsername.value);

        if (!nome) {
            await mostrarAlerta("Digite seu nome.");
            inputNome.focus();
            return;
        }

        if (!novoUsername) {
            await mostrarAlerta("Digite um nome de usuário.");
            inputUsername.focus();
            return;
        }

        usuarioSessao = {
            ...usuarioSessao,
            nome
        };

        perfilExtra.username = novoUsername;
        perfilExtra.sobre = inputSobre.value.trim();

        salvarDadosPerfil();
        renderizarPerfil();

        modalPerfil.classList.add("hidden");

        await mostrarAlerta("Perfil atualizado com sucesso!", "Sucesso");
    });
}

// =====================================================
// FOTO DO PERFIL
// =====================================================

if (btnTrocarFoto && inputFotoPerfil) {
    btnTrocarFoto.addEventListener("click", () => {
        inputFotoPerfil.click();
    });
}

if (inputFotoPerfil) {
    inputFotoPerfil.addEventListener("change", async () => {
        const arquivo = inputFotoPerfil.files?.[0];

        if (!arquivo) return;

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {
            await mostrarAlerta("Selecione uma imagem JPG, PNG ou WEBP.");
            inputFotoPerfil.value = "";
            return;
        }

        if (arquivo.size > 2 * 1024 * 1024) {
            await mostrarAlerta("A imagem deve ter no máximo 2 MB.");
            inputFotoPerfil.value = "";
            return;
        }

        const leitor = new FileReader();

        leitor.onload = async evento => {
            perfilExtra.foto = evento.target.result;

            salvarDadosPerfil();
            renderizarPerfil();

            if (fotoPreview) {
                fotoPreview.src = perfilExtra.foto;
                fotoPreview.classList.remove("hidden");
            }

            if (textoPlaceholder) {
                textoPlaceholder.style.display = "none";
            }
        };

        leitor.onerror = async () => {
            await mostrarAlerta("Não foi possível carregar a foto.");
        };

        leitor.readAsDataURL(arquivo);
    });
}

// =====================================================
// ABRIR E FECHAR MODAL DE PLANTA
// =====================================================

function resetarFormularioPlanta() {
    if (inputNomePlanta) inputNomePlanta.value = "";
    if (inputEspecie) inputEspecie.value = "";
    if (inputDescricaoPlanta) inputDescricaoPlanta.value = "";
    if (inputUrlImagem) inputUrlImagem.value = "";

    if (campoVisibilidade) {
        campoVisibilidade.value = "PUBLICA";
    }

    imagemSelecionada = "";

    if (previewImagem) {
        previewImagem.removeAttribute("src");
        previewImagem.style.display = "none";
    }

    if (placeholderImagem) {
        placeholderImagem.style.display = "flex";
    }

    atualizarVisibilidade();
}

function atualizarVisibilidade() {
    const publica = !campoVisibilidade ||
        campoVisibilidade.value !== "PRIVADA";

    if (campoVisibilidade) {
        campoVisibilidade.value = publica ? "PUBLICA" : "PRIVADA";
    }

    if (textoVisibilidade) {
        textoVisibilidade.textContent = publica ? "Pública" : "Privada";
    }

    if (ajudaVisibilidade) {
        ajudaVisibilidade.textContent = publica
            ? "Sua planta poderá aparecer na galeria."
            : "Sua planta ficará visível somente para você.";
    }

    if (botaoVisibilidade) {
        botaoVisibilidade.classList.toggle("publica", publica);
        botaoVisibilidade.classList.toggle("privada", !publica);

        botaoVisibilidade.setAttribute(
            "aria-pressed",
            String(!publica)
        );
    }
}

if (abrirModal && modalPostagem) {
    abrirModal.addEventListener("click", () => {
        resetarFormularioPlanta();
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

if (botaoVisibilidade) {
    botaoVisibilidade.addEventListener("click", () => {
        campoVisibilidade.value =
            campoVisibilidade.value === "PUBLICA"
                ? "PRIVADA"
                : "PUBLICA";

        atualizarVisibilidade();
    });
}

// =====================================================
// PRÉ-VISUALIZAÇÃO DA FOTO DA PLANTA
// =====================================================

if (inputUrlImagem) {
    inputUrlImagem.addEventListener("change", async () => {
        const arquivo = inputUrlImagem.files?.[0];

        if (!arquivo) return;

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {
            await mostrarAlerta("Selecione uma imagem JPG, PNG ou WEBP.");
            inputUrlImagem.value = "";
            return;
        }

        if (arquivo.size > 2 * 1024 * 1024) {
            await mostrarAlerta("A imagem deve ter no máximo 2 MB.");
            inputUrlImagem.value = "";
            return;
        }

        const leitor = new FileReader();

        leitor.onload = evento => {
            imagemSelecionada = evento.target.result;

            if (previewImagem) {
                previewImagem.src = imagemSelecionada;
                previewImagem.style.display = "block";
            }

            if (placeholderImagem) {
                placeholderImagem.style.display = "none";
            }
        };

        leitor.onerror = async () => {
            await mostrarAlerta("Não foi possível carregar a imagem.");
        };

        leitor.readAsDataURL(arquivo);
    });
}

// =====================================================
// CARREGAR PLANTAS
// =====================================================

function obterIdUsuario() {
    return usuarioSessao.id ??
        usuarioSessao.idUsuario ??
        usuarioSessao.id_usuario ??
        null;
}

function nomeDaCategoria(planta) {
    if (typeof planta.nomeCategoria === "string") {
        return planta.nomeCategoria;
    }

    return planta.nomeCategoria?.nomeCategoria ||
        planta.categoria?.nome ||
        "Sem categoria";
}

function idDaCategoria(planta) {
    return planta.nomeCategoria?.idCategoria ??
        planta.nomeCategoria?.id ??
        planta.categoria?.id ??
        "";
}

async function carregarPlantas() {
    const idUsuario = obterIdUsuario();

    if (!idUsuario) {
        plantas = [];
        renderizarCards();

        console.warn("ID do usuário não encontrado na sessão.");
        return;
    }

    try {
        const resposta = await fetch(
            `${API_BASE}/planta/usuario/${idUsuario}`
        );

        if (!resposta.ok) {
            throw new Error(
                `Não foi possível carregar as plantas (HTTP ${resposta.status}).`
            );
        }

        const dados = await resposta.json();

        plantas = Array.isArray(dados) ? dados : [];
        renderizarCards();
    } catch (erro) {
        console.error("Erro ao carregar plantas:", erro);
        await mostrarAlerta(erro.message);
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

    const filtradas = categoriaFiltroAtual === "todas"
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
            "https://placehold.co/300x200?text=Planta";
        imagem.alt = planta.nomePlanta || "Planta";

        const nome = document.createElement("h3");
        nome.textContent = planta.nomePlanta || "Sem nome";

        const categoria = document.createElement("p");
        categoria.textContent = nomeDaCategoria(planta);

        const especie = document.createElement("p");
        especie.textContent = planta.especie || "Espécie não informada";

        const acoes = document.createElement("div");
        acoes.className = "actions";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "edit";
        editar.textContent = "✏";
        editar.title = "Editar planta";

        editar.addEventListener("click", async () => {
            await mostrarAlerta(
                "Para editar uma planta, é necessário configurar os campos de edição no HTML e confirmar o formato aceito pela API."
            );
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
// FILTRO
// =====================================================

if (selectFiltro) {
    selectFiltro.addEventListener("change", () => {
        categoriaFiltroAtual = selectFiltro.value;
        renderizarCards();
    });
}

// =====================================================
// SALVAR NOVA PLANTA — UM ÚNICO EVENTO
// =====================================================

if (btnSalvarPlanta) {
    btnSalvarPlanta.addEventListener("click", async evento => {
        evento.preventDefault();

        // Lê os valores diretamente dos campos corretos.
        const nome = (inputNomePlanta?.value || "").trim();
        const especie = (inputEspecie?.value || "").trim();
        const descricao = (inputDescricaoPlanta?.value || "").trim();
        const visibilidade = campoVisibilidade?.value || "PUBLICA";

        // VALIDAÇÃO CORRIGIDA
        if (!nome || !especie) {
            await mostrarAlerta(
                "Preencha o nome e a espécie da planta."
            );

            if (!nome) {
                inputNomePlanta?.focus();
            } else {
                inputEspecie?.focus();
            }

            return;
        }

        const idUsuario = obterIdUsuario();

        if (!idUsuario) {
            await mostrarAlerta(
                "Entre novamente na sua conta para cadastrar plantas."
            );
            return;
        }

        const novaPlanta = {
            nomePlanta: nome,
            especie: especie,
            descricao: descricao,
            visibilidade: visibilidade,
            url: imagemSelecionada || ""
        };

        btnSalvarPlanta.disabled = true;

        try {
            const resposta = await fetch(
                `${API_BASE}/planta/usuario/${idUsuario}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(novaPlanta)
                }
            );

            if (!resposta.ok) {
                const detalhe = await resposta.text();

                throw new Error(
                    detalhe ||
                    `Não foi possível cadastrar a planta (HTTP ${resposta.status}).`
                );
            }

            modalPostagem.classList.add("hidden");

            await carregarPlantas();

            await mostrarAlerta(
                "Planta cadastrada com sucesso!",
                "Sucesso"
            );
        } catch (erro) {
            console.error("Erro ao cadastrar planta:", erro);

            await mostrarAlerta(
                erro.message || "Ocorreu um erro ao cadastrar a planta."
            );
        } finally {
            btnSalvarPlanta.disabled = false;
        }
    });
}

// =====================================================
// EXCLUIR PLANTA
// =====================================================

async function apagarPlanta(id) {
    const confirmado = window.confirm(
        "Deseja realmente excluir esta planta?"
    );

    if (!confirmado) return;

    try {
        const resposta = await fetch(`${API_BASE}/planta/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error(
                `Não foi possível excluir a planta (HTTP ${resposta.status}).`
            );
        }

        await carregarPlantas();

        await mostrarAlerta(
            "Planta excluída com sucesso!",
            "Sucesso"
        );
    } catch (erro) {
        console.error("Erro ao excluir planta:", erro);
        await mostrarAlerta(erro.message);
    }
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================

async function iniciarPagina() {
    renderizarPerfil();
    atualizarVisibilidade();
    await carregarPlantas();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPagina);
} else {
    iniciarPagina();
}

