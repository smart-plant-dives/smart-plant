const API_CADASTRO_URL = "http://localhost:8080/api/usuario/cadastrar";

const form = document.getElementById("formCadastro");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const togglePassword = document.getElementById("togglePassword");

// ==========================
// MOSTRAR / OCULTAR SENHA
// ==========================

if (togglePassword && inputSenha) {
    togglePassword.addEventListener("click", () => {

        const tipoAtual = inputSenha.getAttribute("type");

        if (tipoAtual === "password") {
            inputSenha.setAttribute("type", "text");

            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");

        } else {
            inputSenha.setAttribute("type", "password");

            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        }
    });
}


// ==========================
// CADASTRO
// ==========================

if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = inputEmail.value.trim();
        const senha = inputSenha.value.trim();

        // Verifica campos vazios
        if (email === "" || senha === "") {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        // Verifica e-mail
        const formatoEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmailValido.test(email)) {
            alert("Por favor, insira um e-mail válido.");
            return;
        }

        const dadosUsuario = {
            email: email,
            senha: senha
        };

        console.log("Enviando para API:", dadosUsuario);

        try {

            const response = await fetch(API_CADASTRO_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dadosUsuario)
            });

            console.log("Status da resposta:", response.status);

            if (!response.ok) {

                const mensagem = await response.text();

                throw new Error(
                    mensagem || "Erro ao criar conta."
                );
            }

            alert("Conta criada com sucesso! Seja bem-vindo(a).");

            form.reset();

            window.location.href = "../index.html";

        } catch (error) {

            console.error("Erro na requisição:", error);

            alert(
                "Não foi possível conectar ao servidor.\n\n" +
                "Verifique se o Spring Boot está rodando."
            );
        }

    });
}