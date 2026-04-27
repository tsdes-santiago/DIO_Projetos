from agent import FinanceAgent
from database import FinanceDB

def test_script():
    finance_agent = FinanceAgent()
    finance_db = FinanceDB()

    user_text = "Comprei um café por 7 reais no débito"
    json_data = finance_agent.parse_input(user_text)
    if json_data:
        finance_db.add_transaction(
            valor=json_data["valor"],
            descricao=json_data["descricao"],
            categoria=json_data["categoria"],
            data=json_data["data"],
            tipo=json_data["tipo"]
        )
        print("Transação salva com sucesso!")
    else:
        print("Falha ao processar a frase.")

if __name__ == "__main__":
    test_script()