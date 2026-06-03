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
		
		public Planta salvar(Planta planta) {

		    if (planta.getNomePlanta() == null || planta.getNomePlanta().isBlank()) {
		        throw new RuntimeException("O nome da planta é obrigatório.");
		    }

		    if (planta.getEspecie() == null || planta.getEspecie().isBlank()) {
		        throw new RuntimeException("A espécie da planta é obrigatória.");
		    }

		    if (planta.getNomeCategoria() == null) {
		        throw new RuntimeException("A categoria da planta é obrigatória.");
		    }

		    return repository.save(planta);
		}
		
		public List<Planta> listarTodos() {
			return repository.findAll();
		}
		
		public Planta buscarPorId(Long id) {
			return repository.findById(id).orElseThrow(() -> new RuntimeException("Categoria com o ID" + id + "não encontrado"));
		}
		
		public Planta atualizar(Long id, Planta plantaNova) {
			
			Planta plantaAntiga = buscarPorId(id);
			
			if(plantaNova.getNomePlanta() != null && plantaNova.getNomePlanta().isBlank()) {
				plantaAntiga.setNomePlanta(plantaNova.getNomePlanta());
			}
			
			if(plantaNova.getEspecie() != null && plantaNova.getEspecie().isBlank()) {
				plantaAntiga.setEspecie(plantaNova.getEspecie());
			}
			
			if(plantaNova.getNomeCategoria() != null) {
				plantaAntiga.setNomeCategoria(plantaNova.getNomeCategoria());
			}
			
			return repository.save(plantaAntiga);
			
			
		}
		
		public void deletar(Long id) {
			Planta planta = buscarPorId(id);
			
			repository.delete(planta);
		}
	

}		