from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .auth import verify_password, create_access_token
from jose import jwt, JWTError

# Importando do mesmo diretório
from .database import engine, Base, get_db
from .models import User, UserRole, Account, Transaction
from .auth import role_checker
from .schemas import UserCreate
from .auth import get_password_hash
from .utils import generate_account_number, generate_agency, is_valid_cpf
from sqlalchemy.orm import selectinload

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Isso cria as tabelas no banco de dados assim que a API sobe
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="API Bancária Assíncrona", lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Sistema Bancário Online"}

@app.post("/setup/gerente-inicial", status_code=status.HTTP_201_CREATED)
async def create_initial_manager(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. Verifica se já existe QUALQUER gerente no sistema
    query = select(User).where(User.role == UserRole.GERENTE)
    result = await db.execute(query)
    existing_manager = result.scalars().first()

    if existing_manager:
        raise HTTPException(
            status_code=400, 
            detail="O sistema já possui um gerente configurado."
        )

    # 2. Cria o novo gerente
    new_manager = User(
        cpf=user_data.cpf,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
        role=UserRole.GERENTE
    )

    db.add(new_manager)
    await db.commit()
    await db.refresh(new_manager)

    return {"message": "Gerente inicial criado com sucesso!", "user": new_manager.full_name}

# Configuração para o Swagger entender que a API usa Token
#oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # O form_data.username aqui será o CPF do usuário
    query = select(User).where(User.cpf == form_data.username)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="CPF ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Criamos o token incluindo o CPF e o Papel (Role) do usuário
    access_token = create_access_token(data={"sub": user.cpf, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/gerente/cadastrar-cliente", status_code=status.HTTP_201_CREATED)
async def register_customer(
    user_data: UserCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(role_checker([UserRole.GERENTE]))
):
    # 1. Verifica se o CPF já existe
    query_cpf = select(User).where(User.cpf == user_data.cpf)
    result = await db.execute(query_cpf)
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Este CPF já está cadastrado.")

    # 2. Cria o objeto do novo Cliente
    new_client = User(
        cpf=user_data.cpf,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
        role=UserRole.CLIENTE
    )
    db.add(new_client)
    
    # O flush serve para o banco gerar o ID do new_client sem fechar a transação
    await db.flush() 

    # 3. Cria a Conta Corrente vinculada ao ID do novo cliente
    new_account = Account(
        user_id=new_client.id,
        agency=generate_agency(),
        account_number=generate_account_number(),
        balance=0.0
    )
    db.add(new_account)
    
    # 4. AGORA SIM: Comita as duas operações no banco
    await db.commit()
    await db.refresh(new_client)

    return {
        "status": "sucesso",
        "cliente": new_client.full_name,
        "conta": new_account.account_number
    }

@app.get("/gerente/clientes")
async def list_clients(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(role_checker([UserRole.GERENTE]))
):
    # O selectinload carrega os dados da conta junto com o usuário em uma única busca eficiente
    query = select(User).where(User.role == UserRole.CLIENTE).options(selectinload(User.account))
    result = await db.execute(query)
    clientes = result.scalars().all()
    
    return [
        {
            "id": c.id,
            "nome": c.full_name,
            "cpf": c.cpf,
            "conta": c.account.account_number if c.account else "Sem conta",
            "saldo": float(c.account.balance) if c.account else 0.0
        } for c in clientes
    ]

@app.get("/cliente/extrato")
async def get_statement(
    current_user: User = Depends(role_checker([UserRole.CLIENTE])),
    db: AsyncSession = Depends(get_db)
):
    # 1. Localiza a conta do cliente logado
    query_account = select(Account).where(Account.user_id == current_user.id)
    res_acc = await db.execute(query_account)
    account = res_acc.scalars().first()

    # 2. Busca todas as transações dessa conta
    query_trans = select(Transaction).where(Transaction.account_id == account.id).order_by(Transaction.timestamp.desc())
    res_trans = await db.execute(query_trans)
    transactions = res_trans.scalars().all()

    return {
        "cliente": current_user.full_name,
        "saldo_atual": float(account.balance),
        "transacoes": [
            {
                "tipo": t.type,
                "valor": float(t.amount),
                "data": t.timestamp.strftime("%d/%m/%Y %H:%M:%S")
            } for t in transactions
        ]
    }

@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = None
    
    # 1. Tenta buscar por CPF (se o username tiver 11 dígitos)
    clean_username = "".join(filter(str.isdigit, form_data.username))
    
    if len(clean_username) == 11:
        query = select(User).where(User.cpf == clean_username)
        result = await db.execute(query)
        user = result.scalars().first()
    
    # 2. Se não achou por CPF, tenta buscar por Agência/Conta (formato: 0001-123456-7)
    if not user and "-" in form_data.username:
        try:
            agencia, conta = form_data.username.split("-", 1)
            query = select(User).join(Account).where(
                Account.agency == agencia, 
                Account.account_number == conta
            )
            result = await db.execute(query)
            user = result.scalars().first()
        except ValueError:
            pass # Formato inválido

    # 3. Validação final
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.cpf, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

from .models import Transaction, TransactionType, Account
from .schemas import TransactionCreate # Crie este schema no schemas.py (valor: float)

@app.post("/cliente/deposito")
async def deposit(
    data: TransactionCreate, 
    current_user: User = Depends(role_checker([UserRole.CLIENTE])),
    db: AsyncSession = Depends(get_db)
):
    # 1. Busca a conta vinculada ao usuário logado
    query = select(Account).where(Account.user_id == current_user.id)
    result = await db.execute(query)
    account = result.scalars().first()

    # 2. Atualiza o saldo e registra a transação
    account.balance += data.amount
    new_trans = Transaction(
        account_id=account.id,
        type=TransactionType.DEPOSITO,
        amount=data.amount
    )
    db.add(new_trans)
    await db.commit()

    return {"message": "Depósito concluído", "saldo_atual": float(account.balance)}

@app.post("/cliente/saque")
async def withdraw(
    data: TransactionCreate, 
    current_user: User = Depends(role_checker([UserRole.CLIENTE])),
    db: AsyncSession = Depends(get_db)
):
    query = select(Account).where(Account.user_id == current_user.id)
    result = await db.execute(query)
    account = result.scalars().first()

    # Validação de segurança: Não permite saldo negativo
    if account.balance < data.amount:
        raise HTTPException(status_code=400, detail="Saldo insuficiente para esta operação.")

    account.balance -= data.amount
    new_trans = Transaction(
        account_id=account.id,
        type=TransactionType.SAQUE,
        amount=data.amount
    )
    db.add(new_trans)
    await db.commit()

    return {"message": "Saque realizado com sucesso", "saldo_atual": float(account.balance)}