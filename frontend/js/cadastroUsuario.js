// ===========================================================
// Tela de LOGIN (cadastroUsuario.html)
// Autentica contra POST /api/usuario/login -> { login, senha }
// ===========================================================

const formLogin = document.getElementById("form-login");
const inputLogin = document.getElementById("login");
const inputSenha = document.getElementById("senha");
const mensagemErro = document.getElementById("mensagem-erro");
const togglePassword = document.getElementById("togglePassword");

const API_LOGIN_URL = "http://localhost:8080/api/usuario/login";

// Mostrar/ocultar senha
if (togglePassword && inputSenha) {
    togglePassword.addEventListener("click", () => {
        const tipoAtual = inputSenha.getAttribute("type");
        inputSenha.setAttribute("type", tipoAtual === "password" ? "text" : "password");
        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");
    });
}

formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();
    mensagemErro.innerText = "";

    const login = inputLogin.value.trim();
    const senha = inputSenha.value.trim();

    if (!login || !senha) {
        mensagemErro.innerText = "Preencha o usuário e a senha.";
        return;
    }

    try {
        const resposta = await fetch(API_LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, senha })
        });

        if (resposta.ok) {
            const usuarioAutenticado = await resposta.json();

            // Guarda a sessão para as outras páginas (ex: addPlantas.html)
            localStorage.setItem("usuarioSessao", JSON.stringify(usuarioAutenticado));

            window.location.href = "addPlantas.html";
        } else {
            mensagemErro.innerText = "Usuário ou senha inválidos!";
        }
    } catch (erro) {
        console.error("Erro ao conectar com o servidor:", erro);
        mensagemErro.innerText = "Não foi possível conectar com o servidor.";
    }
<<<<<<< HEAD
});
=======
           // Se passou por todas as validações, executa o login bem-sucedido
           console.log('Dados validados. Enviando para o servidor...', { email: email });
           
           // 1. Mostra o alerta de sucesso
           alert('Login efetuado com sucesso!');
           
           // 2. Redireciona o usuário para a nova página assim que ele clicar em "OK"
           window.location.href = 'addPlantas.html';
       });

// CONCÇÃO DO BACK COM O FRONT //

// URL da rota de login do seu Spring Boot
const API_LOGIN_URL = "http://localhost:8080/api/usuarios/login";

// Mapeando os elementos do HTML
const formLogin1 = document.getElementById("form-login");
const inputEmail = document.getElementById("login"); // O id do input no HTML é 'login'
const inputSenha = document.getElementById("senha");
const divErro = document.getElementById("mensagem-erro");

// Captura o evento de submit do formulário
formLogin.addEventListener("submit", (event) => {
    event.preventDefault(); // Impede o recarregamento padrão da página

    // Limpa mensagens de erro antigas
    divErro.textContent = "";

    const emailValue = inputEmail.value.trim();
    const senhaValue = inputSenha.value.trim();

    // Monta o objeto para enviar ao Spring Boot
    const dadosLogin = {
        email: emailValue,
        senha: senhaValue
    };

    // Executa a chamada HTTP (Simulando o clique do Postman)
    fetch(API_LOGIN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosLogin)
    })
    .then(async response => {
        // Se o status não for sucesso (ex: 401 Unauthorized ou 404 Not Found)
        if (!response.ok) {
            const textoErro = await response.text();
            throw new Error(textoErro || "Erro ao efetuar login.");
        }
        return response.json(); // Se deu certo, converte a resposta do usuário
    })
    .then(usuarioLogado => {
        console.log("Login bem-sucedido:", usuarioLogado);

        // Opcional: Salva o ID ou dados do usuário na sessão do navegador 
        // para você saber quem está logado quando abrir a tela de adicionar plantas
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

        alert("Bem-vindo(a) de volta!");
        
        // Redireciona para a tela principal/painel de plantas
        window.location.href = "addPlantas.html";
    })
    .catch(error => {
        console.error("Erro no login:", error);
        // Exibe o erro na div vermelha que já existe no seu HTML
        divErro.textContent = "E-mail ou senha incorretos.";
    });
});

// ================= EXTRA: Funcionalidade de Mostrar/Esconder Senha =================
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
    const type = inputSenha.getAttribute("type") === "password" ? "text" : "password";
    inputSenha.setAttribute("type", type);
    
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
});
>>>>>>> e62cfca26be52e891489ebc562bde9192c8f2fbc
