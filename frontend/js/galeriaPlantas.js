const select = document.getElementById("opcoes");
const cards = document.querySelectorAll(".plant-card");
const mensagem = document.getElementById("mensagemVazia");

select.addEventListener("change", () => {

    const valor = select.value;
    let visiveis = 0;

    cards.forEach(card => {

        const categoria = card.querySelector("[data-categoria]")?.dataset.categoria;

        if (valor === "todas") {
            card.style.display = "block";
            visiveis++;
        } 
        else if (categoria === valor) {
            card.style.display = "block";
            visiveis++;
        } 
        else {
            card.style.display = "none";
        }

    });

    // MOSTRAR OU ESCONDER MENSAGEM
    if (visiveis === 0) {
        mensagem.style.display = "block";
    } else {
        mensagem.style.display = "none";
    }

});

const searchInput = document.getElementById("searchInput");
const filtroCategoria = document.getElementById("opcoes");
const plantas = document.querySelectorAll(".plant-card");
const mensagemVazia = document.getElementById("mensagemVazia");

function filtrarPlantas() {
    const textoBusca = searchInput.value.toLowerCase();
    const categoriaSelecionada = filtroCategoria.value;

    let encontrou = false;

    plantas.forEach(planta => {
        const nome = planta.querySelector("h3").textContent.toLowerCase();
        const usuario = planta.querySelector(".username").textContent.toLowerCase();
        const especie = planta.querySelector("[data-species]").textContent.toLowerCase();
        const categoria = planta.querySelector("[data-categoria]").dataset.categoria;

        const correspondeBusca =
            nome.includes(textoBusca) ||
            usuario.includes(textoBusca) ||
            especie.includes(textoBusca);

        const correspondeCategoria =
            categoriaSelecionada === "todas" ||
            categoria === categoriaSelecionada;

        if (correspondeBusca && correspondeCategoria) {
            planta.style.display = "block";
            encontrou = true;
        } else {
            planta.style.display = "none";
        }
    });

    mensagemVazia.style.display = encontrou ? "none" : "block";
}

// Eventos
searchInput.addEventListener("input", filtrarPlantas);
filtroCategoria.addEventListener("change", filtrarPlantas);

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modalDetalhes");

    const nome = document.getElementById("detalheNome");
    const especie = document.getElementById("detalheEspecie");
    const categoria = document.getElementById("detalheCategoria");
    const descricao = document.getElementById("detalheDescricao");
    const img = document.getElementById("detalheImg");

    // 🔥 clique em QUALQUER card
    document.addEventListener("click", (e) => {
        const card = e.target.closest(".card");

        if (!card) return;

        nome.textContent = card.dataset.nome;
        especie.textContent = card.dataset.especie;
        categoria.textContent = card.dataset.categoria;
        descricao.textContent = card.dataset.descricao;
        img.src = card.dataset.img;

        modal.classList.remove("hidden");
    });

    // fechar modal
    modal.addEventListener("click", (e) => {
        if (e.target.id === "modalDetalhes") {
            modal.classList.add("hidden");
        }
    });

});

const modal = document.getElementById("modalDetalhes");

const nome = document.getElementById("detalheNome");
const especie = document.getElementById("detalheEspecie");
const categoria = document.getElementById("detalheCategoria");
const descricao = document.getElementById("detalheDescricao");
const img = document.getElementById("detalheImg");

// clicar no card
document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");

    if (!card) return;

    nome.textContent = card.dataset.nome;
    especie.textContent = card.dataset.especie;
    categoria.textContent = card.dataset.categoria;
    descricao.textContent = card.dataset.descricao;
    img.src = card.dataset.img;

    modal.classList.remove("hidden");
});

// fechar clicando fora
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

// fechar botão
document.getElementById("fechar").addEventListener("click", () => {
    modal.classList.add("hidden");
});