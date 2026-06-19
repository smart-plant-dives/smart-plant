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

btnCadastrar.addEventListener("click", (event) => {
    event.preventDefault();

<<<<<<< HEAD
    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();
=======
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
            alert('Login efetuado com sucesso! (Simulação)');
            
            // No futuro, aqui entraria o redirecionamento real ou a chamada para o seu backend:
            // window.location.href = 'painelUsuario.html';
        });
    }
});

const btn = document.getElementById("btnCadastrar");

btn.addEventListener("click", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
>>>>>>> e62cfca26be52e891489ebc562bde9192c8f2fbc

    if (!email || !senha) {
        alert("Preencha o email e a senha.");
        return;
    }

<<<<<<< HEAD
    const formatoEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmailValido.test(email)) {
        alert("Insira um endereço de email válido.");
        return;
    }

    // Guarda os dados desta etapa para serem usados na próxima (criarConta.html)
    sessionStorage.setItem("cadastroEmailSenha", JSON.stringify({ email, senha }));

    window.location.href = "criarConta.html";
});
=======
    const usuario = {
        email: email,
        senha: senha
    };

    // 🔥 salva no navegador
    localStorage.setItem("usuario", JSON.stringify(usuario));

    alert("Conta criada com sucesso!");

    // 👉 vai pra próxima página
    window.location.href = "criarConta.html";
});
     
// CONECÇÃO D BACK COM O FRONT //
// URL da rota de cadastro do seu projeto Spring Boot
const API_CADASTRO_URL = "http://localhost:8080/api/usuarios/cadastrar";

// Mapeia o botão e os inputs do HTML
const btnCadastrar = document.getElementById("btnCadastrar");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");

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
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
    // Alterna o tipo do input entre password e text
    const type = inputSenha.getAttribute("type") === "password" ? "text" : "password";
    inputSenha.setAttribute("type", type);
    
    // Alterna o ícone do olhinho aberto/fechado
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
});
>>>>>>> e62cfca26be52e891489ebc562bde9192c8f2fbc
