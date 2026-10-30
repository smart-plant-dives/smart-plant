
const API_LOGIN_URL = "http://localhost:8080/api/usuario/login";

// =====================================================
// ELEMENTOS DO HTML
// =====================================================

const formularioLogin = document.getElementById("form-login");
const inputLogin = document.getElementById("login");
const inputSenha = document.getElementById("senha");
const botaoEntrar = document.querySelector(".btn-submit");

const mensagemErro = document.getElementById("mensagem-erro");

const modalAlerta = document.getElementById("modalAlerta");
const tituloAlerta = document.getElementById("tituloAlerta");
const textoAlerta = document.getElementById("textoAlerta");
const iconeAlerta = document.getElementById("iconeAlerta");

const fecharAlerta = document.getElementById("fecharAlerta");
const confirmarAlerta = document.getElementById("confirmarAlerta");

const togglePassword = document.getElementById("togglePassword");

let acaoAposAlerta = null;

// =====================================================
// MODAL DE ALERTA
// =====================================================

function mostrarAlerta(mensagem, tipo = "erro", titulo = "") {
    textoAlerta.textContent = mensagem;

    const configuracoes = {
        erro: {
            titulo: "Ops! Algo deu errado",
            icone: "fas fa-exclamation-circle",
            classe: ""
        },
        sucesso: {
            titulo: "Tudo certo!",
            icone: "fas fa-check-circle",
            classe: "sucesso"
        },
        conexao: {
            titulo: "Erro de conexão",
            icone: "fas fa-wifi",
            classe: "conexao"
        },
        atencao: {
            titulo: "Atenção!",
            icone: "fas fa-exclamation-triangle",
            classe: ""
        }
    };

    const config = configuracoes[tipo] || configuracoes.erro;

    tituloAlerta.textContent = titulo || config.titulo;
    iconeAlerta.className = "icone-alerta " + config.classe;
    iconeAlerta.innerHTML = `<i class="${config.icone}"></i>`;

    modalAlerta.classList.add("ativo");
}

function fecharModalAlerta() {
    modalAlerta.classList.remove("ativo");

    if (typeof acaoAposAlerta === "function") {
        const acao = acaoAposAlerta;
        acaoAposAlerta = null;
        acao();
    }
}

fecharAlerta.addEventListener("click", fecharModalAlerta);
confirmarAlerta.addEventListener("click", fecharModalAlerta);

modalAlerta.addEventListener("click", evento => {
    if (evento.target === modalAlerta) {
        fecharModalAlerta();
    }
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        fecharModalAlerta();
    }
});

// =====================================================
// MOSTRAR E OCULTAR SENHA
// =====================================================

if (togglePassword && inputSenha) {
    togglePassword.addEventListener("click", () => {
        const mostrar = inputSenha.type === "password";

        inputSenha.type = mostrar ? "text" : "password";

        togglePassword.classList.toggle("fa-eye", mostrar);
        togglePassword.classList.toggle("fa-eye-slash", !mostrar);
    });
}

// =====================================================
// LOGIN — APENAS UM EVENTO SUBMIT
// =====================================================

if (formularioLogin) {
    formularioLogin.addEventListener("submit", async evento => {
        evento.preventDefault();

        const login = inputLogin.value.trim();
        const senha = inputSenha.value;

        if (mensagemErro) {
            mensagemErro.textContent = "";
        }

        if (!login || !senha) {
            mostrarAlerta(
                "Preencha o usuário e a senha para entrar.",
                "atencao"
            );
            return;
        }

        const textoOriginal = botaoEntrar.textContent;

        botaoEntrar.disabled = true;
        botaoEntrar.textContent = "Entrando...";

        try {
            const response = await fetch(API_LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login: login,
                    senha: senha
                })
            });

            if (!response.ok) {
                if (response.status === 401 ||
                    response.status === 403) {
                    mostrarAlerta(
                        "Verifique seu usuário e sua senha.",
                        "erro",
                        "Dados incorretos"
                    );
                } else {
                    const detalhe = await response.text();

                    mostrarAlerta(
                        detalhe ||
                        `Não foi possível realizar o login (HTTP ${response.status}).`,
                        "erro"
                    );
                }

                return;
            }

            const usuarioAutenticado = await response.json();

            // Diagnóstico: verificar o formato da resposta da API.
            console.log(
                "Resposta recebida do login:",
                usuarioAutenticado
            );

            // Preservar o ID e os demais campos retornados pela API.
            localStorage.setItem(
                "usuarioSessao",
                JSON.stringify(usuarioAutenticado)
            );

            // Não sobrescrever o perfil com dados incompletos do login.
            mostrarAlerta(
                "Login realizado com sucesso! Você será redirecionado.",
                "sucesso",
                "Bem-vindo(a) ao SmartPlant!"
            );

            acaoAposAlerta = () => {
                window.location.href = "addPlantas.html";
            };

        } catch (erro) {
            console.error("Erro no login:", erro);

            mostrarAlerta(
                "Não foi possível conectar ao servidor. Verifique se o Spring Boot está funcionando.",
                "conexao"
            );

        } finally {
            botaoEntrar.disabled = false;
            botaoEntrar.textContent = textoOriginal;
        }
    });
}
