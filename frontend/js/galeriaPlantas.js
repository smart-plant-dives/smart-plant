// ===========================================================
// Galeria de Plantas (galeriaPlantas.html)
// Mostra as plantas do usuário logado, com busca e filtro por
// categoria, e um modal com os detalhes de cada planta.
// ===========================================================

const API_BASE = "http://localhost:8080/api";

const usuarioSessao = JSON.parse(localStorage.getItem("usuarioSessao") || "null");

if (!usuarioSessao) {
    window.location.href = "cadastroUsuario.html";
    throw new Error("Sem sessão ativa — redirecionando para o login.");
}

let categorias = [];
let plantas = [];

const grid = document.querySelector(".plant-grid");
const mensagemVazia = document.getElementById("mensagemVazia");
const searchInput = document.getElementById("searchInput");
const selectFiltro = document.getElementById("opcoes");

const modal = document.getElementById("modalDetalhes");
const detalheUsuario = document.getElementById("detalheUsuario");
const detalheImg = document.getElementById("detalheImg");
const detalheNome = document.getElementById("detalheNome");
const detalheEspecie = document.getElementById("detalheEspecie");
const detalheCategoria = document.getElementById("detalheCategoria");
const detalheDescricao = document.getElementById("detalheDescricao");

// -----------------------------------------------------------
// Descrição automática (recurso decorativo, não vem do backend)
// -----------------------------------------------------------
function gerarDescricao(especie, categoria) {
    const texto = (especie || "").toLowerCase();

    if (texto.includes("rosa")) {
        return "A rosa-chinesa é uma planta vibrante e delicada, conhecida por sua beleza marcante.";
    }
    if (texto.includes("lilium")) {
        return "Uma planta ornamental sofisticada, com flores grandes e perfumadas.";
    }
    if (texto.includes("amora")) {
        return "Uma planta frutífera que produz frutos saborosos e ricos em nutrientes.";
    }
    if (texto.includes("girassol") || texto.includes("helianthus")) {
        return "Cria uma aparência delicada e sofisticada. Prefere sol pleno, solo bem drenado e regas moderadas.";
    }
    if (texto.includes("espada")) {
        return "Uma planta resistente e muito usada na decoração.";
    }
    return `Uma planta ${(categoria || "").toLowerCase()} com características únicas.`;
}

// -----------------------------------------------------------
// Categorias (para o filtro)
// -----------------------------------------------------------
async function carregarCategorias() {
    try {
        const resposta = await fetch(`${API_BASE}/categoria`);
        categorias = await resposta.json();

        selectFiltro.innerHTML = '<option value="todas">Todas</option>';
        categorias.forEach(cat => {
            selectFiltro.innerHTML += `<option value="${cat.id}">${cat.nomeCategoria}</option>`;
        });
    } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);
    }
}

// -----------------------------------------------------------
// Plantas
// -----------------------------------------------------------
function nomeDaCategoria(planta) {
    return planta.nomeCategoria ? planta.nomeCategoria.nomeCategoria : "Sem categoria";
}

function idDaCategoria(planta) {
    return planta.nomeCategoria ? planta.nomeCategoria.id : "";
}

function renderizarCards() {
    grid.querySelectorAll(".plant-card").forEach(card => card.remove());

    const termoBusca = searchInput.value.trim().toLowerCase();
    const categoriaSelecionada = selectFiltro.value;

    const filtradas = plantas.filter(planta => {
        const correspondeBusca =
            !termoBusca ||
            planta.nomePlanta.toLowerCase().includes(termoBusca) ||
            planta.especie.toLowerCase().includes(termoBusca);

        const correspondeCategoria =
            categoriaSelecionada === "todas" ||
            String(idDaCategoria(planta)) === String(categoriaSelecionada);

        return correspondeBusca && correspondeCategoria;
    });

    filtradas.forEach(planta => {
        const card = document.createElement("div");
        card.classList.add("plant-card");
        card.dataset.id = planta.id;

        card.innerHTML = `
            <div class="card-user">
                <div class="user-avatar"></div>
                <span class="username">@${usuarioSessao.login || usuarioSessao.nome}</span>
            </div>
            <div class="plant-image" style="background-image:url('${planta.url || "https://via.placeholder.com/300?text=Sem+imagem"}')"></div>
            <div class="card-info">
                <h3>${planta.nomePlanta}</h3>
                <p class="species">${planta.especie}</p>
                <span class="tag data-categoria">${nomeDaCategoria(planta)}</span>
            </div>
        `;

        card.addEventListener("click", () => abrirDetalhes(planta));

        grid.appendChild(card);
    });

    mensagemVazia.style.display = filtradas.length === 0 ? "block" : "none";
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

searchInput.addEventListener("input", renderizarCards);
selectFiltro.addEventListener("change", renderizarCards);

// -----------------------------------------------------------
// Modal de detalhes
// -----------------------------------------------------------
function abrirDetalhes(planta) {
    detalheUsuario.textContent = usuarioSessao.nome;
    detalheImg.src = planta.url || "https://via.placeholder.com/300?text=Sem+imagem";
    detalheNome.value = planta.nomePlanta;
    detalheEspecie.value = planta.especie;
    detalheCategoria.value = nomeDaCategoria(planta);
    detalheDescricao.value = gerarDescricao(planta.especie, nomeDaCategoria(planta));

    modal.classList.remove("hidden");
}

document.getElementById("fechar").addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

// -----------------------------------------------------------
// Início
// -----------------------------------------------------------
(async function iniciar() {
    await carregarCategorias();
    await carregarPlantas();
})();
