package br.com.smartplant.api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_planta")
public class Planta {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "nome_planta", nullable = false, length = 70)
	private String nomePlanta;

	@Column(name = "especie", nullable = false, length = 30)
	private String especie;

	@JoinColumn()
	private Categoria categoriaPlanta;

	public Planta() {

	}

	public Planta(String nomePlanta, Categoria categoriaPlanta, String especie) {

		this.nomePlanta = nomePlanta;
		this.categoriaPlanta = categoriaPlanta;
		this.especie = especie;
	}


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNomePlanta() {
		return nomePlanta;
	}

	public void setNomePlanta(String nomePlanta) {
		this.nomePlanta = nomePlanta;
	}

	public Categoria getCategoriaPlanta() {
		return categoriaPlanta;
	}

	public void setCategoriaPlanta(Categoria categoriaPlanta) {
		this.categoriaPlanta = categoriaPlanta;
	}

	public String getEspecie() {
		return especie;
	}

	public void setEspecie(String especie) {
		this.especie = especie;
	}

}
