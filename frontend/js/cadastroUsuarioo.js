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

// Inputs
const form = document.getElementById("formCadastro"); // COLOQUE ESSE ID NO <form>

// ================= MOSTRAR / OCULTAR SENHA =================
if (togglePassword && inputSenha) {
    togglePassword.addEventListener("click", () => {
        const tipoAtual = inputSenha.getAttribute("type");
        inputSenha.setAttribute("type", tipoAtual === "password" ? "text" : "password");

        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");
    });
}

// ================= SUBMIT DO FORM =================
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // NÃO RECARREGA A PÁGINA

    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();

    // ===== VALIDAÇÕES =====
    if (email === "" || senha === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const formatoEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmailValido.test(email)) {
        alert("Por favor, insira um email válido.");
        return;
    }

    // ===== OBJETO PARA O BACKEND =====
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
            throw new Error("Erro ao criar conta.");
        }

        const usuarioCriado = await response.json();

        alert("Conta criada com sucesso!");

        // Limpa o form
        form.reset();

        // Redireciona
        window.location.href = "/index.html";

    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar. Tente novamente.");
    }
});

btnCadastrar.addEventListener("click", (event) => {
    event.preventDefault();

    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();

   // --- 3. LÓGICA DO BOTÃO "ENTRAR" (VALIDAÇÃO DO FORMULÁRIO) ---
   const btnEntrar = document.querySelector('.btn-submit');
   const inputEmail = document.querySelector('input[type="email"]');

   if (btnEntrar) {
       btnEntrar.addEventListener('click', (evento) => {
           // Previne que a página recarregue automaticamente ao clicar no botão
           evento.preventDefault(); 
           
           // Pega os valores digitados e remove espaços em branco nas pontas
           const email = inputEmail.value.trim();
           const senha = inputSenha ? inputSenha.value.trim() : '';

           // Verifica se o usuário deixou algum campo em branco
           if (email === '' || senha === '') {
               alert('Por favor, preencha o seu email e senha para entrar.');
               return; // Para a execução do código aqui
           } 

           // Validação simples para ver se o email tem um formato válido (ex: nome@email.com)
           const formatoEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
           if (!formatoEmailValido.test(email)) {
               alert('Por favor, insira um endereço de email válido.');
               return;
           }
            // Se passou por todas as validações, simula o sucesso do login
            console.log('Dados validados. Enviando para o servidor...', { email: email });
            alert('Login efetuado com sucesso!');
            
            // No futuro, aqui entraria o redirecionamento real ou a chamada para o seu backend:
            // window.location.href = 'painelUsuario.html';
        });
    }
});
     
// CONECÇÃO D BACK COM O FRONT //
// URL da rota de cadastro do seu projeto Spring Boot
const API_CADASTRO_URL = "http://localhost:8080/api/usuario/cadastrar";

// Ouve o clique no botão "Criar Conta"
btnCadastrar.addEventListener("click", (event) => {
    event.preventDefault(); // Evita que a página recarregue do nada

    const emailValue = inputEmail.value.trim();
    const senhaValue = inputSenha.value.trim();

    // Validação básica para não enviar campos vazios
    if (emailValue === "" || senhaValue === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Cria o objeto exatamente com as propriedades que a sua Entidade Java espera
    const dadosUsuario = {
        email: emailValue,
        senha: senhaValue
    };

    // Faz o "Send" do Postman via código
    fetch(API_CADASTRO_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Avisa o Spring Boot que vai um JSON
        },
        body: JSON.stringify(dadosUsuario) // Converte o objeto JS para texto JSON
    })
    .then(response => {
        if (response.ok || response.status === 201) {
            return response.json();
        }
        // Se o Java retornar um erro (ex: e-mail já cadastrado)
        throw new Error("Erro ao criar conta. Verifique os dados ou tente novamente.");
    })
    .then(usuarioCriado => {
        alert("Conta criada com sucesso! Seja bem-vindo(a).");
        
        // Limpa os campos após o cadastro
        inputEmail.value = "";
        inputSenha.value = "";

        // Redireciona o usuário para a página principal ou de login
        window.location.href = "/index.html"; 
    })
    .catch(error => {
        console.error("Erro na requisição:", error);
        alert(error.message);
    });
});

// ================= EXTRA: Funcionalidade do Olhinho da Senha =================
// Já que você adicionou o ícone fa-eye-slash no HTML, vamos fazê-lo funcionar:


togglePassword.addEventListener("click", () => {
    // Alterna o tipo do input entre password e text
    const type = inputSenha.getAttribute("type") === "password" ? "text" : "password";
    inputSenha.setAttribute("type", type);
    
    // Alterna o ícone do olhinho aberto/fechado
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
});

document.getElementById('')

// Olhinho da senha
togglePassword.addEventListener("click", () => {
    const tipo = inputSenha.type === "password" ? "text" : "password";
    inputSenha.type = tipo;

    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
});

// Submit do formulário (IGUAL ao modelo que você pediu)
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();

    if (email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmail.test(email)) {
        alert("Email inválido!");
        return;
    }

    const dadosUsuario = {
        email: email,
        senha: senha
    };

    try {
        await fetch(API_CADASTRO_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosUsuario)
        });

        alert("Conta criada com sucesso!");
        form.reset();

        window.location.href = "/index.html";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar.");
    }
});