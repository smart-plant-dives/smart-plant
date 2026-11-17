package br.com.smartplant.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import jakarta.servlet.http.HttpSession;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/planta")
public class PlantaController {
	
	@Autowired
	private PlantaService service;
	
	@PostMapping
	public ResponseEntity<Planta> salvar(@Valid @RequestBody Planta planta, HttpSession session) {
		Planta produtoSalvo = service.salvarParaUsuario(currentUserId(session), planta);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(produtoSalvo);
	}
	
	@PostMapping("/usuario/{usuarioId}")
	public ResponseEntity<Planta> salvarParaUsuario(@PathVariable Long usuarioId, @Valid @RequestBody Planta planta, HttpSession session) {
		requireOwner(usuarioId, session);
		Planta plantaSalva = service.salvarParaUsuario(usuarioId, planta);

		return ResponseEntity.status(HttpStatus.CREATED).body(plantaSalva);
	}

	@GetMapping("/usuario/{usuarioId}")
	public ResponseEntity<List<Planta>> listarPorUsuario(@PathVariable Long usuarioId, HttpSession session) {
		requireOwner(usuarioId, session);
		List<Planta> plantas = service.listarPorUsuario(usuarioId);

		return ResponseEntity.ok(plantas);
	}
	
	@GetMapping
	public ResponseEntity<List<Planta>> listarTodos() {
		
        List<Planta> plantas = service.listarPublicas();
        return ResponseEntity.ok(plantas);
	}
	
	@GetMapping("/{id}")
    public ResponseEntity<Planta> buscarPorId(@PathVariable Long id) {
		
		Planta planta = service.buscarPorId(id);
		if (!Boolean.TRUE.equals(planta.getPublica())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		
		return ResponseEntity.ok(planta);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Planta> atualizar(@PathVariable Long id, @RequestBody Planta plantaAtualizada, HttpSession session) {
		requirePlantOwner(id, session);
		
		Planta planta = service.atualizar(id, plantaAtualizada);
		
		return ResponseEntity.ok(planta);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id, HttpSession session) {
		requirePlantOwner(id, session);
		
		service.deletar(id);
		
		return ResponseEntity.noContent().build();
	}

	private Long currentUserId(HttpSession session) {
		Object id = session.getAttribute("smartplantUserId");
		if (!(id instanceof Long userId)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		return userId;
	}

	private void requireOwner(Long owner, HttpSession session) {
		if (!owner.equals(currentUserId(session))) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
	}

	private void requirePlantOwner(Long id, HttpSession session) {
		Planta plant = service.buscarPorId(id);
		if (plant.getUsuario() == null || plant.getUsuario().getId() == null) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}
		requireOwner(plant.getUsuario().getId(), session);
	}

}
