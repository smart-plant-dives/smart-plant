package br.com.smartplant.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import br.com.smartplant.api.entities.Usuario;
import br.com.smartplant.api.services.UsuarioService;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

	@Autowired
	private UsuarioService service;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Usuario usuario, HttpServletRequest request) {
		try {
			Usuario usuarioAutenticado = service.autenticar(usuario.getLogin(), usuario.getSenha());
			HttpSession previous = request.getSession(false);
			if (previous != null) previous.invalidate();
			request.getSession(true).setAttribute("smartplantUserId", usuarioAutenticado.getId());
			return ResponseEntity.ok(usuarioAutenticado);

		} catch (org.springframework.web.server.ResponseStatusException erro) {
			return ResponseEntity.status(erro.getStatusCode())
					.body(java.util.Map.of("mensagem", "Usuário ou senha inválidos."));
		}
	}

	@PostMapping
	public Usuario salvar(@RequestBody Usuario usuario, HttpServletRequest request) {
		Usuario saved = service.salvar(usuario);
		request.getSession(true).setAttribute("smartplantUserId", saved.getId());
		return saved;
	}

	@GetMapping
	public List<Usuario> listarTodos(HttpSession session) {
		return List.of(service.buscarPorId(currentUserId(session)));
	}

	@GetMapping("/{id}")
	public Usuario buscarPorId(@PathVariable Long id, HttpSession session) {
		requireOwner(id, session);
		return service.buscarPorId(id);
	}

	@PutMapping("/{id}")
	public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario usuario, HttpSession session) {
		requireOwner(id, session);
		return service.atualizar(id, usuario);
	}

	@DeleteMapping("/{id}")
	public void deletar(@PathVariable Long id, HttpSession session) {
		requireOwner(id, session);
		service.deletar(id);
		session.invalidate();
	}

	private Long currentUserId(HttpSession session) {
		Object id = session.getAttribute("smartplantUserId");
		if (!(id instanceof Long userId)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		return userId;
	}

	private void requireOwner(Long id, HttpSession session) {
		if (!id.equals(currentUserId(session))) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
	}

}
