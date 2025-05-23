from openai import AzureOpenAI
import os
from dotenv import load_dotenv


# Carregar variáveis de ambiente
load_dotenv()

API_KEY = os.getenv("KEY_TEXT2IMAGE")
ENDPOINT = os.getenv("ENDPOINT_TEXT2IMAGE")

endpoint = ENDPOINT
# Configurar cliente Azure OpenAI
client = AzureOpenAI(
    api_version="2025-04-01-preview",  # Verifique a versão mais recente da API
    api_key=API_KEY,
    azure_endpoint=endpoint
)

# Função para gerar imagem
def gerar_imagem(descricao):
    response = client.images.generate(
        model="dalle-3",
        prompt=descricao,
        n=1,
        size="1024x1024"
    )
    return response.data[0].url

print(gerar_imagem("Um tatu cobrando penalti com uma tartatuga de goleiro no meio da floresta amazônica"))
