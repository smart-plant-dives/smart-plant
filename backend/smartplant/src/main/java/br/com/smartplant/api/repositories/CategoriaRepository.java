package br.com.smartplant.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.smartplant.api.entities.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

}
