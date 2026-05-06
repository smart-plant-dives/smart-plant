package br.com.smartplant.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.smartplant.api.entities.Usuario;
import br.com.smartplant.api.repositories.UsuarioRepository;

@Service
public class UsuarioService {
	@Autowired
	private UsuarioRepository repository;
	
	public List<Usuario> listarTodos(){
		return repository.findAll();
		}
	

}
