
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

// Cadastro de plantas
const abrirModal = document.getElementById("abrirModal");
const modalPostagem = document.getElementById("modalPostagem");
const fecharModal = document.getElementById("fecharModal");
const btnSalvarPlanta = document.getElementById("btnSalvarPlanta");

const inputNomePlanta = document.getElementById("nomePlanta");
const inputEspecie = document.getElementById("categoriaPlanta");
const inputDescricaoPlanta = document.getElementById("descricaoPlanta");
const inputUrlImagem = document.getElementById("urlImagem");
const previewImagem = document.getElementById("previewImagem");
const placeholderImagem = document.getElementById("placeholderImagem");

const campoVisibilidade = document.getElementById("visibilidadePlanta");
const botaoVisibilidade = document.getElementById("botaoVisibilidade");
const textoVisibilidade = document.getElementById("textoVisibilidade");
const ajudaVisibilidade = document.getElementById("ajudaVisibilidade");

// Plantas e filtros
const cardsContainer = document.getElementById("cards");
const mensagemVazia = document.getElementById("mensagemVazia");
const selectFiltro = document.getElementById("opcoes");

// Alertas
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
// LEITURA DE DADOS
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

function normalizarUsername(valor) {
    return String(valor || "")
        .trim()
        .replace(/^@+/, "")
        .replace(/\s+/g, "")
        .slice(0, 30);
}

