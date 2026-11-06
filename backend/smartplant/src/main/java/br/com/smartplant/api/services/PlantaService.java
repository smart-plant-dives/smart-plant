package br.com.smartplant.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.smartplant.api.entities.Planta;
import br.com.smartplant.api.entities.Usuario;
import br.com.smartplant.api.repositories.PlantaRepository;
import br.com.smartplant.api.repositories.EspecieRepository;
import br.com.smartplant.api.entities.Especie;
import br.com.smartplant.api.repositories.UsuarioRepository;

@Service
public class PlantaService {

	@Autowired
	private PlantaRepository repository;

	@Autowired
	private UsuarioRepository usuarioRepository;

    @Autowired
    private EspecieRepository especieRepository;

	public Planta salvar(Planta planta) {

		if (planta.getNomePlanta() == null || planta.getNomePlanta().isBlank()) {
			throw new RuntimeException("O nome da planta é obrigatório.");
		}


        if (planta.getNomeEspecie() == null ||
                planta.getNomeEspecie().getNomeEspecie() == null ||
                planta.getNomeEspecie().getNomeEspecie().isBlank()) {
            throw new RuntimeException("A espécie da planta é obrigatória.");
        }

        String nomeEspecie = planta.getNomeEspecie().getNomeEspecie().trim();
        Especie especie = especieRepository.findByNomeEspecie(nomeEspecie);
        if (especie == null) {
            especie = especieRepository.save(new Especie(nomeEspecie));
        }
        planta.setNomeEspecie(especie);

        if (planta.getDescricao() == null) {
            planta.setDescricao("");
        }
        if (planta.getDescricao().length() > 150) {
            throw new RuntimeException("A descrição deve ter no máximo 150 caracteres.");
        }

        return repository.save(planta);
	}

	public List<Planta> listarTodos() {
		return repository.findAll();
	}

    public List<Planta> listarPublicas() {
        return repository.findByPublicaTrueOrPublicaIsNull();
    }

	public Planta salvarParaUsuario(Long usuarioId, Planta planta) {
		Usuario usuario = usuarioRepository.findById(usuarioId)
				.orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

		planta.setUsuario(usuario);

		return salvar(planta);
	}

	public List<Planta> listarPorUsuario(Long usuarioId) {
		return repository.findByUsuarioId(usuarioId);
	}

	public Planta buscarPorId(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new RuntimeException("Categoria com o ID" + id + "não encontrado"));
	}

	public Planta atualizar(Long id, Planta plantaNova) {

		Planta plantaAntiga = buscarPorId(id);

		if (plantaNova.getNomePlanta() != null && !plantaNova.getNomePlanta().isBlank()) {
			plantaAntiga.setNomePlanta(plantaNova.getNomePlanta());
		}
		
		if (plantaNova.getDescricao()!= null && !plantaNova.getDescricao().isBlank()) {
			plantaAntiga.setDescricao(plantaNova.getDescricao());
		}

        if (plantaNova.getNomeEspecie() != null &&
                plantaNova.getNomeEspecie().getNomeEspecie() != null &&
                !plantaNova.getNomeEspecie().getNomeEspecie().isBlank()) {
            String nomeEspecie = plantaNova.getNomeEspecie().getNomeEspecie().trim();
            Especie especie = especieRepository.findByNomeEspecie(nomeEspecie);
            if (especie == null) {
                especie = especieRepository.save(new Especie(nomeEspecie));
            }
            plantaAntiga.setNomeEspecie(especie);
        }
		
		if (plantaNova.getUrl() != null) {
			plantaAntiga.setUrl(plantaNova.getUrl());
		}
        if (plantaNova.getPublica() != null) {
            plantaAntiga.setPublica(plantaNova.getPublica());
        }

		return repository.save(plantaAntiga);

	}

	public void deletar(Long id) {
		Planta planta = buscarPorId(id);

		repository.delete(planta);
	}

}