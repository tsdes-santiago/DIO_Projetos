from langchain_community.llms import Ollama
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente (opcional)
load_dotenv()

# Configuração do modelo Llama 3.1 via Ollama
llm = Ollama(
    model="llama3:8b-instruct-q4_K_M",  # Use o mesmo nome que você usou no 'ollama pull'
    temperature=0.7,  # Controla a criatividade (0 = mais determinístico, 1 = mais criativo)
    top_p=0.9,
    repeat_penalty=1.1
)

# Template de prompt especializado em viagens
travel_template = """Você é um assistente especializado em viagens chamado Viajero. 
Seu conhecimento abrange destinos globais, dicas culturais, orçamentos de viagem, 
hospedagem e transporte. Seja informativo e amigável.

Histórico da conversa:
{history}

Viajante: {input}
Viajero:"""

prompt = PromptTemplate(
    input_variables=["history", "input"],
    template=travel_template
)

# Configurar memória da conversa
memory = ConversationBufferMemory(
    memory_key="history",
    return_messages=True,
    input_key="input"
)

# Criar a cadeia de conversação
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    prompt=prompt,
    verbose=True  # Mostra detalhes do processamento (opcional)
)

def main():
    print("\n🌟 Viajero - Seu Assistente Pessoal de Viagens 🌟")
    print("Digite 'sair' a qualquer momento para encerrar.\n")
    
    while True:
        user_input = input("Viajante: ")
        
        if user_input.lower() in ['sair', 'exit', 'quit']:
            print("\nAté logo! Boas viagens! ✈️🌍")
            break
            
        try:
            response = conversation.predict(input=user_input)
            print("\nViajero:", response)
            print("\n" + "-"*50 + "\n")  # Separador visual
        except Exception as e:
            print("Desculpe, ocorreu um erro:", str(e))

if __name__ == "__main__":
    main()