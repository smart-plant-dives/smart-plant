
const API_CADASTRO_URL = "http://localhost:8080/api/usuario/cadastrar";

const form = document.getElementById("formCadastro");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const togglePassword = document.getElementById("togglePassword");

//mostra e oculta senha
if (togglePassword && inputSenha) {
    togglePassword.addEventListener("click", () => {
        const tipoAtual = inputSenha.getAttribute("type");
        inputSenha.setAttribute("type", tipoAtual === "password" ? "text" : "password");
        
        // Alterna o ícone
        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");
    });
}

//manda form pro spring
if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o recarregamento padrão da página

        const email = inputEmail.value.trim();
        const senha = inputSenha.value.trim();

        if (email === "" || senha === "") {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        const formatoEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatoEmailValido.test(email)) {
            alert("Por favor, insira um e-mail válido.");
            return;
        }

        const dadosUsuario = {
            email: email,
            senha: senha
        };

        try {
            const response = await fetch(API_CADASTRO_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosUsuario)
            });

            if (!response.ok && response.status !== 201) {
                throw new Error("Erro ao criar conta. Verifique os dados fornecidos.");
            }

            alert("Conta criada com sucesso! Seja bem-vindo(a).");
            
            form.reset(); // Limpa os campos
            window.location.href = "../index.html"; // Redireciona para a home/login

        } catch (error) {
            console.error("Erro na requisição:", error);
            alert(error.message || "Erro ao cadastrar. Tente novamente.");
        }
    });
}