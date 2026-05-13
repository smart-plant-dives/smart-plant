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
public class Categoria {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@OneToMany(mappedBy = "tb_planta")
	private List<Planta> planta;
	
	@NotBlank(message = "O nome de categoria não pode estar vazio.")
	@Column(name = "nome_categoria", nullable = false, unique = true)
	private String nomeCategoria;
	
	public Categoria() {
		
	}
	
	public Categoria(String nomeCategoria) {
		this.nomeCategoria = nomeCategoria;
		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNomeCategoria() {
		return nomeCategoria;
	}

	public void setNomeCategoria(String nomeCategoria) {
		this.nomeCategoria = nomeCategoria;
	}
	
	
	
	

}
