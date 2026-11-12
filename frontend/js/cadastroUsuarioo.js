const API_CADASTRO_URL = "http://localhost:8080/api/usuario";

function mostrarModal(titulo, mensagem, tipo = "erro", aoFechar = null) {
    const modal = document.getElementById("modalAlerta");
    const tituloElemento = document.getElementById("tituloAlerta");
    const mensagemElemento = document.getElementById("mensagemAlerta");
    const icone = document.getElementById("iconeAlerta");
    const botao = document.getElementById("btnConfirmarAlerta");
    const fechar = document.getElementById("btnFecharAlerta");

    tituloElemento.textContent = titulo;
    mensagemElemento.textContent = mensagem;

    icone.className = "icone-alerta " + tipo;

    const icones = {
        erro: "fas fa-exclamation",
        sucesso: "fas fa-check",
        aviso: "fas fa-exclamation-triangle"
    };

    icone.innerHTML = `<i class="${icones[tipo] || icones.erro}"></i>`;

    modal.hidden = false;
    document.body.classList.add("modal-aberto");

    function fecharModal() {
        modal.hidden = true;
        document.body.classList.remove("modal-aberto");

        botao.removeEventListener("click", fecharModal);
        fechar.removeEventListener("click", fecharModal);
        modal.removeEventListener("click", clicarFora);

        if (aoFechar) aoFechar();
    }

    function clicarFora(event) {
        if (event.target === modal) fecharModal();
    }

    botao.addEventListener("click", fecharModal);
    fechar.addEventListener("click", fecharModal);
    modal.addEventListener("click", clicarFora);

    botao.focus();
}

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
            mostrarModal(
    "Campos obrigatórios",
    "Preencha todos os campos.",
    "aviso"
);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosUsuario.email)) {
            mostrarModal(
    "E-mail inválido",
    "Informe um endereço de e-mail válido.",
    "aviso"
);
            inputEmail.focus();
            return;
        }
        if (dadosUsuario.senha.length < 8) {
            mostrarModal(
    "Senha inválida",
    "A senha deve conter pelo menos 8 caracteres.",
    "aviso"
);
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

            mostrarModal(
    "Cadastro realizado!",
    "Conta criada com sucesso! Agora personalize seu perfil.",
    "sucesso",
    () => {
        window.location.href = "addPlantas.html";
    }
);
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