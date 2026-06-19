// ===========================================================
// Tela "Criar Conta" - Etapa 1 (cadastroEntrar.html)
// Coleta email + senha e guarda temporariamente em sessionStorage.
// O cadastro real no backend só acontece na etapa 2 (criarConta.html),
// quando também temos o nome e o usuário (login).
// ===========================================================

const togglePassword = document.getElementById("togglePassword");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const btnCadastrar = document.getElementById("btnCadastrar");

// Mostrar/ocultar senha
if (togglePassword && inputSenha) {
    togglePassword.addEventListener("click", () => {
        const tipoAtual = inputSenha.getAttribute("type");
        inputSenha.setAttribute("type", tipoAtual === "password" ? "text" : "password");
        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");
    });
}

btnCadastrar.addEventListener("click", (event) => {
    event.preventDefault();

    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();

    if (!email || !senha) {
        alert("Preencha o email e a senha.");
        return;
    }

    const formatoEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmailValido.test(email)) {
        alert("Insira um endereço de email válido.");
        return;
    }

    // Guarda os dados desta etapa para serem usados na próxima (criarConta.html)
    sessionStorage.setItem("cadastroEmailSenha", JSON.stringify({ email, senha }));

    window.location.href = "criarConta.html";
});
