document.addEventListener("DOMContentLoaded", () => {
    const fotoInput = document.getElementById("foto");
    const preview = document.getElementById("preview");
    const form = document.getElementById("form");
    const botaoCancelar = document.querySelector(".cancelar");
    const fotoPadrao = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    let imagem = "";

    if (fotoInput) {
        fotoInput.addEventListener("change", () => {
            const arquivo = fotoInput.files?.[0];
            if (!arquivo) return;

            if (arquivo.size > 2 * 1024 * 1024) {
                alert("A imagem deve ter no máximo 2 MB.");
                fotoInput.value = "";
                return;
            }
            if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
                alert("Escolha uma imagem JPG, PNG ou WEBP.");
                fotoInput.value = "";
                return;
            }

            const leitor = new FileReader();
            leitor.onload = event => {
                imagem = event.target.result;
                preview.src = imagem;
            };
            leitor.onerror = () => alert("Não foi possível carregar a imagem.");
            leitor.readAsDataURL(arquivo);
        });
    }

    if (form) {
        form.addEventListener("submit", async event => {
            event.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            let username = document.getElementById("username").value.trim();
            const instagram = document.getElementById("instagram").value.trim();
            const facebook = document.getElementById("facebook").value.trim();
            const sobre = document.getElementById("sobre").value.trim();

            if (nome.length < 3) {
                alert("Informe um nome com pelo menos 3 caracteres.");
                document.getElementById("nome").focus();
                return;
            }

            username = username.replace(/^@+/, "").trim();
            if (!username) {
                alert("Informe um nome de usuário.");
                document.getElementById("username").focus();
                return;
            }
            if (!/^[a-zA-Z0-9._]{3,30}$/.test(username)) {
                alert("O nome de usuário deve ter de 3 a 30 caracteres e aceitar letras, números, ponto e underline.");
                return;
            }
            if (instagram && !/^(https?:\/\/)?(www\.)?instagram\.com\//i.test(instagram)) {
                alert("Informe um link válido do Instagram.");
                return;
            }
            if (facebook && !/^(https?:\/\/)?(www\.)?facebook\.com\//i.test(facebook)) {
                alert("Informe um link válido do Facebook.");
                return;
            }

            let usuario = {};
            try {
                usuario = JSON.parse(localStorage.getItem("usuarioSessao") || "{}");
            } catch (_) {}
            if (!usuario.id && !usuario.idUsuario && !usuario.id_usuario) {
                alert("Não encontrei sua sessão. Entre ou crie sua conta novamente antes de continuar.");
                return;
            }

            const perfilExtra = {
                username, instagram, facebook, sobre, foto: imagem
            };
            const dadosUsuario = {
                nome,
                fotoPerfil: imagem || usuario.fotoPerfil || ""
            };

            const botaoSalvar = form.querySelector('[type="submit"]');
            if (botaoSalvar) {
                botaoSalvar.disabled = true;
                botaoSalvar.textContent = "Salvando...";
            }

            try {
                const id = usuario.id ?? usuario.idUsuario ?? usuario.id_usuario;
                const resposta = await fetch(`http://localhost:8080/api/usuario/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dadosUsuario)
                });
                if (!resposta.ok) {
                    const detalhe = await resposta.text();
                    throw new Error(detalhe || `Falha ao atualizar o perfil (HTTP ${resposta.status}).`);
                }

                const usuarioAtualizado = await resposta.json();
                localStorage.setItem("usuarioSessao", JSON.stringify(usuarioAtualizado));
                localStorage.setItem("perfilExtra", JSON.stringify(perfilExtra));
                localStorage.setItem("perfil", JSON.stringify({
                    ...usuarioAtualizado,
                    ...perfilExtra,
                    username
                }));

                alert("Perfil salvo com sucesso!");
                window.location.href = "addPlantas.html";
            } catch (erro) {
                console.error("Erro ao salvar perfil:", erro);
                alert(erro.message || "Não foi possível salvar seu perfil.");
            } finally {
                if (botaoSalvar) {
                    botaoSalvar.disabled = false;
                    botaoSalvar.textContent = "Salvar Conta";
                }
            }
        });
    }

    if (botaoCancelar) {
        botaoCancelar.addEventListener("click", () => {
            form?.reset();
            imagem = "";
            if (preview) preview.src = fotoPadrao;
            window.location.href = "addPlantas.html";
        });
    }
});