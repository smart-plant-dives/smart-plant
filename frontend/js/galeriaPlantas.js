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

const modal = document.getElementById("modalDetalhes");

const nomeInput = document.getElementById("detalheNome");
const especieInput = document.getElementById("detalheEspecie");
const categoriaInput = document.getElementById("detalheCategoria");
const descricaoInput = document.getElementById("detalheDescricao");
const usuarioSpan = document.getElementById("detalheUsuario");
const imgModal = document.getElementById("detalheImg");

// 🔥 GERAR DESCRIÇÃO AUTOMÁTICA
function gerarDescricao(especie, categoria) {

    const texto = especie.toLowerCase();

    if (texto.includes("rosa")) {
        return "A rosa-chinesa é uma planta vibrante e delicada, conhecida por sua beleza marcante.";
    }

    if (texto.includes("lilium")) {
        return "Uma planta ornamental sofisticada, com flores grandes e perfumadas.";
    }

    if (texto.includes("amora")) {
        return "Uma planta frutífera que produz frutos saborosos e ricos em nutrientes.";
    }

    if (texto.includes("girassol")) {
        return "Cria uma aparência mais delicada e sofisticada. Seu cultivo é simples: prefere sol pleno, solo bem drenado e regas moderadas.";
    }

    if (texto.includes("espada")) {
        return "Uma planta resistente e muito usada na decoração.";
    }

    return `Uma planta ${categoria.toLowerCase()} com características únicas.`;
}

// 🔥 CLICK NO CARD (ÚNICO E CORRETO)
document.addEventListener("click", (e) => {

    const card = e.target.closest(".plant-card");
    if (!card) return;

    const nome = card.querySelector("h3").textContent;
    const especie = card.querySelector("[data-species]").textContent;
    const categoria = card.querySelector("[data-categoria]").textContent;
    const usuario = card.querySelector(".username").textContent;

    const bg = card.querySelector(".plant-image").style.backgroundImage;
    const img = bg.replace(/url\("?(.*?)"?\)/, "$1");

    // 🔥 GERA DESCRIÇÃO
    const descricao = gerarDescricao(especie, categoria);

    // ✅ COLOCAR NOS INPUTS (CORRETO)
    nomeInput.value = nome;
    especieInput.value = especie;
    categoriaInput.value = categoria;
    descricaoInput.value = descricao;

    usuarioSpan.textContent = usuario;
    imgModal.src = img;

    modal.classList.remove("hidden");
});

// fechar botão
document.getElementById("fechar").addEventListener("click", () => {
    modal.classList.add("hidden");
});

// fechar clicando fora
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

const id = card.dataset.id;

fetch(`http://localhost:3000/plantas/${id}`)
    .then(res => res.json())
    .then(planta => {

        nomeInput.value = planta.nome;
        especieInput.value = planta.especie;
        categoriaInput.value = planta.categoria;
        descricaoInput.value = planta.descricao; // 🔥 VEM DA API

    });

    