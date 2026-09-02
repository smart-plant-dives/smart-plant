package br.com.smartplant.api.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_planta")
public class Planta {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_planta")
	private Long id;

	@Column(name = "nome_planta", nullable = false, length = 70)
	private String nomePlanta;
	
	@Column(name = "url")
	private String url;

	@Column(name = "especie", nullable = false, length = 30)
	private String especie;

	@ManyToOne
    @JoinColumn(name = "nome_categoria")
	private Categoria nomeCategoria;
	
	@ManyToOne
	@JoinColumn(name = "id_usuario")
	@JsonBackReference
	private Usuario usuario;

	public Planta() {

	}

	public Planta(String nomePlanta, String url, Categoria nomeCategoria, String especie) {

		this.nomePlanta = nomePlanta;
		this.url = url;
		this.nomeCategoria = nomeCategoria;
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

	public Categoria getNomeCategoria() {
		return nomeCategoria;
	}

	public void setNomeCategoria(Categoria nomeCategoria) {
		this.nomeCategoria = nomeCategoria;
	}

	public String getEspecie() {
		return especie;
	}

	public void setEspecie(String especie) {
		this.especie = especie;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
	public Usuario getUsuario() {
	    return usuario;
	}

	public void setUsuario(Usuario usuario) {
	    this.usuario = usuario;
	}
	
	

}
