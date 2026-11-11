const API_CADASTRO_URL = "http://localhost:8080/api/usuario";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCadastro");
    const inputEmail = document.getElementById("email");
    const inputNome = document.getElementById("nome");
    const inputLogin = document.getElementById("login");
    const inputSenha = document.getElementById("senha");
    const togglePassword = document.getElementById("togglePassword");
    const botao = document.getElementById("btnCadastrar");

    if (togglePassword && inputSenha) {
        togglePassword.addEventListener("click", () => {
            const mostrar = inputSenha.type === "password";
            inputSenha.type = mostrar ? "text" : "password";
            togglePassword.classList.toggle("fa-eye", mostrar);
            togglePassword.classList.toggle("fa-eye-slash", !mostrar);
        });
    }

    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const dadosUsuario = {
            nome: inputNome.value.trim(),
            login: inputLogin.value.trim(),
            email: inputEmail.value.trim(),
            senha: inputSenha.value,
            tipoUsuario: "USUARIO"
        };

        if (!dadosUsuario.nome || !dadosUsuario.login || !dadosUsuario.email || !dadosUsuario.senha) {
            alert("Preencha todos os campos.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosUsuario.email)) {
            alert("Informe um e-mail válido.");
            inputEmail.focus();
            return;
        }
        if (dadosUsuario.senha.length < 8) {
            alert("A senha deve conter pelo menos 8 caracteres.");
            inputSenha.focus();
            return;
        }

        const textoOriginal = botao?.textContent;
        if (botao) {
            botao.disabled = true;
            botao.textContent = "Criando conta...";
        }

        try {
            const response = await fetch(API_CADASTRO_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosUsuario)
            });

            if (!response.ok) {
                const detalhe = await response.text();
                throw new Error(detalhe || `Não foi possível criar a conta (HTTP ${response.status}).`);
            }

            const usuarioCriado = await response.json();
            localStorage.setItem("usuarioSessao", JSON.stringify(usuarioCriado));
            localStorage.setItem("perfilExtra", JSON.stringify({
                username: usuarioCriado.login || dadosUsuario.login,
                sobre: "",
                instagram: "",
                facebook: "",
                foto: ""
            }));

            alert("Conta criada com sucesso! Agora personalize seu perfil.");
            window.location.href = "addPlantas.html";
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert(error.message || "Não foi possível conectar ao servidor.");
        } finally {
            if (botao) {
                botao.disabled = false;
                botao.textContent = textoOriginal || "Criar Conta";
            }
        }
    });
});