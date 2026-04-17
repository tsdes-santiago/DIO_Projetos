import json
import pandas as pd
import requests
import streamlit as st

# Configuração
MODELO = 'gemma3:12b-it-qat'
OLLAMA_URL = 'http://localhost:11434/api/generate'

# Carregando os dados
# JSON
with open("../data/perfil_investidor.json") as f:
    perfil = json.load(f)
with open("../data/produtos_financeiros.json") as f:
    produtos = json.load(f)
# CSV
transacoes = pd.read_csv("../data/transacoes.csv")
historico = pd.read_csv("../data/historico_atendimento.csv")


# Montar contexto

contexto = f"""
CLIENTE: {perfil["nome"]}, {perfil["idade"]} anos, perfil {perfil["perfil_investidor"]}
OBJETIVO: {perfil["objetivo_principal"]}
PATRIMONIO: R$ {perfil["patrimonio_total"]} | RESERVA: R$ {perfil["reserva_emergencia_atual"]}
TRANSAÇÕES RECENTES: {transacoes.to_string(index=False)}
HISTÓRICO DE ATENDIMENTO: {historico.to_string(index=False)}
PRODUTOS DISPONÍVEIS: {json.dumps(produtos, indent=2, ensure_ascii=False)}
"""
print(contexto)
# System prompt

SYSTEM_PROMPT = f"""
Você é o AsFIn, um agente financeiro inteligente especializado em ensinar conceitos financeiros pessoais de forma simples e didática.

OBJETIVO: 
Ensinar conceitos financeiros pessoais de forma simples e didática, usando os dados do cliente como exemplos práticos.

REGRAS:
1. Sempre baseie suas respostas nos dados fornecidos
2. Use os dados fornecidos para dar exemplos personalizados
3. Nunca invente informações financeiras
4. Se não souber algo, admita e ofereça alternativas
5. Nunca recomende investimentos específicos, somente explique como funcionam
6. Sempre pergunte se o cliente entendeu
"""

# Chama o Ollama

def perguntar(msg):
    prompt = f"""
    {SYSTEM_PROMPT}

    Contexto do cliente:
    {contexto}
    Pergunta:
    {msg}
    """

    r = requests.post(OLLAMA_URL, json={"model": MODELO, "prompt": prompt, "stream": False})

    return r.json()["response"]

# Interface
#st.title("AsFIn - Seu assistente financeiro inteligente")

#if pergunta := st.chat_input("Digite sua dúvida sobre finanças ou investimentos"):
#    st.chat_message("user").write(pergunta)
#    with st.spinner("Pensando..."):
#        resposta = perguntar(pergunta)
#    
#    # Escapa o símbolo de cifrão para evitar renderização indesejada de LaTeX
#    resposta_formatada = resposta.replace("$", r"\$")
#    st.chat_message("assistant").write(resposta_formatada)