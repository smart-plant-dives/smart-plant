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

import br.com.smartplant.api.entities.Especie;
import br.com.smartplant.api.services.EspecieService;

@RestController
@RequestMapping("/api/categoria")
public class EspecieController {

	@Autowired
	public EspecieService service;

	@PostMapping
	public Especie cadastrar(@RequestBody Especie especie) {
		return service.salvar(especie);
	}

	@GetMapping
	public List<Especie> listarTodos() {
		return service.listarTodos();
	}

	@GetMapping("/{id}")
	public Especie buscarPorId(@PathVariable Long id) {
		return service.buscarPorID(id);
	}

	@PutMapping("/{id}")
	public Especie atualizar(@PathVariable Long id, @RequestBody Especie especie) {
		return service.atualizar(id, especie);
	}

	@DeleteMapping("/{id}")
	public void deletar(@PathVariable Long id) {
		 service.deletar(id);
	}

}
