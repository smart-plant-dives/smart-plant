package br.com.smartplant.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.smartplant.api.entities.Categoria;
import br.com.smartplant.api.services.CategoriaService;

@RestController
@RequestMapping("/categoria")
@CrossOrigin("*")
public class CategoriaController {

	@Autowired
	public CategoriaService service;

	@PostMapping
	public Categoria cadastrar(@RequestBody Categoria categoria) {
		return service.salvar(categoria);
	}

	@GetMapping
	public List<Categoria> listar() {
		return service.listarTodos();
	}

	@GetMapping("/{id}")
	public Categoria buscarPorId(@PathVariable Long id) {
		return service.buscarPorID(id);
	}

	@PutMapping("/{id}")
	public Categoria atualizar(@PathVariable Long id, @RequestBody Categoria categoria) {
		return service.atualizar(id, categoria);
	}

	@DeleteMapping("/{id}")
	public String deletar(@PathVariable Long id) {
		return service.deletar(id);
	}

}
