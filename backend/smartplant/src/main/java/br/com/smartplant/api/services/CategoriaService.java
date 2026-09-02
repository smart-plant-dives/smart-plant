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
	
	public Categoria salvar(Categoria categoria) {
		
	Categoria categoriaExistente = repository.findByNomeCategoria(categoria.getNomeCategoria());
	
	if (categoriaExistente != null) {
		throw new RuntimeException("Categoria já existente");
		
	}
	
	return repository.save(categoria);
	}
	
	public List<Categoria> listarTodos(){
		return repository.findAll();
	}
	
	
	
	public Categoria buscarPorID(Long id) {
		return repository.findById(id).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
	}
	
	
	public Categoria atualizar(Long id, Categoria categoriaNova) {
		Categoria categoriaAntiga = buscarPorID(id);
		
		if (categoriaNova.getNomeCategoria() != null && ! categoriaNova.getNomeCategoria().isBlank()) {
			categoriaAntiga.setNomeCategoria(categoriaNova.getNomeCategoria());
		}
		
		return repository.save(categoriaAntiga);
	}

		
		public void deletar(Long id) {
			Categoria categoria = buscarPorID(id);
			
			repository.delete(categoria);
		}

}
	

