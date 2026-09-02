package br.com.smartplant.api.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import br.com.smartplant.api.enuns.TipoUsuario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "tb_usuario")
public class Usuario {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;
    
    @NotBlank(message = "O nome é obrigatório.")
    @Column(name = "nome_usuario",nullable = false, length = 100)
    private String nome;
    
    @NotBlank(message = "O logion é obrigatório.")
    @Column(nullable = false, unique = true, length = 50)
    private String login;
    
    @NotBlank(message = "O email é obrigatório.")
    @Email(message = "Email inválido.")
    private String email;
    
    @NotBlank(message = "A senha é obrigatória.")
    @Column(nullable = false)
    private String senha;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario", nullable = false)
    private TipoUsuario tipoUsuario;
    
    @OneToMany(mappedBy = "usuario")
    @JsonManagedReference
    private List<Planta> plantas;
    
    public Usuario() {
        
    }
    
    public Usuario(String nome, String login, String email, String senha, TipoUsuario tipoUsuario) {
        this.nome = nome;
        this.login = login;
        this.email = email;
        this.senha = senha;
        this.tipoUsuario = tipoUsuario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public TipoUsuario getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(TipoUsuario tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public List<Planta> getPlantas() {
	    return plantas;
	}

	public void setPlantas(List<Planta> plantas) {
	    this.plantas = plantas;
	}
    
    
    
    

}