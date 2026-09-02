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

import br.com.smartplant.api.entities.Usuario;
import br.com.smartplant.api.services.UsuarioService;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

	@Autowired
	private UsuarioService service;

	@PostMapping("/login")
	public ResponseEntity<Usuario> login(@RequestBody Usuario usuario) {
		
		Usuario usuarioAutenticado = service.autenticar(usuario.getLogin(), usuario.getSenha());
		
		return ResponseEntity.ok(usuarioAutenticado);
	}
	
	@PostMapping
	public Usuario salvar(@RequestBody Usuario usuario) {
		return service.salvar(usuario);
	}

	@GetMapping
	public List<Usuario> listarTodos() {
		return service.listarTodos();
		}

	@PutMapping("/{id}")
	public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
		return service.atualizar(id, usuario);
	}

	@DeleteMapping("/{id}")
	public void deletar(@PathVariable Long id) {
		 service.deletar(id);
	}

}

