import os
from openai import AzureOpenAI
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()
API_KEY = os.getenv("KEY_CHAT")
ENDPOINT = os.getenv("ENDPOINT_CHAT")

endpoint = ENDPOINT
model_name = "gpt-4.1-mini"
deployment = "gpt-4.1-mini"

subscription_key = API_KEY
api_version = "2024-12-01-preview"

client = AzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    api_key=subscription_key,
)

response = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": "Você é um assistente de IA que ajuda a responder perguntas e fornecer informações úteis. Você deve ser educado, útil e fornecer respostas precisas em português brasileiro.",
        },
        {
            "role": "user",
            "content": "Cite um conto infantil famoso no Brasil?",
        }
    ],
    max_completion_tokens=800,
    temperature=1.0,
    top_p=1.0,
    frequency_penalty=0.0,
    presence_penalty=0.0,
    model=deployment
)

print(response.choices[0].message.content)


