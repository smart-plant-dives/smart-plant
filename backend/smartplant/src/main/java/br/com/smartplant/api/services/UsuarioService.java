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

	public List<Usuario> listarTodos() {
		return repository.findAll();
	}

	public Usuario buscarPorID(Long id) {
		Usuario usuario = repository.findById(id).orElse(null);

		return usuario;
	}

	public Usuario salvar(Usuario usuario) {

	    String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());

	    usuario.setSenha(senhaCriptografada);

	    return repository.save(usuario);
	}
	public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
		Usuario usuarioVelho = repository.findById(id).get();

		usuarioVelho.setNomeUsuario(usuarioAtualizado.getNomeUsuario());
		usuarioVelho.setEmail(usuarioAtualizado.getEmail());
		usuarioVelho.setSenha(usuarioAtualizado.getSenha());

		return repository.save(usuarioVelho);

	}
	

	public String deletar(Long id) {
		Usuario usuario = buscarPorID(id);

		repository.delete(usuario);

		return "O usuário" + usuario + "foi excluído";
	}

}
