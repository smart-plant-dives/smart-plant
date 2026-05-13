package br.com.smartplant.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.smartplant.api.entities.Planta;
import br.com.smartplant.api.repositories.PlantaRepository;

@Service
public class PlantaService {
	
	@Autowired
	private PlantaRepository repository;
	
	
	public List<Planta> listarTodos(){
		return repository.findAll();
	}
	
	public Planta buscarPorID(Long id) {
		Planta planta = repository.findById(id).orElse(null);
		
		return planta;
	}
	
	public Planta salvar(Planta planta) {
		return repository.save(planta);
	}
		
	
		public Planta atualizar(Long id, Planta pNova) {
		    Planta pVelha = repository.findById(id).get();

		    pVelha.setNomePlanta(pNova.getNomePlanta());
		    pVelha.setEspecie(pNova.getEspecie());
		    pVelha.setNomeCategoria(pNova.getNomeCategoria());

		    return repository.save(pVelha);
		
	}
		
		public String deletaR(Long id) {
			Planta planta = buscarPorID(id);
			
			repository.delete(planta);
			
			return "Planta com o ID" + id + "foi excluído";
		}
	
}
