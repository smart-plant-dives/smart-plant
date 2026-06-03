package br.com.smartplant.api.services;

import java.math.BigDecimal;
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
		
		//EVITA PRODUTOS DUPLICADOS
        Planta plantaExistente = PlantaRepository.findByNome(planta.getNomePlanta());
        
        if (plantaExistente != null) {
            throw new RuntimeException("Já existe um produto com esse nome");
        }
        
        return PlantaRepository.save(planta);
    }

    public List<Planta> listarTodos() {
        return repository.findAll();
    }

    public Planta buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria com o ID" + id + " não encontrado."));
    }

    public Planta atualizar(Long id, Planta plantaAtualizada) {

        Planta plantaAntiga = buscarPorId(id);

        if (plantaAtualizada.getNomePlanta() != null  {
            Planta.setNomePlanta(plantaAtualizada.getNomePlanta());
        }

        if (plantaNova.getEspecie() != null && plantaNova.getEspecie().isBlank()) {
            plantaAntiga.getEspecie(plantaNova.getEspecie());
        }

        if (produtoNovo.getCategoria() != null) {
            produtoAntigo.setCategoria(produtoNovo.getCategoria());
        }

        if (produtoNovo.getDisponivel() != null && produtoNovo.getDisponivel()) {
            produtoAntigo.setDisponivel(produtoNovo.getDisponivel());
        }

        if (produtoNovo.getEstoqueMinimo() != null) {
            produtoAntigo.setEstoqueMinimo(produtoNovo.getEstoqueMinimo());
        }
        if (produtoNovo.getImagem() != null && produtoNovo.getImagem().isBlank()) {
            produtoAntigo.setImagam(produtoNovo.getImagem());
        }

        if (produtoNovo.getPreco() != null) {
            if (produtoNovo.getPreco().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("O preço não pode ser negativo");
            }
            produtoAntigo.setPreco(produtoNovo.getPreco());
        }

        if (produtoNovo.getQuantidadeEstoque() != null) {
            produtoAntigo.setQuantidadeEstoque(produtoNovo.getQuantidadeEstoque());
        }

        return repository.save(produtoAntigo);

    }

    public void deletar(Long id) {
        Planta planta = buscarPorId(id);

        repository.delete(planta);
    }

}
