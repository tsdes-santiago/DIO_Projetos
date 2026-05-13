from validate_docbr import CPF
import random

def is_valid_cpf(cpf_str: str) -> bool:
    # Remove pontos e traços caso o usuário envie formatado
    clean_cpf = "".join(filter(str.isdigit, cpf_str))
    
    validator = CPF()
    resultado = validator.validate(clean_cpf)
    
    # Debug para ver no console do Manjaro
    print(f"DEBUG: CPF recebido: {cpf_str} | Limpo: {clean_cpf} | Valido: {resultado}")
    
    return resultado

def generate_account_number() -> str:
    # Gera um número de 6 dígitos seguido de um dígito verificador
    numero = "".join([str(random.randint(0, 9)) for _ in range(6)])
    digito = random.randint(0, 9)
    return f"{numero}-{digito}"

def generate_agency() -> str:
    return "0001" # Agência padrão para o desafio
