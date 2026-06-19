package br.com.smartplant.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/planta")
@CrossOrigin("*")
public class PlantaController {
	
	@Autowired
	private PlantaService service;
	
	@PostMapping
	public ResponseEntity<Planta> salvar(@Valid @RequestBody Planta planta) {
		Planta produtoSalvo = service.salvar(planta);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(produtoSalvo);
	}
	
	@PostMapping("/usuario/{usuarioId}")
	public ResponseEntity<Planta> salvarParaUsuario(@PathVariable Long usuarioId, @Valid @RequestBody Planta planta) {
		Planta plantaSalva = service.salvarParaUsuario(usuarioId, planta);

		return ResponseEntity.status(HttpStatus.CREATED).body(plantaSalva);
	}

	@GetMapping("/usuario/{usuarioId}")
	public ResponseEntity<List<Planta>> listarPorUsuario(@PathVariable Long usuarioId) {
		List<Planta> plantas = service.listarPorUsuario(usuarioId);

		return ResponseEntity.ok(plantas);
	}
	
	@GetMapping
	public ResponseEntity<List<Planta>> listarTodos() {
		
		List<Planta> plantas = service.listarTodos();
		
		return ResponseEntity.ok(plantas);
	}
	
	@GetMapping("/{id}")
    public ResponseEntity<Planta> buscarPorId(@PathVariable Long id) {
		
		Planta planta = service.buscarPorId(id);
		
		return ResponseEntity.ok(planta);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Planta> atualizar(@PathVariable Long id, @RequestBody Planta plantaAtualizada) {
		
		Planta planta = service.atualizar(id, plantaAtualizada);
		
		return ResponseEntity.ok(planta);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		
		service.deletar(id);
		
		return ResponseEntity.noContent().build();
	}

}
