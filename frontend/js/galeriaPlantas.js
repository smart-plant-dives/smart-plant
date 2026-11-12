
const API_URL = "http://localhost:8080/api/planta";

let plantas = [];

const grid = document.querySelector(".plant-grid");
const mensagemVazia = document.getElementById("mensagemVazia");
const searchInput = document.getElementById("searchInput");
const filtro = document.getElementById("opcoes");
const modal = document.getElementById("modalDetalhes");
const botaoFechar = document.getElementById("fechar");

// =====================================================
// ELEMENTOS E CAMPOS DA PLANTA
// =====================================================

function obterCampo(objeto, ...campos) {
    if (!objeto || typeof objeto !== "object") {
        return "";
    }

    for (const campo of campos) {
        if (
            objeto[campo] !== undefined &&
            objeto[campo] !== null &&
            objeto[campo] !== ""
        ) {
            return objeto[campo];
        }
    }

    return "";
}

function obterTexto(
    valor,
    campos = [
        "nome",
        "nomeEspecie",
        "nomeCientifico",
        "nomeCategoria",
        "descricao",
        "login",
        "username"
    ]
) {
    if (valor === null || valor === undefined) {
        return "";
    }

    if (typeof valor === "object") {
        return String(obterCampo(valor, ...campos) || "");
    }

    return String(valor).trim();
}

// Nome que o usuário deu à planta.
function nomePlanta(planta) {
    return obterTexto(
        obterCampo(
            planta,
            "nome",
            "nomePlanta",
            "nome_planta"
        )
    );
}

// Espécie da planta.

function especiePlanta(planta) {
    const especie = obterCampo(
        planta,
        "nomeEspecie",
        "especie",
        "nome_especie",
        "nomeCientifico",
        "nome_cientifico",
        "especiePlanta"
    );

    if (especie) {
        return obterTexto(especie, [
            "nomeEspecie",
            "nome",
            "nomeCientifico",
            "descricao"
        ]);
    }

    // Caso a espécie esteja salva no campo categoria
    const categoria = obterCampo(
        planta,
        "categoria",
        "categoriaPlanta",
        "nomeCategoria"
    );

    return obterTexto(categoria, [
        "nomeEspecie",
        "nome",
        "nomeCategoria",
        "descricao"
    ]);
}


// Categoria usada somente no filtro.
// Não será exibida como uma segunda informação no card ou modal.
function categoriaPlanta(planta) {
    const categoria = obterCampo(
        planta,
        "categoria",
        "categoriaPlanta",
        "nomeCategoria",
        "nome_categoria",
        "tipoCategoria"
    );

    return obterTexto(categoria, [
        "nomeCategoria",
        "nome_categoria",
        "nome",
        "descricao"
    ]);
}

// Descrição da planta.
function descricaoPlanta(planta) {
    return obterTexto(
        obterCampo(
            planta,
            "descricao",
            "descricaoPlanta",
            "observacao"
        ),
        ["descricao", "texto", "conteudo"]
    );
}

// Imagem da planta.
function imagemPlanta(planta) {
    const imagem = obterCampo(
        planta,
        "imagemUrl",
        "urlImagem",
        "url_imagem",
        "url",
        "imagem",
        "foto"
    );

    if (typeof imagem === "object" && imagem !== null) {
        return obterTexto(imagem, [
            "url",
            "imagemUrl",
            "urlImagem"
        ]);
    }

    return imagem || "https://placehold.co/400x250?text=Planta";
}

// =====================================================
// INFORMAÇÕES DO USUÁRIO
// =====================================================

function obterUsuario(planta) {
    return obterCampo(
        planta,
        "usuario",
        "dono",
        "autor",
        "usuarioPlanta",
        "tbUsuario",
        "usuarioCadastro"
    );
}

function usuarioPlanta(planta) {
    const usuario = obterUsuario(planta);

    if (typeof usuario === "object" && usuario !== null) {
        return obterTexto(usuario, [
            "username",
            "nomeUsuario",
            "nome_usuario",
            "login",
            "nome",
            "email"
        ]) || "Usuário";
    }

    return usuario ? String(usuario) : "Usuário";
}

