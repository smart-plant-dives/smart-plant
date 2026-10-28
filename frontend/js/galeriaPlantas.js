
const API_URL = "http://localhost:8080/api/planta";

let plantas = [];

const grid = document.querySelector(".plant-grid");
const mensagemVazia = document.getElementById("mensagemVazia");
const searchInput = document.getElementById("searchInput");
const filtro = document.getElementById("opcoes");
const modal = document.getElementById("modalDetalhes");
const botaoFechar = document.getElementById("fechar");

// Obtém o primeiro campo existente entre os nomes possíveis.
function obterCampo(objeto, ...campos) {
    if (!objeto || typeof objeto !== "object") return "";

    for (const campo of campos) {
        if (objeto[campo] !== undefined && objeto[campo] !== null) {
            return objeto[campo];
        }
    }

    return "";
}

// Evita mostrar "[object Object]" quando um campo é uma entidade.
function obterTexto(valor, campos = ["nome", "nomeCategoria", "descricao", "login", "username"]) {
    if (valor === null || valor === undefined) return "";

    if (typeof valor === "object") {
        return String(obterCampo(valor, ...campos) || "");
    }

    return String(valor);
}

function nomePlanta(planta) {
    return obterTexto(obterCampo(planta, "nome", "nomePlanta", "nome_planta"));
}

function especiePlanta(planta) {
    return obterTexto(
        obterCampo(planta, "especie", "nomeEspecie", "nome_cientifico"),
        ["nomeCientifico", "nomeEspecie", "nome", "descricao"]
    );
}

function categoriaPlanta(planta) {
    const categoria = obterCampo(
        planta,
        "categoria",
        "nomeCategoria",
        "categoriaPlanta"
    );

    return obterTexto(categoria, [
        "nomeCategoria",
        "nome",
        "descricao",
        "nome_categoria"
    ]);
}

function descricaoPlanta(planta) {
    return obterTexto(
        obterCampo(planta, "descricao", "descricaoPlanta", "observacao"),
        ["descricao", "texto", "conteudo"]
    );
}

function imagemPlanta(planta) {
    const imagem = obterCampo(
        planta,
        "imagemUrl",
        "urlImagem",
        "url",
        "imagem",
        "foto"
    );

    if (typeof imagem === "object" && imagem !== null) {
        return obterTexto(imagem, ["url", "imagemUrl", "urlImagem"]);
    }

    return imagem || "https://via.placeholder.com/400x250?text=Planta";
}

function usuarioPlanta(planta) {
    const usuario = obterCampo(
        planta,
        "usuario",
        "dono",
        "autor",
        "usuarioPlanta",
        "tbUsuario",
        "usuarioCadastro"
    );

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
    const usuario = obterCampo(
        planta,
        "usuario",
        "dono",
        "autor",
        "usuarioPlanta",
        "tbUsuario",
        "usuarioCadastro"
    );

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
        return obterTexto(foto, ["url", "caminho", "nomeArquivo"]);
    }

    return typeof foto === "string" ? foto : "";
}

function normalizar(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Carrega as plantas do banco por meio da API.
async function carregarPlantas() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        const dados = await response.json();

        // Aceita uma lista direta ou uma lista dentro de "content".
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

// Preenche o filtro com as categorias que vieram da API.
function carregarFiltroCategorias() {
    const categoriaAtual = filtro.value;

    const categorias = [
        ...new Set(
            plantas
                .map(planta => categoriaPlanta(planta))
                .filter(Boolean)
        )
    ];

    filtro.innerHTML = '<option value="todas">Todas</option>';

    categorias.forEach(categoria => {
        const opcao = document.createElement("option");
        opcao.value = categoria;
        opcao.textContent = categoria;
        filtro.appendChild(opcao);
    });

    const opcaoExistente = [...filtro.options].find(
        opcao => normalizar(opcao.value) === normalizar(categoriaAtual)
    );

    if (opcaoExistente) {
        filtro.value = opcaoExistente.value;
    }
}

// Cria os cards da galeria.
function renderizarCards() {
    const pesquisa = normalizar(searchInput.value);
    const categoriaEscolhida = normalizar(filtro.value);

    grid.querySelectorAll(".plant-card").forEach(card => card.remove());

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

        const imagem = document.createElement("img");
        imagem.src = imagemPlanta(planta);
        imagem.alt = nomePlanta(planta) || "Planta";
        imagem.loading = "lazy";

        imagem.onerror = () => {
            imagem.onerror = null;
            imagem.src = "https://via.placeholder.com/400x250?text=Planta";
        };

        const info = document.createElement("div");
        info.className = "card-info";

        const nome = document.createElement("h3");
        nome.textContent = nomePlanta(planta) || "Planta sem nome";

        const especie = document.createElement("p");
        especie.className = "species";
        especie.textContent = especiePlanta(planta) || "Espécie não informada";

        const categoria = document.createElement("span");
        categoria.className = "tag";
        categoria.textContent = categoriaPlanta(planta) || "Sem categoria";

        info.append(nome, especie, categoria);
        card.append(imagem, info);

        card.addEventListener("click", () => abrirModal(planta));

        grid.appendChild(card);
    });
}

function abrirModal(planta) {
    // Nome do usuário que cadastrou a planta
    const elementoUsuario = document.getElementById("detalheUsuario");
    elementoUsuario.textContent = usuarioPlanta(planta);

    // Foto de perfil do usuário
    const avatar = document.querySelector("#modalDetalhes .avatar");
    const fotoUsuario = fotoUsuarioPlanta(planta);

    if (avatar) {
        avatar.style.backgroundImage = "none";
        avatar.style.backgroundColor = "#4caf50";
        avatar.style.backgroundSize = "cover";
        avatar.style.backgroundPosition = "center";
        avatar.style.backgroundRepeat = "no-repeat";

        if (fotoUsuario) {
            avatar.style.backgroundImage =
                `url("${fotoUsuario.replace(/["\\\n\r]/g, "")}")`;
        }
    }

    // Foto da planta
    const imagem = document.getElementById("detalheImg");

    imagem.src = imagemPlanta(planta);
    imagem.alt = nomePlanta(planta) || "Planta";

    imagem.onerror = function () {
        imagem.onerror = null;
        imagem.src =
            "https://via.placeholder.com/400x250?text=Planta";
    };

    // Informações da planta
    document.getElementById("detalheNome").value =
        nomePlanta(planta);

    document.getElementById("detalheEspecie").value =
        especiePlanta(planta);

    document.getElementById("detalheCategoria").value =
        categoriaPlanta(planta);

    document.getElementById("detalheDescricao").value =
        descricaoPlanta(planta) || "Sem descrição.";

    // Abrir o modal
    modal.classList.remove("hidden");
}

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

searchInput.addEventListener("input", renderizarCards);
filtro.addEventListener("change", renderizarCards);

// Inicia a galeria.
carregarPlantas();