function normalizar(valor) {
    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

// =====================================================
// SESSÃO DO USUÁRIO
// =====================================================

// O login precisa salvar o usuário autenticado em "usuarioSessao".
let usuarioSessao = lerJSON("usuarioSessao", {});

function obterIdUsuario() {
    return usuarioSessao.id ??
        usuarioSessao.idUsuario ??
        usuarioSessao.id_usuario ??
        null;
}

function chavePerfilUsuario() {
    const id = obterIdUsuario();
    return id ? `smartPlantPerfil_${id}` : null;
}

// =====================================================
// PERFIL INDIVIDUAL POR CONTA
// =====================================================

function lerPerfilDaConta() {
    const chave = chavePerfilUsuario();

    if (!chave) {
        return {
            username: normalizarUsername(usuarioSessao.username),
            sobre: "",
            instagram: "",
            facebook: "",
            foto: usuarioSessao.fotoPerfil || ""
        };
    }

    const perfilSalvo = lerJSON(chave, {});

    return {
        username: normalizarUsername(
            usuarioSessao.username ||
            perfilSalvo.username ||
            perfilSalvo.nomeUsuario ||
            ""
        ),
        sobre: perfilSalvo.sobre || "",
        instagram: perfilSalvo.instagram || "",
        facebook: perfilSalvo.facebook || "",
        foto: usuarioSessao.fotoPerfil ||
            perfilSalvo.foto ||
            ""
    };
}

let perfilExtra = lerPerfilDaConta();

function salvarDadosPerfil() {
    const chave = chavePerfilUsuario();

    if (!chave) {
        console.error("Não foi possível identificar a conta conectada.");
        return false;
    }

    // Dados complementares exclusivos do usuário atual.
    localStorage.setItem(chave, JSON.stringify({
        username: perfilExtra.username,
        nomeUsuario: perfilExtra.username,
        sobre: perfilExtra.sobre,
        instagram: perfilExtra.instagram,
        facebook: perfilExtra.facebook,
        foto: perfilExtra.foto
    }));

    // Mantém a sessão atualizada sem trocar o ID da conta.
    localStorage.setItem(
        "usuarioSessao",
        JSON.stringify(usuarioSessao)
    );

    return true;
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

    const alerta = filaAlertas.shift();

    if (
        !modalAlerta ||
        !tituloAlerta ||
        !mensagemAlerta ||
        !btnFecharAlerta
    ) {
        window.alertOriginal?.(alerta.texto);
        alerta.resolve();
        processarFilaAlertas();
        return;
    }

    alertaAberto = true;
    focoAnteriorAlerta = document.activeElement;

    tituloAlerta.textContent = alerta.titulo;
    mensagemAlerta.textContent = alerta.texto;

    modalAlerta.hidden = false;
    btnFecharAlerta.focus();

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

    if (focoAnteriorAlerta?.focus) {
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

// Preserva alertas antigos que ainda usem alert().
if (!window.alertOriginal) {
    window.alertOriginal = window.alert.bind(window);
}

window.alert = texto => mostrarAlerta(texto);

// =====================================================
// TRATAMENTO DE ERROS DA API
// =====================================================

async function obterMensagemErro(resposta) {
    const texto = await resposta.text();

    if (!texto) {
        return `O servidor retornou o erro HTTP ${resposta.status}.`;
    }

    try {
        const dados = JSON.parse(texto);

        return dados.mensagem ||
            dados.message ||
            dados.error ||
            texto;
    } catch {
        return texto;
    }
}

// =====================================================
// EDITAR PERFIL
// =====================================================

function abrirEdicaoPerfil() {
    if (!modalPerfil) return;

    if (!obterIdUsuario()) {
        mostrarAlerta(
            "Não foi possível identificar sua conta. Entre novamente."
        );
        return;
    }

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
}

if (botaoEditarPerfil) {
    botaoEditarPerfil.addEventListener("click", abrirEdicaoPerfil);
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
        const sobre = inputSobre.value.trim();
        const idUsuario = obterIdUsuario();

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

        if (novoUsername.length > 30) {
            await mostrarAlerta(
                "O nome de usuário deve ter no máximo 30 caracteres."
            );
            inputUsername.focus();
            return;
        }

        if (!/^[a-zA-Z0-9._]+$/.test(novoUsername)) {
            await mostrarAlerta(
                "Use apenas letras, números, ponto e underline no nome de usuário."
            );
            inputUsername.focus();
            return;
        }

        if (!idUsuario) {
            await mostrarAlerta(
                "Não foi possível identificar sua conta. Entre novamente."
            );
            return;
        }

        // Evita dois cliques durante o salvamento.
        salvarPerfil.disabled = true;

        try {
            const dadosAtualizados = {
                nome,
                username: novoUsername,
                fotoPerfil: perfilExtra.foto ||
                    usuarioSessao.fotoPerfil ||
                    ""
            };

            const resposta = await fetch(
                `${API_BASE}/usuario/${idUsuario}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dadosAtualizados)
                }
            );

            if (!resposta.ok) {
                throw new Error(await obterMensagemErro(resposta));
            }

            const usuarioAtualizado = await resposta.json();

            // Protege a sessão contra a troca acidental de identidade.
            usuarioSessao = {
                ...usuarioSessao,
                ...usuarioAtualizado,
                id: usuarioAtualizado.id ?? idUsuario,
                nome: usuarioAtualizado.nome || nome,
                username: usuarioAtualizado.username || novoUsername
            };

            perfilExtra.username = normalizarUsername(
                usuarioSessao.username
            );
            perfilExtra.sobre = sobre;
            perfilExtra.foto = usuarioSessao.fotoPerfil ||
                perfilExtra.foto ||
                "";

            if (!salvarDadosPerfil()) {
                throw new Error(
                    "O perfil foi atualizado no servidor, mas não foi possível salvar os dados complementares no navegador."
                );
            }

            renderizarPerfil();
            modalPerfil.classList.add("hidden");

            await mostrarAlerta(
                "Perfil atualizado com sucesso!",
                "Sucesso"
            );
        } catch (erro) {
            console.error("Erro ao atualizar perfil:", erro);

            await mostrarAlerta(
                erro.message ||
                "Não foi possível atualizar o perfil."
            );
        } finally {
            salvarPerfil.disabled = false;
        }
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

        if (arquivo.size > 2 * 1024 * 1024) {
            await mostrarAlerta(
                "A imagem deve ter no máximo 2 MB."
            );

            inputFotoPerfil.value = "";
            return;
        }

        if (!arquivo.type.startsWith("image/")) {
            await mostrarAlerta(
                "Selecione um arquivo de imagem válido."
            );

            inputFotoPerfil.value = "";
            return;
        }

        const leitor = new FileReader();

        leitor.onload = async evento => {
            perfilExtra.foto = evento.target.result;

            if (fotoPreview) {
                fotoPreview.src = perfilExtra.foto;
                fotoPreview.classList.remove("hidden");
            }

            if (textoPlaceholder) {
                textoPlaceholder.style.display = "none";
            }

            if (fotoPerfil) {
                fotoPerfil.src = perfilExtra.foto;
                fotoPerfil.style.display = "block";
            }

            // A foto fica no perfil da conta atual.
            salvarDadosPerfil();
        };

        leitor.onerror = async () => {
            await mostrarAlerta("Não foi possível carregar a foto.");
        };

        leitor.readAsDataURL(arquivo);
    });
}

// =====================================================
// MODAL DE CADASTRO DE PLANTA
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
        campoVisibilidade.value = publica
            ? "PUBLICA"
            : "PRIVADA";
    }

    if (textoVisibilidade) {
        textoVisibilidade.textContent = publica
            ? "Pública"
            : "Privada";
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
        if (!obterIdUsuario()) {
            mostrarAlerta(
                "Entre novamente na sua conta para cadastrar plantas."
            );
            return;
        }

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
// FOTO DA PLANTA
// =====================================================

if (inputUrlImagem) {
    inputUrlImagem.addEventListener("change", async () => {
        const arquivo = inputUrlImagem.files?.[0];

        if (!arquivo) return;

        if (arquivo.size > 2 * 1024 * 1024) {
            await mostrarAlerta(
                "A imagem deve ter no máximo 2 MB."
            );

            inputUrlImagem.value = "";
            return;
        }

        if (!arquivo.type.startsWith("image/")) {
            await mostrarAlerta(
                "Selecione um arquivo de imagem válido."
            );

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
            await mostrarAlerta(
                "Não foi possível carregar a imagem."
            );
        };

        leitor.readAsDataURL(arquivo);
    });
}

// =====================================================
// CATEGORIAS DAS PLANTAS
// =====================================================

function nomeDaCategoria(planta) {
    return planta.nomeEspecie?.nomeEspecie ||
        planta.nomeCategoria?.nomeCategoria ||
        planta.categoria?.nome ||
        (typeof planta.especie === "string"
            ? planta.especie
            : "") ||
        "Sem categoria";
}

function idDaCategoria(planta) {
    return planta.nomeEspecie?.id ??
        planta.nomeCategoria?.idCategoria ??
        planta.nomeCategoria?.id ??
        planta.categoria?.id ??
        "";
}

// =====================================================
// CARREGAR PLANTAS DO USUÁRIO CONECTADO
// =====================================================

async function carregarPlantas() {
    const idUsuario = obterIdUsuario();

    if (!idUsuario) {
        plantas = [];
        atualizarOpcoesFiltro();
        renderizarCards();

        console.warn(
            "ID do usuário não encontrado na sessão."
        );

        return;
    }

    try {
        const resposta = await fetch(
            `${API_BASE}/planta/usuario/${idUsuario}`
        );

        if (!resposta.ok) {
            throw new Error(await obterMensagemErro(resposta));
        }

        const dados = await resposta.json();

        plantas = Array.isArray(dados) ? dados : [];

        atualizarOpcoesFiltro();
        renderizarCards();
    } catch (erro) {
        console.error("Erro ao carregar plantas:", erro);

        await mostrarAlerta(
            erro.message || "Não foi possível carregar as plantas."
        );
    }
}

// =====================================================
// FILTRO DE CATEGORIAS
// =====================================================

function atualizarOpcoesFiltro() {
    if (!selectFiltro) return;

    const valorAtual = categoriaFiltroAtual;

    const categorias = [
        ...new Set(
            plantas
                .map(nomeDaCategoria)
                .filter(Boolean)
        )
    ];

    selectFiltro.innerHTML =
        '<option value="todas">Todas</option>';

    categorias.forEach(categoria => {
        const opcao = document.createElement("option");

        opcao.value = categoria;
        opcao.textContent = categoria;

        selectFiltro.appendChild(opcao);
    });

    if (categorias.includes(valorAtual)) {
        selectFiltro.value = valorAtual;
    } else {
        categoriaFiltroAtual = "todas";
        selectFiltro.value = "todas";
    }
}

if (selectFiltro) {
    selectFiltro.addEventListener("change", () => {
        categoriaFiltroAtual = selectFiltro.value;
        renderizarCards();
    });
}

// =====================================================
// EDITAR PLANTA COM MODAL PERSONALIZADO
// =====================================================

function editarPlanta(planta) {
    plantaEmEdicao = planta;

    editarNomePlanta.value = planta.nomePlanta || "";

    editarEspeciePlanta.value =
        planta.nomeEspecie?.nomeEspecie ||
        (typeof planta.especie === "string"
            ? planta.especie
            : "");

    editarDescricaoPlanta.value = planta.descricao || "";

    modalEditarPlanta.hidden = false;

    editarNomePlanta.focus();
}

// Fechar modal de edição
cancelarEditarPlanta.addEventListener("click", () => {
    modalEditarPlanta.hidden = true;
    plantaEmEdicao = null;
});

// Fechar clicando fora
modalEditarPlanta.addEventListener("click", evento => {
    if (evento.target === modalEditarPlanta) {
        modalEditarPlanta.hidden = true;
        plantaEmEdicao = null;
    }
});

// Salvar edição
confirmarEditarPlanta.addEventListener("click", async () => {
    if (!plantaEmEdicao) return;

    const nome = editarNomePlanta.value.trim();
    const especie = editarEspeciePlanta.value.trim();
    const descricao = editarDescricaoPlanta.value.trim();

    if (!nome) {
        await mostrarAlerta("Digite o nome da planta.");
        editarNomePlanta.focus();
        return;
    }

    if (!especie) {
        await mostrarAlerta("Digite a espécie da planta.");
        editarEspeciePlanta.focus();
        return;
    }

    if (descricao.length > 150) {
        await mostrarAlerta(
            "A descrição deve ter no máximo 150 caracteres."
        );
        editarDescricaoPlanta.focus();
        return;
    }

    confirmarEditarPlanta.disabled = true;

    try {
        const resposta = await fetch(
            `${API_BASE}/planta/${plantaEmEdicao.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nomePlanta: nome,
                    descricao: descricao,
                    nomeEspecie: {
                        nomeEspecie: especie
                    },
                    url: plantaEmEdicao.url || "",
                    publica: plantaEmEdicao.publica !== false
                })
            }
        );

        if (!resposta.ok) {
            throw new Error(await obterMensagemErro(resposta));
        }

        modalEditarPlanta.hidden = true;
        plantaEmEdicao = null;

        await carregarPlantas();

        await mostrarAlerta(
            "Planta atualizada com sucesso!",
            "Sucesso"
        );

    } catch (erro) {
        console.error("Erro ao editar planta:", erro);

        await mostrarAlerta(
            erro.message || "Não foi possível editar a planta."
        );

    } finally {
        confirmarEditarPlanta.disabled = false;
    }
});

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
            normalizar(nomeDaCategoria(planta)) ===
            normalizar(categoriaFiltroAtual)
        );

    filtradas.forEach(planta => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.id = planta.id;

        const imagem = document.createElement("img");

        imagem.src = planta.url ||
            "https://placehold.co/300x200?text=Planta";

        imagem.alt = planta.nomePlanta || "Planta";

        imagem.onerror = () => {
            imagem.onerror = null;
            imagem.src = "https://placehold.co/300x200?text=Planta";
        };

        const nome = document.createElement("h3");
        nome.textContent = planta.nomePlanta || "Sem nome";

        const categoria = document.createElement("p");
        categoria.textContent = nomeDaCategoria(planta);

        const especie = document.createElement("p");
        especie.textContent =
            planta.nomeEspecie?.nomeEspecie ||
            (typeof planta.especie === "string"
                ? planta.especie
                : "Espécie não informada");

        const acoes = document.createElement("div");
        acoes.className = "actions";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "edit";
        editar.textContent = "✏";
        editar.title = "Editar planta";

        editar.addEventListener("click", () => {
            editarPlanta(planta);
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

        if (
            abrirModal &&
            abrirModal.parentNode === cardsContainer
        ) {
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
// SALVAR NOVA PLANTA
// =====================================================

if (btnSalvarPlanta) {
    btnSalvarPlanta.addEventListener("click", async evento => {
        evento.preventDefault();

        const nome = (inputNomePlanta?.value || "").trim();
        const especie = (inputEspecie?.value || "").trim();
        const descricao = (inputDescricaoPlanta?.value || "").trim();
        const visibilidade = campoVisibilidade?.value || "PUBLICA";
        const idUsuario = obterIdUsuario();

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

        if (descricao.length > 150) {
            await mostrarAlerta(
                "A descrição deve ter no máximo 150 caracteres."
            );
            inputDescricaoPlanta?.focus();
            return;
        }

        if (!idUsuario) {
            await mostrarAlerta(
                "Entre novamente na sua conta para cadastrar plantas."
            );
            return;
        }

        const novaPlanta = {
            nomePlanta: nome,
            nomeEspecie: {
                nomeEspecie: especie
            },
            descricao,
            url: imagemSelecionada || "",
            publica: visibilidade !== "PRIVADA"
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
                throw new Error(await obterMensagemErro(resposta));
            }

            modalPostagem.classList.add("hidden");

            resetarFormularioPlanta();

            await carregarPlantas();

            await mostrarAlerta(
                "Planta cadastrada com sucesso!",
                "Sucesso"
            );
        } catch (erro) {
            console.error("Erro ao cadastrar planta:", erro);

            await mostrarAlerta(
                erro.message ||
                "Ocorreu um erro ao cadastrar a planta."
            );
        } finally {
            btnSalvarPlanta.disabled = false;
        }
    });
}

// =====================================================
// EXCLUIR PLANTA
// =====================================================
// =====================================================
// CONFIRMAÇÃO PERSONALIZADA
// =====================================================

function mostrarConfirmacao(texto) {
    return new Promise(resolve => {
        mensagemConfirmacao.textContent = texto;

        modalConfirmacao.hidden = false;

        const finalizar = (resultado) => {
            modalConfirmacao.hidden = true;

            cancelarConfirmacao.removeEventListener(
                "click",
                cancelar
            );

            confirmarAcao.removeEventListener(
                "click",
                confirmar
            );

            modalConfirmacao.removeEventListener(
                "click",
                clicarFora
            );

            document.removeEventListener(
                "keydown",
                teclaEscape
            );

            resolve(resultado);
        };

        const cancelar = () => finalizar(false);
        const confirmar = () => finalizar(true);

        const clicarFora = evento => {
            if (evento.target === modalConfirmacao) {
                finalizar(false);
            }
        };

        const teclaEscape = evento => {
            if (
                evento.key === "Escape" &&
                !modalConfirmacao.hidden
            ) {
                finalizar(false);
            }
        };

        cancelarConfirmacao.addEventListener(
            "click",
            cancelar
        );

        confirmarAcao.addEventListener(
            "click",
            confirmar
        );

        modalConfirmacao.addEventListener(
            "click",
            clicarFora
        );

        document.addEventListener(
            "keydown",
            teclaEscape
        );

        cancelarConfirmacao.focus();
    });
}

// =====================================================
// EXCLUIR PLANTA COM MODAL
// =====================================================

async function apagarPlanta(id) {
    const confirmado = await mostrarConfirmacao(
        "Deseja realmente excluir esta planta? Essa ação não poderá ser desfeita."
    );

    if (!confirmado) return;

    try {
        const resposta = await fetch(
            `${API_BASE}/planta/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!resposta.ok) {
            throw new Error(await obterMensagemErro(resposta));
        }

        await carregarPlantas();

        await mostrarAlerta(
            "Planta excluída com sucesso!",
            "Sucesso"
        );

    } catch (erro) {
        console.error("Erro ao excluir planta:", erro);

        await mostrarAlerta(
            erro.message || "Não foi possível excluir a planta."
        );
    }
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================

async function iniciarPagina() {
    perfilExtra = lerPerfilDaConta();

    renderizarPerfil();
    atualizarVisibilidade();

    if (!obterIdUsuario()) {
        console.warn(
            "Sessão sem ID de usuário. Verifique o armazenamento realizado pelo login."
        );
    }

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

