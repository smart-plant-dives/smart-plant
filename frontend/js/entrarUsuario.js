

// URL da API
const API_LOGIN_URL = "http://localhost:8080/api/usuario/login";

// Mostrar/ocultar senha
const togglePassword = document.getElementById("togglePassword");
const inputSenha = document.getElementById("senha");

if (togglePassword && inputSenha) {
    togglePassword.addEventListener("click", () => {
        const tipo = inputSenha.type === "password" ? "text" : "password";
        inputSenha.type = tipo;

        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");
    });
}

// IGUAL AO SEU MODELO ↓↓↓
document.getElementById('form-login').addEventListener('submit', async (event) => {
    event.preventDefault(); // impede reload

    // Captura valores
    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    const usuario = {
        login: login,
        senha: senha
    };

    const mensagemErro = document.getElementById("mensagem-erro");

    // Validação básica
    if (!login || !senha) {
        mensagemErro.innerText = "Preencha o usuário e a senha.";
        return;
    }

    try {
        // POST IGUAL AO SEU EXEMPLO
        const response = await fetch(API_LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            const usuarioAutenticado = await response.json();

            // salva sessão
            localStorage.setItem("usuarioSessao", JSON.stringify(usuarioAutenticado));

            // redireciona
            window.location.href = "addPlantas.html";

        } else {
            mensagemErro.innerText = "Usuário ou senha inválidos!";
        }

    } catch (erro) {
        console.error(erro);
        mensagemErro.innerText = "Erro ao conectar com o servidor.";
    }
});