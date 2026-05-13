// ================= MODAL PERFIL =================

const btnAbrirPerfil = document.querySelector(".edit-profile");
const modalPerfil = document.getElementById("modalPerfil");
const cancelarPerfil = document.getElementById("cancelarPerfil");
const salvarPerfil = document.getElementById("salvarPerfil");

const inputNomePerfil = document.getElementById("inputNome");
const inputSobrePerfil = document.getElementById("inputSobre");

const nomePerfil = document.querySelector(".profile h2");
const bioPerfil = document.querySelector(".profile p");

// abrir modal
btnAbrirPerfil.addEventListener("click", () => {
    modalPerfil.classList.remove("hidden");

    inputNomePerfil.value = nomePerfil.innerText.replace("@", "");
    inputSobrePerfil.value = bioPerfil.innerText.trim();
});

// fechar
cancelarPerfil.addEventListener("click", () => {
    modalPerfil.classList.add("hidden");
});

// salvar
salvarPerfil.addEventListener("click", () => {
    nomePerfil.innerText = "@" + inputNomePerfil.value;
    bioPerfil.innerText = inputSobrePerfil.value;

    modalPerfil.classList.add("hidden");
});


// ================= FOTO PERFIL =================

const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const btnTrocarFoto = document.getElementById("btnTrocarFoto");
const fotoPreview = document.getElementById("fotoPreview");
const textoPlaceholder = document.getElementById("textoPlaceholder");
const avatar = document.querySelector(".avatar");

btnTrocarFoto.addEventListener("click", () => {
    inputFotoPerfil.click();
});

inputFotoPerfil.addEventListener("change", () => {
    const file = inputFotoPerfil.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            fotoPreview.src = e.target.result;
            fotoPreview.classList.remove("hidden");
            textoPlaceholder.style.display = "none";

            avatar.style.backgroundImage = `url(${e.target.result})`;
            avatar.style.backgroundSize = "cover";
            avatar.style.backgroundPosition = "center";
        };

        reader.readAsDataURL(file);
    }
});


// ================= MODAL ADICIONAR =================

const modal = document.getElementById("modalPostagem");
const abrirModal = document.getElementById("abrirModal");
const fecharModal = document.getElementById("fecharModal");

abrirModal.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

fecharModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});


// ================= UPLOAD IMAGEM =================

const inputFoto = document.getElementById("inputFoto");
const uploadArea = document.getElementById("uploadArea");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");

let imagemBase64 = "";

uploadArea.addEventListener("click", () => {
    inputFoto.click();
});

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


// ================= CRIAR CARD =================

const btnSalvar = document.querySelector("#modalPostagem .btn-save");

const nome = document.getElementById("nomePlanta");
const especie = document.getElementById("especie");
const categoria = document.getElementById("categoria");
const descricao = document.getElementById("descricao");
const visibilidade = document.getElementById("visibilidade");

const cardsContainer = document.querySelector(".cards");

btnSalvar.addEventListener("click", () => {

    if (!nome.value) {
        alert("Digite o nome da planta!");
        return;
    }

    const novoCard = document.createElement("div");
    novoCard.classList.add("card");

    const tagPrivado = visibilidade.value === "privado"
        ? `<span style="color:red; font-size:12px;">🔒 Privado</span>`
        : "";

    novoCard.innerHTML = `
        <p class="user">@Melinda.22 ${tagPrivado}</p>
        <img src="${imagemBase64 || 'https://via.placeholder.com/300'}">
        <h3>${nome.value}</h3>
        <div data-categoria="${categoria.value}">${categoria.value}</div>
        <div>${especie.value}</div>
        <p>${descricao.value}</p>

        <div class="actions">
            <button class="edit">✏</button>
            <button class="delete">🗑</button>
        </div>
    `;

    const botaoAdd = document.getElementById("abrirModal");
    cardsContainer.insertBefore(novoCard, botaoAdd);

    modal.classList.add("hidden");
});


// ================= DELETAR =================

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        e.target.closest(".card").remove();
    }
});


// ================= EDITAR CARD =================

const modalEditar = document.getElementById("modalEditar");
const cancelarEdicao = document.getElementById("cancelarEdicao");
const salvarEdicao = document.getElementById("salvarEdicao");

const editNome = document.getElementById("editNome");
const editDescricao = document.getElementById("editDescricao");

let cardEditando = null;

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {

        cardEditando = e.target.closest(".card");

        editNome.value = cardEditando.querySelector("h3").innerText;
        editDescricao.value = cardEditando.querySelector("p:not(.user)").innerText;

        modalEditar.classList.remove("hidden");
    }
});

cancelarEdicao.addEventListener("click", () => {
    modalEditar.classList.add("hidden");
});

salvarEdicao.addEventListener("click", () => {
    if (!cardEditando) return;

    cardEditando.querySelector("h3").innerText = editNome.value;
    cardEditando.querySelector("p:not(.user)").innerText = editDescricao.value;

    modalEditar.classList.add("hidden");
});


// ================= FILTRO =================

const select = document.getElementById("opcoes");
const mensagem = document.getElementById("mensagemVazia");

select.addEventListener("change", () => {

    const valor = select.value;
    const cards = document.querySelectorAll(".card:not(.add)");

    let visiveis = 0;

    cards.forEach(card => {

        const categoriaEl = card.querySelector("[data-categoria]");
        if (!categoriaEl) return;

        const categoria = categoriaEl.dataset.categoria;

        if (valor === "todas" || categoria === valor) {
            card.style.display = "block";
            visiveis++;
        } else {
            card.style.display = "none";
        }
    });

    mensagem.style.display = visiveis === 0 ? "block" : "none";
});