package br.com.smartplant.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.smartplant.api.entities.Especie;

public interface EspecieRepository extends JpaRepository<Especie, Long> {
	
	Especie findByNomeEspecie(String nomeEspecie);

}
