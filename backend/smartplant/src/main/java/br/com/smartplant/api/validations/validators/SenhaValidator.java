package br.com.smartplant.api.validations.validators;

import br.com.smartplant.api.validations.annotations.Senha;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class SenhaValidator implements ConstraintValidator<Senha, String> {

	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		 
		if (value == null) {
			return true;
		}
		
		String regex = "^(?=.*[A-Z])(?=.*\\\\d)(?=.*[@$!%*?&])[A-Za-z\\\\d@$!%*?&]{8}$";
		
		return value.matches(regex);
	}
}
