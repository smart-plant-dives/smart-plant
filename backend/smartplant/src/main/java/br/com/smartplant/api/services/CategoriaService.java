package br.com.smartplant.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.smartplant.api.entities.Categoria;
import br.com.smartplant.api.repositories.CategoriaRepository;

@Service
public class CategoriaService {
	
	@Autowired
	private CategoriaRepository repository;
	
	public List<Categoria> listarTodos(){
		return repository.findAll();
	}
	
	public Categoria buscarPorID(Long id) {
		Categoria categoria = repository.findById(id).orElse(null);
		
		return categoria;
	}
	
	public Categoria salvar(Categoria categoria) {
		return repository.save(categoria);
	}
		
	
		public Categoria atualizar(Long id, Categoria cNova) {
		    Categoria cVelha = repository.findById(id).get();

		   cVelha.setNomeCategoria(cNova.getNomeCategoria());

		    return repository.save(cVelha);
		
	}
		
		public String deletar(Long id) {
			Categoria categoria = buscarPorID(id);
			
			repository.delete(categoria);
			
			return "Categoria" + id + "foi excluída";
		}

}
