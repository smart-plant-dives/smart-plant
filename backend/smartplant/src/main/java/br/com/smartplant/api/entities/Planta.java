package br.com.smartplant.api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name= "tb_planta")
public class Planta {
	
	private String nome;
	private String especie;
	private String caracteristica;
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getEspecie() {
		return especie;
	}
	public void setEspecie(String especie) {
		this.especie = especie;
	}
	public String getCaracteristica() {
		return caracteristica;
	}
	public void setCaracteristica(String caracteristica) {
		this.caracteristica = caracteristica;
	}
	
	
	
	

	
	

}
