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


    if(nome.trim()==""){

        alert("Digite seu nome");

        return;

    }


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




// salvar conta

document.getElementById("form")
.addEventListener("submit",(e)=>{


    e.preventDefault();


    const usuario = {


        nome:
        document.getElementById("nome").value,


        instagram:
        document.getElementById("instagram").value,


        facebook:
        document.getElementById("facebook").value,


        sobre:
        document.getElementById("sobre").value,


        foto:image = imagem


    };


    localStorage.setItem(
        "perfil",
        JSON.stringify(usuario)
    );



    window.location.href =
    "perfil.html";

});