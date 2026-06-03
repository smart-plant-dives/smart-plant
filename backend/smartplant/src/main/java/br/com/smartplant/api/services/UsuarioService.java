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
        String senhaCriptografia = passwordEncoder.encode(usuario.getSenha());

        usuario.setSenha(senhaCriptografia);

        return repository.save(usuario);
    }

    public Usuario autenticar(String login, String senha) {

        Usuario usuario = repository.findByLogin(login);

        if (usuario == null) {
            throw new RuntimeException("Usuario não encontrado");
        }

        boolean senhaValida = passwordEncoder.matches(senha, usuario.getSenha());

        if (!senhaValida) {
            throw new RuntimeException("Senha inválida");
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

        usuarioAntigo.setLogin(usuarioNovo.getLogin());
        usuarioAntigo.setTipoUsuario(usuarioNovo.getTipoUsuario());
        usuarioAntigo.setNome(usuarioNovo.getNome());

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