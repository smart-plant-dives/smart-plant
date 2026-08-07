const foto = document.getElementById("foto");
const preview = document.getElementById("preview");
const form = document.getElementById("form");
const cancelar = document.querySelector(".cancelar");

let imagem = "";


// ===============================
// FOTO DE PERFIL
// ===============================

foto.addEventListener("change", () => {

    const arquivo = foto.files[0];

    if (!arquivo) {
        return;
    }


    // Verifica tamanho máximo de 2MB
    if (arquivo.size > 2 * 1024 * 1024) {

        alert("A imagem deve ter no máximo 2MB.");

        foto.value = "";
        imagem = "";

        return;
    }


    // Verifica formato da imagem
    const formatosPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (!formatosPermitidos.includes(arquivo.type)) {

        alert("Use uma imagem JPG, PNG ou WEBP.");

        foto.value = "";
        imagem = "";

        return;
    }


    // Mostrar preview
    const leitor = new FileReader();


    leitor.onload = function (e) {

        imagem = e.target.result;

        preview.src = imagem;

    };


    leitor.readAsDataURL(arquivo);

});



// ===============================
// CRIAR CONTA
// ===============================

form.addEventListener("submit", (e) => {

    e.preventDefault();


    // Pegar valores
    const nome = document
        .getElementById("nome")
        .value
        .trim();


    let username = document
        .getElementById("username")
        .value
        .trim();


    const instagram = document
        .getElementById("instagram")
        .value
        .trim();


    const facebook = document
        .getElementById("facebook")
        .value
        .trim();


    const sobre = document
        .getElementById("sobre")
        .value
        .trim();



    // ===============================
    // VALIDAÇÕES
    // ===============================

    if (nome === "") {

        alert("Por favor, informe seu nome.");

        document.getElementById("nome").focus();

        return;

    }


    if (nome.length < 3) {

        alert("O nome precisa ter pelo menos 3 caracteres.");

        document.getElementById("nome").focus();

        return;

    }


    // ===============================
    // USERNAME AUTOMÁTICO
    // ===============================

    if (username === "") {

        username =
            nome
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "")
                .replace(/[^a-z0-9._]/g, "")
            +
            Math.floor(Math.random() * 1000);

    }


    // Adicionar @ automaticamente
    if (!username.startsWith("@")) {

        username = "@" + username;

    }



    // ===============================
    // INSTAGRAM
    // ===============================

    if (
        instagram !== "" &&
        !instagram.includes("instagram.com")
    ) {

        alert(
            "Coloque um link válido do Instagram."
        );

        document.getElementById("instagram").focus();

        return;

    }



    // ===============================
    // FACEBOOK
    // ===============================

    if (
        facebook !== "" &&
        !facebook.includes("facebook.com")
    ) {

        alert(
            "Coloque um link válido do Facebook."
        );

        document.getElementById("facebook").focus();

        return;

    }



    // ===============================
    // SALVAR PERFIL
    // ===============================

    const perfil = {

        nome: nome,

        username: username,

        instagram: instagram,

        facebook: facebook,

        sobre: sobre,

        foto: imagem

    };


    // Salvar no navegador
    localStorage.setItem(
        "perfil",
        JSON.stringify(perfil)
    );



    // Mensagem
    alert(
        "Conta criada com sucesso, " + nome + "!"
    );



    // Ir para próxima página
    window.location.href = "addPlantas.html";

});





cancelar.addEventListener("click", () => {

    // Limpar formulário
    form.reset();


    // Limpar imagem salva
    imagem = "";


    // Voltar imagem padrão
    preview.src =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

});

// Recupera o perfil salvo
const perfil = JSON.parse(localStorage.getItem("perfil"));

if (perfil) {

    // Preenche o username
    document.getElementById("username").value = perfil.username;

}