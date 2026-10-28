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
	
	@Column(name = "descricao", nullable = false, length = 150)
	private String descricao;

	@ManyToOne
    @JoinColumn(name = "nome_especie")
	private Especie nomeEspecie;
	
	@ManyToOne
	@JoinColumn(name = "id_usuario")
	@JsonBackReference
	private Usuario usuario;

	public Planta() {

	}


	public Planta(Long id, String nomePlanta, String url, String descricao, Especie nomeEspecie, Usuario usuario) {
		this.id = id;
		this.nomePlanta = nomePlanta;
		this.url = url;
		this.descricao = descricao;
		this.nomeEspecie = nomeEspecie;
		this.usuario = usuario;
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


	public String getUrl() {
		return url;
	}


	public void setUrl(String url) {
		this.url = url;
	}


	public String getDescricao() {
		return descricao;
	}


	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}


	public Especie getNomeEspecie() {
		return nomeEspecie;
	}


	public void setNomeEspecie(Especie nomeEspecie) {
		this.nomeEspecie = nomeEspecie;
	}


	public Usuario getUsuario() {
		return usuario;
	}


	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	
	
}
