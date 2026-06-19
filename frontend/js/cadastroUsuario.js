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
});
