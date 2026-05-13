import enum
from datetime import datetime
from sqlalchemy import String, Integer, Numeric, ForeignKey, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base

# Definindo os papéis do sistema
class UserRole(str, enum.Enum):
    GERENTE = "gerente"
    CLIENTE = "cliente"

class TransactionType(str, enum.Enum):
    DEPOSITO = "deposito"
    SAQUE = "saque"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    cpf: Mapped[str] = mapped_column(String(11), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.CLIENTE)

    # Relacionamento: Um usuário pode ter uma conta (ou mais, se desejar expandir)
    account: Mapped["Account"] = relationship("Account", back_populates="owner", cascade="all, delete-orphan")

class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    agency: Mapped[str] = mapped_column(String(4))
    account_number: Mapped[str] = mapped_column(String(10), unique=True)
    balance: Mapped[float] = mapped_column(Numeric(precision=10, scale=2), default=0.0)

    owner: Mapped["User"] = relationship("User", back_populates="account")
    transactions: Mapped[list["Transaction"]] = relationship("Transaction", back_populates="account")

class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"))
    type: Mapped[TransactionType] = mapped_column(Enum(TransactionType))
    amount: Mapped[float] = mapped_column(Numeric(precision=10, scale=2))
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    account: Mapped["Account"] = relationship("Account", back_populates="transactions")