

// ELEMENTOS
const inputFoto = document.getElementById("inputFoto");
const uploadArea = document.getElementById("uploadArea");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");

const btnSalvar = document.querySelector(".btn-save");
const modal = document.getElementById("modalPostagem");
const fecharModal = document.getElementById("fecharModal");

const nome = document.getElementById("nomePlanta");
const especie = document.getElementById("especie");
const categoria = document.getElementById("categoria");
const descricao = document.getElementById("descricao");
const visibilidade = document.getElementById("visibilidade");

const cardsContainer = document.querySelector(".cards");

// IMAGEM
let imagemBase64 = "";

// abrir seletor
uploadArea.addEventListener("click", () => {
    inputFoto.click();
});

// preview
inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            imagemBase64 = e.target.result;

            uploadPlaceholder.innerHTML = `
                <img src="${imagemBase64}" 
                style="width:100%; height:150px; object-fit:cover; border-radius:10px;">
            `;
        };

        reader.readAsDataURL(file);
    }
});

// SALVAR
btnSalvar.addEventListener("click", () => {

    if (!nome.value) {
        alert("Digite o nome da planta!");
        return;
    }

    // cria card
    const novoCard = document.createElement("div");
    novoCard.classList.add("card");

    // etiqueta privado
    const tagPrivado = visibilidade.value === "privado"
        ? `<span style="color:red; font-size:12px;">🔒 Privado</span>`
        : "";

    novoCard.innerHTML = `
        <p class="user">@Melinda.22 ${tagPrivado}</p>
        
        <img src="${imagemBase64 || 'https://via.placeholder.com/300'}">

        <h3>${nome.value}</h3>

        <div>${categoria.value}</div>
        <div>${especie.value}</div>

        <p>${descricao.value}</p>

        <div class="actions">
            <button class="delete">🗑</button>
        </div>
    `;

    // adiciona na tela (antes do botão +)
    const botaoAdd = document.getElementById("abrirModal");
    cardsContainer.insertBefore(novoCard, botaoAdd);

    // resetar
    nome.value = "";
    especie.value = "";
    categoria.value = "";
    descricao.value = "";
    visibilidade.value = "publico";
    imagemBase64 = "";

    uploadPlaceholder.innerHTML = `
        <span class="nuvem-icon">☁︎<sup>+</sup></span>
        <p>Adicionar imagem<br>da planta</p>
    `;

    modal.classList.add("hidden");
});

// FECHAR MODAL
fecharModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// ABRIR MODAL
document.getElementById("abrirModal").addEventListener("click", () => {
    modal.classList.remove("hidden");
});

// DELETAR CARD
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        e.target.closest(".card").remove();
    }
});

// ELEMENTOS EDIT
const modalEditar = document.getElementById("modalEditar");
const cancelarEdicao = document.getElementById("cancelarEdicao");
const salvarEdicao = document.getElementById("salvarEdicao");

const editNome = document.getElementById("editNome");
const editEspecie = document.getElementById("editEspecie");
const editCategoria = document.getElementById("editCategoria");
const editDescricao = document.getElementById("editDescricao");

const inputFotoEdit = document.getElementById("inputFotoEdit");
const uploadAreaEdit = document.getElementById("uploadAreaEdit");
const uploadPlaceholderEdit = document.getElementById("uploadPlaceholderEdit");

let cardEditando = null;
let novaImagemEdit = "";

// ABRIR MODAL AO CLICAR NO EDITAR
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {

        cardEditando = e.target.closest(".card");

        // pegar dados do card
        const nome = cardEditando.querySelector("h3").innerText;
        const descricao = cardEditando.querySelector("p:not(.user)").innerText;
        const img = cardEditando.querySelector("img").src;

        editNome.value = nome;
        editDescricao.value = descricao;

        uploadPlaceholderEdit.innerHTML = `
            <img src="${img}" style="width:100%; height:150px; object-fit:cover; border-radius:10px;">
        `;

        modalEditar.classList.remove("hidden");
    }
});

// FECHAR
cancelarEdicao.addEventListener("click", () => {
    modalEditar.classList.add("hidden");
});

