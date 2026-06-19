document.addEventListener('DOMContentLoaded', () => {

   // --- LÓGICA DE MOSTRAR E OCULTAR SENHA (ÍCONE DO OLHO) ---

   // 1. Encontra o ícone do olho e o campo de senha no HTML
   const togglePassword = document.querySelector('#togglePassword');
   const inputSenha = document.querySelector('#senha');

   // 2. Verifica se eles existem na página para não dar erro
   if (togglePassword && inputSenha) {
       
       // 3. Adiciona um "ouvinte" que espera o clique no ícone do olho
       togglePassword.addEventListener('click', function () {
           
           // 4. Verifica qual é o tipo atual do campo (se é 'password' ou 'text')
           const tipoAtual = inputSenha.getAttribute('type');
           
           // 5. Se for 'password', muda para 'text' (mostra). Se for 'text', muda para 'password' (esconde).
           const novoTipo = tipoAtual === 'password' ? 'text' : 'password';
           inputSenha.setAttribute('type', novoTipo);
           
           // 6. Troca o desenho do ícone (tira o traço do olho ou coloca o traço)
           this.classList.toggle('fa-eye');
           this.classList.toggle('fa-eye-slash');
       });
   }

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
            // Se clicou em OK, redireciona
                        window.location.href = "addPlantas.html";
            
            // No futuro, aqui entraria o redirecionamento real ou a chamada para o seu backend:
            // window.location.href = 'painelUsuario.html';
        });
    }
});

const formLogin = document.getElementById("form-login");
const mensagemErro = document.getElementById("mensagem-erro");

formLogin.addEventListener("submit", async function(event){
    event.preventDefault();

    const loginInput = document.getElementById("login").value;
    const senhaInput = document.getElementById("senha").value;

    try {
        const resposta = await fetch("http://localhost:8080/api/usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email: loginInput,
            senha: senhaInput
})
        });

        if (resposta.ok) {
            const dadosUsuario = await resposta.json();

            localStorage.setItem("usuarioSessao", JSON.stringify(dadosUsuario));

            // 🔥 REDIRECIONA CORRETAMENTE
            window.location.href = "addPlantas.html";

        } else {
            mensagemErro.innerText = "Usuário ou senha inválidos!";
        }

    } catch (erro) {
        console.error(erro);
        mensagemErro.innerText = "Erro ao conectar com o servidor.";
    }
           // Se passou por todas as validações, executa o login bem-sucedido
           console.log('Dados validados. Enviando para o servidor...', { email: email });
           
           // 1. Mostra o alerta de sucesso
           alert('Login efetuado com sucesso!');
           
           // 2. Redireciona o usuário para a nova página assim que ele clicar em "OK"
           window.location.href = 'addPlantas.html';
       });

// CONCÇÃO DO BACK COM O FRONT //

// URL da rota de login do seu Spring Boot
const API_LOGIN_URL = "http://localhost:8080/api/usuarios/login";

// Mapeando os elementos do HTML
const formLogin1 = document.getElementById("form-login");
const inputEmail = document.getElementById("login"); // O id do input no HTML é 'login'
const inputSenha = document.getElementById("senha");
const divErro = document.getElementById("mensagem-erro");

// Captura o evento de submit do formulário
formLogin.addEventListener("submit", (event) => {
    event.preventDefault(); // Impede o recarregamento padrão da página

    // Limpa mensagens de erro antigas
    divErro.textContent = "";

    const emailValue = inputEmail.value.trim();
    const senhaValue = inputSenha.value.trim();

    // Monta o objeto para enviar ao Spring Boot
    const dadosLogin = {
        email: emailValue,
        senha: senhaValue
    };

    // Executa a chamada HTTP (Simulando o clique do Postman)
    fetch(API_LOGIN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosLogin)
    })
    .then(async response => {
        // Se o status não for sucesso (ex: 401 Unauthorized ou 404 Not Found)
        if (!response.ok) {
            const textoErro = await response.text();
            throw new Error(textoErro || "Erro ao efetuar login.");
        }
        return response.json(); // Se deu certo, converte a resposta do usuário
    })
    .then(usuarioLogado => {
        console.log("Login bem-sucedido:", usuarioLogado);

        // Opcional: Salva o ID ou dados do usuário na sessão do navegador 
        // para você saber quem está logado quando abrir a tela de adicionar plantas
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

        alert("Bem-vindo(a) de volta!");
        
        // Redireciona para a tela principal/painel de plantas
        window.location.href = "addPlantas.html";
    })
    .catch(error => {
        console.error("Erro no login:", error);
        // Exibe o erro na div vermelha que já existe no seu HTML
        divErro.textContent = "E-mail ou senha incorretos.";
    });
});

// ================= EXTRA: Funcionalidade de Mostrar/Esconder Senha =================
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
    const type = inputSenha.getAttribute("type") === "password" ? "text" : "password";
    inputSenha.setAttribute("type", type);
    
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
});