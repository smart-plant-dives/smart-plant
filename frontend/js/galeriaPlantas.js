// =========================
// CONFIGURAÇÃO DA API
// =========================
const API_URL = "http://localhost:8080/api/planta";

let plantas = [];

const usuarioSessao =
JSON.parse(localStorage.getItem("perfil"));

const grid = document.querySelector(".plant-grid");
const mensagemVazia = document.getElementById("mensagemVazia");
const searchInput = document.getElementById("searchInput");
const filtro = document.getElementById("opcoes");

// =========================
// CARREGAR PLANTAS
// =========================
async function carregarPlantas() {

    try {

        const response = await fetch(API_URL);

        plantas = await response.json();

        renderizarCards();

    } catch (erro) {

        console.error("Erro ao carregar plantas:", erro);

    }

}

// =========================
// RENDERIZAR CARDS
// =========================
function renderizarCards() {

    const pesquisa = searchInput.value.toLowerCase();

    const categoria = filtro.value;

    grid.innerHTML = "";

    const filtradas = plantas.filter(planta => {

        const nome = (planta.nome || planta.nomePlanta || "").toLowerCase();

        const especie = (planta.especie || "").toLowerCase();

        const categoriaPlanta = planta.categoria || planta.nomeCategoria || "";

        const busca =
            nome.includes(pesquisa) ||
            especie.includes(pesquisa);

        const filtroCategoria =
            categoria === "todas" ||
            categoriaPlanta == categoria;

        return busca && filtroCategoria;

    });

    if (filtradas.length === 0) {

        mensagemVazia.style.display = "block";

        return;

    }

    mensagemVazia.style.display = "none";

    filtradas.forEach(planta => {

        const card = document.createElement("div");

        card.className = "plant-card";

        card.innerHTML = `

            <img src="${planta.imagemUrl || planta.url || 'https://via.placeholder.com/250'}">

            <div class="plant-info">

                <h3>${planta.nome || planta.nomePlanta}</h3>

                <p>${planta.especie}</p>

            </div>

        `;

        card.onclick = () => abrirModal(planta);

        grid.appendChild(card);

    });

}

// =========================
// MODAL
// =========================
function abrirModal(planta) {

    document.getElementById("detalheUsuario").innerText =
        planta.usuario || "Usuário";

    document.getElementById("detalheImg").src =
        planta.imagemUrl || planta.url || "https://via.placeholder.com/250";

    document.getElementById("detalheNome").value =
        planta.nome || planta.nomePlanta;

    document.getElementById("detalheEspecie").value =
        planta.especie;

    document.getElementById("detalheCategoria").value =
        planta.categoria || planta.nomeCategoria || "";

    document.getElementById("detalheDescricao").value =
        planta.descricao || "Sem descrição.";

    document
        .getElementById("modalDetalhes")
        .classList.remove("hidden");

}

// =========================
// FECHAR MODAL
// =========================
document.getElementById("fechar").onclick = () => {

    document
        .getElementById("modalDetalhes")
        .classList.add("hidden");

};

// =========================
// DELETAR
// =========================
async function deletarPlanta(id) {

    if (!confirm("Deseja excluir esta planta?")) {

        return;

    }

    await fetch(`${API_URL}/${id}`, {

        method: "DELETE"

    });

    carregarPlantas();

}

// =========================
// PESQUISA
// =========================
searchInput.addEventListener("input", renderizarCards);

// =========================
// FILTRO
// =========================
filtro.addEventListener("change", renderizarCards);

// =========================
// INICIAR
// =========================
carregarPlantas();