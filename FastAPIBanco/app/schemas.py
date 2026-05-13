from pydantic import BaseModel, Field, field_validator
from .utils import is_valid_cpf
from decimal import Decimal # Adicione esta importação

class UserCreate(BaseModel):
    cpf: str
    full_name: str
    password: str

    @field_validator('cpf')
    @classmethod
    def validate_cpf(cls, v: str) -> str:
        if not is_valid_cpf(v):
            raise ValueError('CPF Inválido')
        return "".join(filter(str.isdigit, v))
    
from pydantic import BaseModel, Field, field_validator
from .utils import is_valid_cpf

class TransactionCreate(BaseModel):
    amount: Decimal = Field(
        ..., 
        gt=0, 
        example=150.50,
        description="O valor da transação deve ser estritamente maior que zero."
    )