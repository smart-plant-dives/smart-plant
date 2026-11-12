
const API_LOGIN_URL = "http://localhost:8080/api/usuario/login";

// Elementos do HTML
const formularioLogin = document.getElementById("form-login");
const inputLogin = document.getElementById("login");
const inputSenha = document.getElementById("senha");
const botaoEntrar = document.querySelector(".btn-submit");

const modalAlerta = document.getElementById("modalAlerta");
const tituloAlerta = document.getElementById("tituloAlerta");
const textoAlerta = document.getElementById("textoAlerta");
const iconeAlerta = document.getElementById("iconeAlerta");

const fecharAlerta = document.getElementById("fecharAlerta");
const confirmarAlerta = document.getElementById("confirmarAlerta");
const togglePassword = document.getElementById("togglePassword");

let acaoAposAlerta = null;

// Exibir alerta personalizado
function mostrarAlerta(mensagem, tipo = "erro", titulo = "") {
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

    textoAlerta.textContent = mensagem;
    tituloAlerta.textContent = titulo || config.titulo;
    iconeAlerta.className = "icone-alerta " + config.classe;
    iconeAlerta.innerHTML = `<i class="${config.icone}"></i>`;

    modalAlerta.classList.add("ativo");
}

// Fechar alerta
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

// Mostrar ou ocultar senha
if (togglePassword && inputSenha) {
    togglePassword.addEventListener("click", () => {
        const mostrar = inputSenha.type === "password";

        inputSenha.type = mostrar ? "text" : "password";

        togglePassword.classList.toggle("fa-eye", mostrar);
        togglePassword.classList.toggle("fa-eye-slash", !mostrar);
    });
}

// Realizar login
formularioLogin.addEventListener("submit", async evento => {
    evento.preventDefault();

    const login = inputLogin.value.trim();
    const senha = inputSenha.value;

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

        // Tratar erros retornados pelo backend
        if (!response.ok) {
            const detalhe = await response.text();

            console.error("Erro HTTP no login:", {
                status: response.status,
                resposta: detalhe
            });

            if (response.status === 401) {
                mostrarAlerta(
                    "Usuário ou senha inválidos.",
                    "erro",
                    "Dados incorretos"
                );
            } else if (response.status === 403) {
                mostrarAlerta(
                    "O servidor bloqueou a tentativa de login. Verifique a configuração do Spring Security.",
                    "erro",
                    "Acesso bloqueado"
                );
            } else {
                mostrarAlerta(
                    detalhe || `Erro ao realizar login (HTTP ${response.status}).`,
                    "erro"
                );
            }

            return;
        }

        // Ler os dados do usuário autenticado
        const usuarioAutenticado = await response.json();

        console.log("Usuário autenticado:", usuarioAutenticado);

        // Salvar a sessão
        localStorage.setItem(
            "usuarioSessao",
            JSON.stringify(usuarioAutenticado)
        );

        // Exibir sucesso e redirecionar após fechar o modal
        acaoAposAlerta = () => {
            window.location.href = "addPlantas.html";
        };

        mostrarAlerta(
            "Login realizado com sucesso! Você será redirecionado.",
            "sucesso",
            "Bem-vindo(a) ao SmartPlant!"
        );

    } catch (erro) {
        console.error("Erro ao tentar fazer login:", erro);

        mostrarAlerta(
            "Não foi possível conectar ao servidor. Verifique se o Spring Boot está em execução.",
            "conexao"
        );

    } finally {
        botaoEntrar.disabled = false;
        botaoEntrar.textContent = textoOriginal;
    }
});
