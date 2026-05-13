document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('DOMContentLoaded', () => {

    // --- SELECIONANDO OS ELEMENTOS ---
    const inputNovaSenha = document.getElementById('togglePassword');
    const iconeRegra = regraSenhaTexto.querySelector('regraSenha');
    const regraSenhaTexto = document.getElementById('confirmarSenha');

    // --- VERIFICAÇÃO EM TEMPO REAL ---
    if (inputNovaSenha) {
        // O evento 'input' dispara a cada vez que uma tecla é digitada ou apagada
        inputNovaSenha.addEventListener('input', function() {
            const senhaDigitada = this.value;

            // 1. Verifica se tem pelo menos 8 caracteres
            const temTamanhoCerto = senhaDigitada.length >= 8;

            // 2. Verifica se tem pelo menos uma letra (maiúscula ou minúscula)
            const temLetra = /[a-zA-Z]/.test(senhaDigitada);

            // 3. Verifica se tem pelo menos um número
            const temNumero = /[0-9]/.test(senhaDigitada);

            // 4. Verifica se tem pelo menos um símbolo especial
            const temSimbolo = /[!@#$%^&*]/.test(senhaDigitada);

            // Se TODAS as condições forem verdadeiras...
            if (temTamanhoCerto && temLetra && temNumero && temSimbolo) {
                // Fica Verde e muda o ícone para um check
                regraSenhaTexto.classList.remove('regra-invalida');
                regraSenhaTexto.classList.add('regra-valida');
                
                iconeRegra.classList.remove('fa-circle'); // Tira bolinha vazia
                iconeRegra.classList.add('fa-check-circle'); // Põe bolinha com check

            } else {
                // Se apagar e não cumprir mais a regra, volta a ficar Cinza
                regraSenhaTexto.classList.remove('regra-valida');
                regraSenhaTexto.classList.add('regra-invalida');
                
                iconeRegra.classList.remove('fa-check-circle');
                iconeRegra.classList.add('fa-circle');
            }
        });
    }

});

    // --- 1. LÓGICA DE MOSTRAR E OCULTAR (PARA MÚLTIPLOS OLHINHOS) ---
    // Seleciona todos os ícones de olho na página
    const toggleIcons = document.querySelectorAll('.toggle-password');

    // Para cada olho encontrado, adiciona a função de clique
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            // Descobre quem é o alvo desse olho específico usando o "data-target"
            const targetId = this.getAttribute('data-target');
            const inputTarget = document.getElementById(targetId);

            if (inputTarget) {
                // Inverte o tipo (text/password)
                const tipoAtual = inputTarget.getAttribute('type');
                const novoTipo = tipoAtual === 'password' ? 'text' : 'password';
                inputTarget.setAttribute('type', novoTipo);
                
                // Alterna o ícone
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            }
        });
    });

    // --- 2. LÓGICA DO BOTÃO "X" (FECHAR A PÁGINA) ---
    const btnFechar = document.querySelector('.close-global-btn');
    if (btnFechar) {
        btnFechar.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
    }

    // --- 3. VALIDAÇÃO DO BOTÃO "SALVAR" ---
    const btnSalvar = document.querySelector('.btn-salvar');
    const inputNovaSenha = document.getElementById('novaSenha');
    const inputConfirmaSenha = document.getElementById('confirmaSenha');

    if (btnSalvar) {
        btnSalvar.addEventListener('click', (evento) => {
            evento.preventDefault(); 
            
            const senha1 = inputNovaSenha.value;
            const senha2 = inputConfirmaSenha.value;

            // Verifica se estão vazios
            if (senha1 === '' || senha2 === '') {
                alert('Por favor, preencha os dois campos de senha.');
                return;
            }

            // Verifica se as senhas são iguais
            if (senha1 !== senha2) {
                alert('As senhas não coincidem. Digite a mesma senha nos dois campos.');
                return;
            }

            // Verifica tamanho mínimo (exemplo: 8 caracteres)
            if (senha1.length < 8) {
                alert('A senha deve ter pelo menos 8 caracteres.');
                return;
            }

            alert('Senha atualizada com sucesso!');
            // window.location.href = 'entrarUsuario.html';
        });
    }
});


