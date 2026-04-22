package br.com.smartplant.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.smartplant.api.entities.Planta;

public interface PlantaRepository extends JpaRepository<Planta, Long> {

}
