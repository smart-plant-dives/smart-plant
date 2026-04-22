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

import br.com.smartplant.api.entities.Planta;
import br.com.smartplant.api.services.PlantaService;

@RestController
@RequestMapping("/api/planta")
@CrossOrigin("*")
public class PlantaController {
	
	@Autowired
	private PlantaService service;
	
	@PostMapping
	public Planta cadastrar(@RequestBody Planta planta) {
		return service.salvar(planta);
	}
	
	@GetMapping
	public List<Planta> listar(){
		return service.listarTodos();
	}
	
	@GetMapping("/{id}")
	public Planta buscarPorId(@PathVariable Long id) {
		return service.buscarPorID(id);
	}
	
	@PutMapping("/{id}")
	public Planta atualizar (@PathVariable Long id, @RequestBody Planta planta) {
		return service.atualizar(id, planta);
		}
	
	@DeleteMapping("/{id}")
	public String deletar(@PathVariable Long id) {
		return service.deletaR(id);
	}

}
