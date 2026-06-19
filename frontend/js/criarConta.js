const foto = document.getElementById("foto");
const preview = document.getElementById("preview");


foto.addEventListener("change",()=>{


    const arquivo = foto.files[0];


    if(arquivo){

        if(arquivo.size > 2 * 1024 * 1024){

            alert("A imagem deve ter no máximo 2MB");
            foto.value="";
            return;

        }


        const leitor = new FileReader();


        leitor.onload=function(e){

            preview.src=e.target.result;

        }


        leitor.readAsDataURL(arquivo);

    }

});





document.getElementById("form")
.addEventListener("submit",(e)=>{


    e.preventDefault();


    const nome =
    document.getElementById("nome").value;


    document.getElementById("form").addEventListener("submit", (e) => {

    e.preventDefault();

    const nome = document.getElementById("nome").value;
    let username = document.getElementById("username").value;

    // 👉 se não digitou username, cria automático
    if (!username || username.trim() === "") {

        if (nome && nome.trim() !== "") {
            username = nome
                .toLowerCase()
                .replace(/\s+/g, "") + Math.floor(Math.random() * 1000);
        } else {
            username = "user" + Math.floor(Math.random() * 10000);
        }
    }

    // 👉 garantir que tenha @
    if (!username.startsWith("@")) {
        username = "@" + username;
    }

    const perfil = {
        nome: nome || "Sem nome",
        username: username,
        instagram: document.getElementById("instagram").value,
        facebook: document.getElementById("facebook").value,
        sobre: document.getElementById("sobre").value,
        foto: imagem
    };

    localStorage.setItem("perfil", JSON.stringify(perfil));

    window.location.href = "addPlantas.html";
});


    alert(
    "Conta criada com sucesso, " 
    + nome
    );


});





document.querySelector(".cancelar")
.addEventListener("click",()=>{


    document.getElementById("form").reset();

    preview.src =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";


});

let imagem = "";


// preview da foto
foto.addEventListener("change", ()=>{

    const arquivo = foto.files[0];

    if(arquivo){

        const leitor = new FileReader();

        leitor.onload = function(e){

            imagem = e.target.result;

            preview.src = imagem;

        }

        leitor.readAsDataURL(arquivo);

    }

});