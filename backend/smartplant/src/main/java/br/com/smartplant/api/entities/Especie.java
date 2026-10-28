package br.com.smartplant.api.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "tb_categoria")
public class Especie {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@OneToMany(mappedBy = "nomeEspecie")
	private List<Planta> planta;
	
	@NotBlank(message = "O nome de espécie não pode estar vazio.")
	@Column(name = "nome_especie", nullable = false, unique = true)
	private String nomeEspecie;
	
	public Especie() {
		
	}
	
	public Especie(String nomeEspecie) {
		this.nomeEspecie = nomeEspecie;
		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<Planta> getPlanta() {
		return planta;
	}

	public void setPlanta(List<Planta> planta) {
		this.planta = planta;
	}

	public String getNomeEspecie() {
		return nomeEspecie;
	}

	public void setNomeEspecie(String nomeEspecie) {
		this.nomeEspecie = nomeEspecie;
	}
	
	


	
	
	
	

}
