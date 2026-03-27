package br.com.smartplant.api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "tb_usuario")
public class Usuario {
	
	@NotBlank(message = "O nome é obrigatório")
	private String nome;
	
	@Email(message = "Email Inválido")
	private String email;
	
	private String senha;

}
