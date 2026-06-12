package br.com.smartplant.api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.smartplant.api.entities.Planta;

public interface PlantaRepository extends JpaRepository<Planta, Long> {

	Planta findByNomePlanta(String nomePlanta);
	
	List<Planta> findByUsuarioId(Long idUsuario);

}
