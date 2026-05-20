package br.com.smartplant.api.validations.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import br.com.smartplant.api.validations.validators.SenhaValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = SenhaValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Senha {
	
	String message() default "Senha Inválida.";
	
	Class<?>[] groups() default {};
	
	Class<? extends Payload>[] payload() default{};

}