// UPLOAD NOVA IMAGEM
uploadAreaEdit.addEventListener("click", () => {
    inputFotoEdit.click();
});

inputFotoEdit.addEventListener("change", () => {
    const file = inputFotoEdit.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            novaImagemEdit = e.target.result;

            uploadPlaceholderEdit.innerHTML = `
                <img src="${novaImagemEdit}" 
                style="width:100%; height:150px; object-fit:cover; border-radius:10px;">
            `;
        };

        reader.readAsDataURL(file);
    }
});

// SALVAR ALTERAÇÕES
salvarEdicao.addEventListener("click", () => {

    if (!cardEditando) return;

    cardEditando.querySelector("h3").innerText = editNome.value;
    cardEditando.querySelector("p:not(.user)").innerText = editDescricao.value;

    if (novaImagemEdit) {
        cardEditando.querySelector("img").src = novaImagemEdit;
    }

    modalEditar.classList.add("hidden");
});

  const btnFechar = document.getElementById("fecharModal");

  // ÍCONE DO LÁPIS (usa a classe do seu botão)
  const btnEditar = document.querySelector(".editar-perfil");

  // ABRIR MODAL
  btnEditar.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // FECHAR MODAL
  btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // FECHAR CLICANDO FORA
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // ELEMENTOS
const modal2 = document.getElementById("modalPerfil");
const btnEditar2 = document.querySelector(".editar-perfil");
const btnFechar2 = document.getElementById("fecharModal");
const btnSalvar2 = document.getElementById("salvarPerfil");

const nomePerfil = document.querySelector(".nome");
const bioPerfil = document.querySelector(".bio");

const inputNome = document.getElementById("inputNome");
const inputBio = document.getElementById("inputBio");

// ABRIR MODAL
btnEditar.addEventListener("click", () => {
  modal.style.display = "flex";

  // preencher campos com dados atuais
  inputNome.value = nomePerfil.innerText;
  inputBio.value = bioPerfil.innerText;
});

// FECHAR
btnFechar.addEventListener("click", () => {
  modal.style.display = "none";
});

// SALVAR ALTERAÇÕES
btnSalvar.addEventListener("click", () => {
  nomePerfil.innerText = inputNome.value;
  bioPerfil.innerText = inputBio.value;

  modal.style.display = "none";
});

// FECHAR AO CLICAR FORA
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

const select = document.getElementById("opcoes");

select.addEventListener("change", () => {

  const valorSelecionado = select.value.toLowerCase();

  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {

    // ignora o botão "+"
    if (card.classList.contains("add")) return;

    const categoriaEl = card.querySelector("[data-categoria]");

    if (!categoriaEl) return;

    const categoria = categoriaEl.dataset.categoria.toLowerCase();

    if (valorSelecionado === "todas" || categoria === valorSelecionado) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }

  });

});

// ---------------- FILTRO DE CATEGORIA ----------------

const selectFiltro = document.getElementById("opcoes");
const mensagem = document.getElementById("mensagemVazia");

selectFiltro.addEventListener("change", filtrarCards);

function filtrarCards() {

    const valor = selectFiltro.value;
    const cards = document.querySelectorAll(".card:not(.add)");

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

    // mensagem quando não tiver nada
    if (visiveis === 0) {
        mensagem.style.display = "block";
    } else {
        mensagem.style.display = "none";
    }
}

const select2 = document.getElementById("opcoes");
const cards2 = document.querySelectorAll(".plant-card:not(.add)");
const mensagem2 = document.getElementById("mensagemVazia");

select.addEventListener("change", function () {
    const valor = this.value.toLowerCase();
    let visiveis = 0;

    cards.forEach(card => {
        const categoriaEl = card.querySelector("[data-categoria]");

        if (!categoriaEl) return;

        const categoria = categoriaEl.dataset.categoria.toLowerCase();

        if (valor === "todas" || categoria === valor) {
            card.style.display = "block";
            visiveis++;
        } else {
            card.style.display = "none";
        }
    });

    // mensagem quando vazio
    if (visiveis === 0) {
        mensagem.style.display = "block";
    } else {
        mensagem.style.display = "none";
    }
});