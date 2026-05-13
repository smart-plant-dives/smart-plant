document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmarSenha");
    const ruleAntiga = document.getElementById("validarAntiga");
    const ruleRequisitos = document.getElementById("validarRequisitos");
    const btnSubmit = document.querySelector(".btn-submit");
    const toggleButtons = document.querySelectorAll(".toggle-password");

    // Simulação de senha antiga vinda do banco de dados
    const senhaAntigaBanco = "PlantSmart123!"; 

    // 1. Alternar Visibilidade da Senha (Olho)
    toggleButtons.forEach(button => {
        button.addEventListener("click", function() {
            const targetId = this.getAttribute("data-target");
            const inputField = document.getElementById(targetId);
            
            if (inputField.type === "password") {
                inputField.type = "text";
                this.classList.replace("fa-eye-slash", "fa-eye");
            } else {
                inputField.type = "password";
                this.classList.replace("fa-eye", "fa-eye-slash");
            }
        });
    });

    // 2. Validação Dinâmica em Tempo Real
    passwordInput.addEventListener("input", () => {
        const senha = passwordInput.value;

        if (senha === "") {
            redefinirRegra(ruleAntiga);
            redefinirRegra(ruleRequisitos);
            return;
        }

        // Teste de Requisitos: Mínimo 8 caracteres, contendo letras, números e símbolos
        const temTamanho = senha.length >= 8;
        const temLetra = /[A-Za-z]/.test(senha);
        const temNumero = /[0-9]/.test(senha);
        const temSimbolo = /[^A-Za-z0-9]/.test(senha);

        if (temTamanho && temLetra && temNumero && temSimbolo) {
            marcarValido(ruleRequisitos);
        } else {
            marcarInvalido(ruleRequisitos);
        }

        // Teste de Igualdade com a Senha Antiga
        if (senha === senhaAntigaBanco) {
            marcarInvalido(ruleAntiga);
        } else {
            marcarValido(ruleAntiga);
        }
    });

    // Funções auxiliares para manipulação visual das regras
    function marcarValido(elemento) {
        elemento.style.color = "#2ecc71"; // Verde
        elemento.style.textDecoration = "line-through";
    }

    function marcarInvalido(elemento) {
        elemento.style.color = "#ff4d4d"; // Vermelho
        elemento.style.textDecoration = "none";
    }

    function redefinirRegra(elemento) {
        elemento.style.color = ""; // Retorna ao padrão do CSS
        elemento.style.textDecoration = "none";
    }

    // 3. Validação ao Enviar o Formulário
    btnSubmit.addEventListener("click", (e) => {
        e.preventDefault();

        const senha = passwordInput.value;
        const confirmacao = confirmInput.value;

        if (!senha || !confirmacao) {
            alert("Preencha todos os campos antes de continuar.");
            return;
        }

        if (senha === senhaAntigaBanco) {
            alert("A nova senha não pode ser idêntica à anterior.");
            return;
        }

        const regexValidacao = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!regexValidacao.test(senha)) {
            alert("A senha digitada não cumpre as regras de segurança.");
            return;
        }

        if (senha !== confirmacao) {
            alert("Os campos de senha e confirmação estão diferentes.");
            return;
        }

        alert("Sucesso! Sua senha foi alterada.");
        // Seu código para enviar os dados para a API (ex: fetch) entra aqui
    });
});