function fotoUsuarioPlanta(planta) {
    const usuario = obterUsuario(planta);

    if (!usuario || typeof usuario !== "object") {
        return "";
    }

    const foto = obterCampo(
        usuario,
        "fotoPerfil",
        "foto_perfil",
        "urlFoto",
        "url_foto",
        "imagemPerfil",
        "imagem_perfil",
        "foto",
        "imagem",
        "urlImagem"
    );

    if (typeof foto === "object" && foto !== null) {
        return obterTexto(foto, [
            "url",
            "caminho",
            "nomeArquivo"
        ]);
    }

    return typeof foto === "string" ? foto : "";
}

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function normalizar(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Evita repetir a mesma informação no modal.
// Se nome e espécie forem iguais, mantém apenas um.
function textoSemDuplicacao(nome, especie) {
    const nomeLimpo = String(nome || "").trim();
    const especieLimpa = String(especie || "").trim();

    if (
        nomeLimpo &&
        especieLimpa &&
        normalizar(nomeLimpo) === normalizar(especieLimpa)
    ) {
        return {
            nome: "",
            especie: especieLimpa
        };
    }

    return {
        nome: nomeLimpo,
        especie: especieLimpa
    };
}

// =====================================================
// CARREGAR PLANTAS DA API
// =====================================================

async function carregarPlantas() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        const dados = await response.json();

        plantas = Array.isArray(dados)
            ? dados
            : Array.isArray(dados.content)
                ? dados.content
                : Array.isArray(dados.data)
                    ? dados.data
                    : [];

        carregarFiltroCategorias();
        renderizarCards();

    } catch (erro) {
        console.error("Erro ao carregar plantas:", erro);

        grid.innerHTML = "";

        mensagemVazia.textContent =
            "Não foi possível carregar as plantas. Verifique se a API está funcionando.";

        mensagemVazia.style.display = "block";
    }
}

// =====================================================
// FILTRO DE CATEGORIAS
// =====================================================

function carregarFiltroCategorias() {
    const categoriaAtual = filtro.value;

    const categorias = [
        ...new Set(
            plantas
                .map(planta => categoriaPlanta(planta))
                .filter(Boolean)
        )
    ];

    filtro.innerHTML = "";

    const opcaoTodas = document.createElement("option");
    opcaoTodas.value = "todas";
    opcaoTodas.textContent = "Todas";

    filtro.appendChild(opcaoTodas);

    categorias.forEach(categoria => {
        const opcao = document.createElement("option");

        opcao.value = categoria;
        opcao.textContent = categoria;

        filtro.appendChild(opcao);
    });

    const opcaoExistente = [...filtro.options].find(
        opcao =>
            normalizar(opcao.value) === normalizar(categoriaAtual)
    );

    if (opcaoExistente) {
        filtro.value = opcaoExistente.value;
    } else {
        filtro.value = "todas";
    }
}

// =====================================================
// CRIAR CARDS
// =====================================================

