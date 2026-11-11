
document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmarSenha");
    const formReset = document.getElementById("form-reset");
    const mensagemErro = document.getElementById("mensagem-erro");
    const toggleButtons = document.querySelectorAll(".toggle-password");

    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const input = button.parentElement.querySelector("input");
            if (!input) return;
            const mostrar = input.type === "password";
            input.type = mostrar ? "text" : "password";
            button.classList.toggle("fa-eye", mostrar);
            button.classList.toggle("fa-eye-slash", !mostrar);
        });
    });

    if (!formReset) return;

    formReset.addEventListener("submit", event => {
        event.preventDefault();
        if (mensagemErro) mensagemErro.textContent = "";

        const senha = passwordInput.value;
        const confirmar = confirmInput.value;

        if (senha.length < 8) {
            mensagemErro.textContent = "A senha deve conter pelo menos 8 caracteres.";
            return;
        }
        if (senha !== confirmar) {
            mensagemErro.textContent = "As senhas não coincidem.";
            return;
        }

        // O backend deste projeto ainda não possui fluxo seguro de token/e-mail
        // para recuperação. Não informar sucesso nem enviar POST para cadastro.
        mensagemErro.textContent =
            "A recuperação de senha ainda não está disponível. O sistema precisa de um endpoint com token de recuperação enviado por e-mail.";
    });
});