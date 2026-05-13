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