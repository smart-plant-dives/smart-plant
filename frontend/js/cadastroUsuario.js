
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
            alert('Login efetuado com sucesso! (Simulação)');
            
            // No futuro, aqui entraria o redirecionamento real ou a chamada para o seu backend:
            // window.location.href = 'painelUsuario.html';
        });
    }
});
