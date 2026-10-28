package br.com.smartplant.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.smartplant.api.entities.Especie;
import br.com.smartplant.api.repositories.EspecieRepository;

@Service
public class EspecieService {
	
	@Autowired
	private EspecieRepository repository;
	
	public Especie salvar(Especie especie) {
		
	Especie especieExistente = repository.findByNomeEspecie(especie.getNomeEspecie());
	
	if (especieExistente != null) {
		throw new RuntimeException("Espécie já existente");
		
	}
	
	return repository.save(especie);
	}
	
	public List<Especie> listarTodos(){
		return repository.findAll();
	}
	
	
	
	public Especie buscarPorID(Long id) {
		return repository.findById(id).orElseThrow(() -> new RuntimeException("Espécie não encontrada"));
	}
	
	
	public Especie atualizar(Long id, Especie especieNova) {
		Especie especieAntiga = buscarPorID(id);
		
		if (especieNova.getNomeEspecie() != null && ! especieNova.getNomeEspecie().isBlank()) {
			especieAntiga.setNomeEspecie(especieNova.getNomeEspecie());
		}
		
		return repository.save(especieAntiga);
	}

		
		public void deletar(Long id) {
			Especie especie = buscarPorID(id);
			
			repository.delete(especie);
		}

}
	

