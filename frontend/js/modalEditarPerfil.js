document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleção dos elementos do HTML
    const modalOverlay = document.getElementById('modalOverlay');
    const btnAbrirConfig = document.getElementById('btnAbrirConfig');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnSalvar = document.getElementById('btnSalvar');
    
    const inputFoto = document.getElementById('inputFoto');
    const btnTrocarFoto = document.getElementById('btnTrocarFoto');
    const fotoPreview = document.getElementById('fotoPreview');
    const textoPlaceholder = document.getElementById('textoPlaceholder');

    // 2. Abrir Modal
    btnAbrirConfig.addEventListener('click', () => {
        modalOverlay.classList.add('ativo');
    });

    // 3. Fechar Modal (Cancelar)
    const fecharModal = () => {
        modalOverlay.classList.remove('ativo');
    };

    btnCancelar.addEventListener('click', fecharModal);

    // Fechar ao clicar na área escura fora do modal
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            fecharModal();
        }
    });

    // 4. Lógica para Trocar Foto
    // Quando clicar no botão visível, simula o clique no input file escondido
    btnTrocarFoto.addEventListener('click', () => {
        inputFoto.click(); 
    });

    // Quando o usuário terminar de escolher a imagem na janela do sistema
    inputFoto.addEventListener('change', function(event) {
        const arquivo = event.target.files[0];
        
        if (arquivo) {
            // Verifica o tamanho da imagem (Máximo 2MB)
            if(arquivo.size > 2 * 1024 * 1024) {
                alert("A imagem excede o tamanho máximo de 2MB.");
                this.value = ''; // Limpa o input
                return;
            }

            // Lê o arquivo para gerar o preview na tela
            const leitor = new FileReader();
            
            leitor.onload = function(e) {
                // Coloca a imagem lida no src da tag <img>
                fotoPreview.src = e.target.result; 
                
                // Remove a classe que escondia a foto e esconde o texto
                fotoPreview.classList.remove('hidden'); 
                if(textoPlaceholder) {
                    textoPlaceholder.classList.add('hidden'); 
                }
            }
            
            leitor.readAsDataURL(arquivo);
        }
    });

    // 5. Salvar Alterações
    btnSalvar.addEventListener('click', () => {
        // Coleta os valores digitados para uso futuro (enviar pro banco de dados)
        const nomeUsuario = document.getElementById('inputNome').value;
        
        // Exibe o alerta confirmando que o clique funcionou
        alert("Alterações do perfil '" + nomeUsuario + "' salvas com sucesso!");
        
        // Fecha o modal após salvar
        fecharModal();
    });
});