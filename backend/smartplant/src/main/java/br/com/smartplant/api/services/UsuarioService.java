package br.com.smartplant.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.smartplant.api.entities.Usuario;
import br.com.smartplant.api.repositories.UsuarioRepository;

@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository repository;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	public Usuario salvar(Usuario usuario) {
		if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
			throw new IllegalArgumentException("A senha é obrigatória.");
		}
		if (usuario.getLogin() == null || usuario.getLogin().isBlank()) {
			throw new IllegalArgumentException("O login é obrigatório.");
		}
		if (repository.existsByLogin(usuario.getLogin().trim())) {
			throw new IllegalArgumentException("Este login já está cadastrado.");
		}
		usuario.setLogin(usuario.getLogin().trim());
		if (usuario.getFotoPerfil() == null) {
			usuario.setFotoPerfil("");
		}
		String senhaCriptografia = passwordEncoder.encode(usuario.getSenha());
		usuario.setSenha(senhaCriptografia);
		return repository.save(usuario);
	}

	public Usuario autenticar(String login, String senha) {

		if (login == null || login.isBlank() || senha == null || senha.isEmpty()) {
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos.");
		}

		String loginNormalizado = login.trim();

		Usuario usuario = repository.findByLogin(loginNormalizado);

		if (usuario == null) {
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos.");
		}

		String senhaArmazenada = usuario.getSenha();

		if (senhaArmazenada == null || senhaArmazenada.isBlank()) {
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos.");
		}

		boolean senhaValida;

		if (senhaArmazenada.startsWith("$2")) {

			senhaValida = passwordEncoder.matches(senha, senhaArmazenada);

		} else {


			senhaValida = senha.equals(senhaArmazenada);

			if (senhaValida) {
				usuario.setSenha(passwordEncoder.encode(senha));
				repository.save(usuario);
			}
		}

		if (!senhaValida) {
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos.");
		}

		return usuario;
	}

	public List<Usuario> listarTodos() {
		return repository.findAll();
	}

	public Usuario buscarPorId(Long id) {
		return repository.findById(id).orElseThrow(() -> new RuntimeException("Usuario não encontrado"));
	}

	public Usuario atualizar(Long id, Usuario usuarioNovo) {
		Usuario usuarioAntigo = buscarPorId(id);

		if (usuarioNovo.getLogin() != null && !usuarioNovo.getLogin().isBlank())
			usuarioAntigo.setLogin(usuarioNovo.getLogin());
		if (usuarioNovo.getTipoUsuario() != null)
			usuarioAntigo.setTipoUsuario(usuarioNovo.getTipoUsuario());
		if (usuarioNovo.getEmail() != null && !usuarioNovo.getEmail().isBlank())
			usuarioAntigo.setEmail(usuarioNovo.getEmail());
		if (usuarioNovo.getNome() != null && !usuarioNovo.getNome().isBlank())
			usuarioAntigo.setNome(usuarioNovo.getNome());
		if (usuarioNovo.getFotoPerfil() != null)
			usuarioAntigo.setFotoPerfil(usuarioNovo.getFotoPerfil());

		if (usuarioNovo.getSenha() != null && !usuarioNovo.getSenha().isBlank()) {

			String senhaCriptografada = passwordEncoder.encode(usuarioNovo.getSenha());

			usuarioAntigo.setSenha(senhaCriptografada);
		}

		return repository.save(usuarioAntigo);

	}

	public void deletar(Long id) {
		Usuario usuario = buscarPorId(id);

		repository.delete(usuario);
	}

}