function renderizarCards() {
    const pesquisa = normalizar(searchInput.value);
    const categoriaEscolhida = normalizar(filtro.value);

    grid.innerHTML = "";

    const filtradas = plantas.filter(planta => {
        const nome = normalizar(nomePlanta(planta));
        const especie = normalizar(especiePlanta(planta));
        const categoria = normalizar(categoriaPlanta(planta));

        const correspondePesquisa =
            nome.includes(pesquisa) ||
            especie.includes(pesquisa) ||
            categoria.includes(pesquisa);

        const correspondeCategoria =
            categoriaEscolhida === "todas" ||
            categoria === categoriaEscolhida;

        return correspondePesquisa && correspondeCategoria;
    });

    mensagemVazia.textContent =
        "🌱 Nenhuma planta foi encontrada nessa categoria.";

    mensagemVazia.style.display =
        filtradas.length === 0 ? "block" : "none";

    filtradas.forEach(planta => {
        const card = document.createElement("article");
        card.className = "plant-card";

        // Imagem
        const imagem = document.createElement("img");

        imagem.src = imagemPlanta(planta);
        imagem.alt = nomePlanta(planta) || "Planta";
        imagem.loading = "lazy";

        imagem.onerror = () => {
            imagem.onerror = null;
            imagem.src =
                "https://placehold.co/400x250?text=Planta";
        };

        // Informações
        const info = document.createElement("div");
        info.className = "card-info";

        const nome = nomePlanta(planta);
        const especie = especiePlanta(planta);

        const dados = textoSemDuplicacao(nome, especie);

        // Mostra o nome somente se for diferente da espécie.
        if (dados.nome) {
            const titulo = document.createElement("h3");

            titulo.textContent = dados.nome;
            info.appendChild(titulo);
        }

        // Exibe a espécie apenas uma vez.
        const textoEspecie = document.createElement("p");

        textoEspecie.className = "species";
        textoEspecie.textContent =
            dados.especie || "Espécie não informada";

        info.appendChild(textoEspecie);

        card.append(imagem, info);

        card.addEventListener("click", () => {
            abrirModal(planta);
        });

        grid.appendChild(card);
    });
}

// =====================================================
// ABRIR MODAL DE DETALHES
// =====================================================

function abrirModal(planta) {
    try {
        // Abre o modal primeiro
        const modal = document.getElementById("modalDetalhes");

        if (!modal) {
            console.error("Modal #modalDetalhes não encontrado no HTML.");
            return;
        }

        modal.classList.remove("hidden");

        // Usuário
        const elementoUsuario = document.getElementById("detalheUsuario");

        if (elementoUsuario) {
            elementoUsuario.textContent = usuarioPlanta(planta);
        }

        // Foto do usuário
        const avatar = modal.querySelector(".avatar");
        const fotoUsuario = fotoUsuarioPlanta(planta);

        if (avatar) {
            avatar.style.backgroundImage = fotoUsuario
                ? `url("${fotoUsuario.replace(/["\\\r\n]/g, "")}")`
                : "none";
        }

        // Imagem da planta
        const imagem = document.getElementById("detalheImg");

        if (imagem) {
            imagem.onerror = function () {
                imagem.onerror = null;
                imagem.src =
                    "https://placehold.co/400x250?text=Planta";
            };

            imagem.src = imagemPlanta(planta);
            imagem.alt = nomePlanta(planta) || "Planta";
        }

        // Nome e espécie sem duplicação
        const nome = nomePlanta(planta);
        const especie = especiePlanta(planta);

        const dados = textoSemDuplicacao(nome, especie);

        const campoNome = document.getElementById("detalheNome");
        const campoEspecie = document.getElementById("detalheEspecie");
        const campoCategoria = document.getElementById("detalheCategoria");

        if (campoNome) {
            campoNome.value = dados.nome;
            campoNome.style.display = dados.nome ? "" : "none";
        }

        if (campoEspecie) {
            campoEspecie.value =
                dados.especie || "Espécie não informada";
            campoEspecie.style.display = "";
        }

        // A categoria não deve aparecer duplicada
        if (campoCategoria) {
            campoCategoria.value = "";
            campoCategoria.style.display = "none";
        }

        // Descrição
        const campoDescricao =
            document.getElementById("detalheDescricao");

        if (campoDescricao) {
            campoDescricao.value =
                descricaoPlanta(planta) || "Sem descrição.";
        }

    } catch (erro) {
        console.error("Erro ao abrir o modal:", erro);
    }
}


// =====================================================
// FECHAR MODAL
// =====================================================

function fecharModal() {
    modal.classList.add("hidden");
}

botaoFechar.addEventListener("click", fecharModal);

modal.addEventListener("click", evento => {
    if (evento.target === modal) {
        fecharModal();
    }
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        fecharModal();
    }
});

// =====================================================
// PESQUISA E FILTRO
// =====================================================

searchInput.addEventListener("input", renderizarCards);

filtro.addEventListener("change", renderizarCards);

// =====================================================
// INICIAR GALERIA
// =====================================================

carregarPlantas();
