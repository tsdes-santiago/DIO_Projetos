from langchain_community.llms import Ollama
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.messages import HumanMessage, AIMessage
from langchain_ollama import OllamaEmbeddings  # Importação correta para embeddings
import os

# 1. Verificar e instalar dependências necessárias
try:
    from langchain_ollama import OllamaEmbeddings
except ImportError:
    print("Instalando pacote langchain-ollama...")
    os.system("pip install -U langchain-ollama")
    from langchain_ollama import OllamaEmbeddings

# 2. Carregar o PDF com informações de viagem
def load_pdf_knowledge(pdf_path):
    try:
        loader = PyPDFLoader(pdf_path)
        pages = loader.load()
        
        # Dividir o texto em chunks menores
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        docs = text_splitter.split_documents(pages)
        
        # Criar vetorstore com embeddings atualizados
        embeddings = OllamaEmbeddings(model="llama3:8b-instruct-q4_K_M")
        vectorstore = FAISS.from_documents(docs, embeddings)
        return vectorstore
    except Exception as e:
        print(f"Erro ao carregar PDF: {e}")
        return None

# 3. Configuração do sistema
pdf_path = "Guia-Família_V3_menor.pdf"  # Substitua pelo seu arquivo PDF
knowledge_base = load_pdf_knowledge(pdf_path)

# Configurar LLM
llm = Ollama(
    model="llama3:8b-instruct-q4_K_M",
    temperature=0.7
)

# 4. Configuração do prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", """Você é um assistente de viagens chamado Viajero. Responda com base nas informações fornecidas e no histórico da conversa.

INFORMAÇÕES RELEVANTES DO PDF:
{context}

Siga estas regras:
1. Se o destino não estiver no PDF, diga: "Desculpe, não tenho informações sobre esse destino em meu banco de dados."
2. Se encontrar o destino, forneça detalhes úteis e relevantes
3. Mantenha um tom amigável e profissional"""),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

# 5. Função para busca semântica no PDF
def search_in_pdf(query):
    try:
        if knowledge_base:
            docs = knowledge_base.similarity_search(query, k=3)
            return "\n---\n".join([doc.page_content for doc in docs])
        return "Base de conhecimento não disponível"
    except Exception as e:
        print(f"Erro na busca: {e}")
        return "Erro ao acessar base de conhecimento"

# 6. Chatbot principal
def travel_chatbot():
    print("🌍 Viajero - Assistente de Viagens Baseado em PDF 🌍")
    print(f"Base de conhecimento: {'Carregada com sucesso' if knowledge_base else 'Não disponível'}")
    print("Digite 'sair' a qualquer momento para encerrar.\n")
    
    # Inicializar histórico de chat
    chat_history = ChatMessageHistory()
    
    while True:
        user_input = input("\nViajante: ").strip()
        
        if user_input.lower() in ['sair', 'exit', 'quit']:
            print("\nAté logo! Boas viagens! ✈️")
            break
            
        # Buscar informações relevantes no PDF
        context = search_in_pdf(user_input)
        
        # Verificar se encontrou informações
        if "não tenho informações" in context.lower() or len(context) < 30:
            print("\nViajero: Desculpe, não encontrei informações sobre esse destino no meu guia.")
            print("Posso ajudar com outros destinos ou com dicas gerais de viagem?")
            continue
            
        # Criar e executar a cadeia de processamento
        chain = (
            RunnablePassthrough.assign(
                context=lambda x: context,
                chat_history=lambda x: chat_history.messages
            )
            | prompt
            | llm
            | StrOutputParser()
        )
        
        response = chain.invoke({"input": user_input})
        
        # Atualizar histórico
        chat_history.add_user_message(user_input)
        chat_history.add_ai_message(response)
        
        print("\nViajero:", response)

if __name__ == "__main__":
    travel_chatbot()