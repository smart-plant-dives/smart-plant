package br.com.smartplant.api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tb_usuario")
public class Usuario {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "O nome é obrigatório.")
	@Size(min = 5, max = 20, message = "O nome de usuário deve ser entre 5 a 20 caracteres.")
	@Column(name = "nome_usuario", nullable = false, unique = true)
	private String nomeUsuario;

	@Email(message = "E-mail Inválido")
	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@NotBlank(message = "A senha é obrigatória.")
	@Column(name = "senha", nullable = false)
	private String senha;

	public Usuario() {

	}

	public Usuario(Long id, String nomeUsuario, String email, String senha) {
		this.id = id;
		this.nomeUsuario = nomeUsuario;
		this.email = email;
		this.senha = senha;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNomeUsuario() {
		return nomeUsuario;
	}

	public void setNomeUsuario(String nomeUsuario) {
		this.nomeUsuario = nomeUsuario;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

}
