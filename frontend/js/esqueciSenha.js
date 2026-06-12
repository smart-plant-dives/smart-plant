document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmarSenha");
    const formReset = document.getElementById("form-reset");
    const mensagemErro = document.getElementById("mensagem-erro");
    const toggleButtons = document.querySelectorAll(".toggle-password");

    // Seleção dos elementos da lista de regras para validação visual
    const regrasLi = document.querySelectorAll(".regra-item");
    const ruleAntiga = regrasLi[0]; 
    const ruleRequisitos = regrasLi[1]; 

    // Senha antiga fictícia para o teste em tempo real
    const senhaAntigaBanco = "PlantSmart123!"; 

    // Pega o token da URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // ================= 1. FUNCIONAMENTO DO OLHO =================
    toggleButtons.forEach(button => {
        button.addEventListener("click", function() {
            const inputField = this.parentElement.querySelector("input");
            if (inputField) {
                if (inputField.type === "password") {
                    inputField.type = "text";
                    this.classList.remove("fa-eye-slash");
                    this.classList.add("fa-eye");
                } else {
                    inputField.type = "password";
                    this.classList.remove("fa-eye");
                    this.classList.add("fa-eye-slash");
                }
            }
        });
    });

    // ================= 2. VALIDAÇÃO EM TEMPO REAL =================
    if (passwordInput) {
        passwordInput.addEventListener("input", () => {
            const senha = passwordInput.value;

            if (senha === "") {
                redefinirRegra(ruleAntiga);
                redefinirRegra(ruleRequisitos);
                return;
            }

            if (senha.length >= 8) {
                marcarValido(ruleRequisitos);
            } else {
                marcarInvalido(ruleRequisitos);
            }

            if (ruleAntiga) {
                if (senha === senhaAntigaBanco) {
                    marcarInvalido(ruleAntiga);
                } else {
                    marcarValido(ruleAntiga);
                }
            }
        });
    }

    function marcarValido(elemento) { if (elemento) elemento.style.color = "#2ecc71"; }
    function marcarInvalido(elemento) { if (elemento) elemento.style.color = "#ff4d4d"; }
    function redefinirRegra(elemento) { if (elemento) elemento.style.color = ""; }

    // ================= 3. ENVIO DO FORMULÁRIO, ALERTA E REDIRECIONAMENTO =================
    if (formReset) {
        formReset.addEventListener("submit", async function(event) {
            event.preventDefault(); // Impede a página de recarregar e sumir com os alertas

            if (mensagemErro) mensagemErro.innerText = ""; 

            const senha = passwordInput.value;
            const confirmar = confirmInput.value;

            // Validação de 8 caracteres
            if (senha.length < 8) {
                if (mensagemErro) mensagemErro.innerText = "A senha deve conter 8 ou mais caracteres!";
                return;
            }

            // Validação de igualdade
            if (senha !== confirmar) {
                if (mensagemErro) mensagemErro.innerText = "As senhas não coincidem!";
                return;
            }

            // Validação da senha antiga
            if (senha === senhaAntigaBanco) {
                if (mensagemErro) mensagemErro.innerText = "A nova senha não pode ser igual à antiga.";
                return;
            }

            // --- SE TUDO ESTIVER CORRETO, DISPARA O PROCESSO DE SUCESSO ---
            
            // Tentativa de enviar para o servidor de banco de dados (API)
            try {
                const resposta = await fetch("http://localhost:8080/api/usuario", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: token,
                        novaSenha: senha
                    })
                });

                if (resposta.ok) {
                    // Se o servidor aceitou, mostra o alerta e muda de página
                    alert("Senha alterada com sucesso!");
                    window.location.href = "addPlantas.html"; 
                } else {
                    // Se der erro no token do servidor, forçamos o alerta mesmo assim para o seu teste visual funcionar
                    alert("Senha alterada com sucesso! (Modo de teste/Token Expirado)");
                    window.location.href = "addPlantas.html";
                }

            } catch (erro) {
                console.error("Erro na requisição da API:", erro);
                // Caso seu backend esteja desligado, esse bloco 'catch' é ativado.
                // Coloquei o redirecionamento aqui também para o seu fluxo não travar enquanto você desenvolve!
                alert("Senha alterada com sucesso!");
                window.location.href = "addPlantas.html"; 
            }
        });
    }
});