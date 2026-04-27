import ollama
import json
import re
from datetime import datetime

class FinanceAgent:
    def __init__(self, model="llama3.1:8b"):
        self.model = model

    def parse_input(self, user_text):
        today = datetime.now().strftime("%Y-%m-%d")
        
        system_prompt = f"""
        Você é um assistente financeiro. Sua missão é classificar a intenção do usuário em 'transacao' ou 'meta'.
        Data de hoje: {today}.

        REGRAS:
        1. Se for 'transacao' (gasto/receita), use o formato JSON:
           {{"tipo_input": "transacao", "valor": float, "descricao": string, "categoria": string, "data": "YYYY-MM-DD", "tipo": "despesa" | "receita"}}
        
        2. Se for 'meta' (ex: "Minha meta para X é Y" ou "Quero gastar no máximo Z em W"), use o formato JSON:
           {{"tipo_input": "meta", "categoria": string, "valor": float}}

        Categorias sugeridas: Alimentação, Transporte, Lazer, Saúde, Moradia, Educação, Mercado, Outros.
        Responda APENAS o JSON.
        """
        try:
            response = ollama.generate(
                model=self.model,
                system=system_prompt,
                prompt=f"Converta para JSON: {user_text}"
            )
            
            # Extrair JSON usando regex para evitar poluição de texto da LLM
            json_match = re.search(r'\{.*\}', response['response'], re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return None
        except Exception as e:
            print(f"Erro no Agente: {e}")
            return None
    
    def gerar_dicas_economia(self, resumo_gastos):
        """
        Gera dicas estritamente baseadas na categoria e itens fornecidos.
        """
        prompt = f"""
        Você é um Analista de Dados Financeiros. 
        Sua tarefa é dar conselhos baseados EXCLUSIVAMENTE nos dados fornecidos abaixo.
        
        DADOS DE GASTOS:
        {resumo_gastos}
        
        REGRAS:
        1. NÃO sugira nada sobre categorias que não estão nos DADOS acima (ex: se não houver transporte nos dados, não fale de transporte).
        2. Analise os ITENS específicos listados.
        3. Dê 2 ou 3 dicas práticas e curtas.
        4. Responda em português de forma direta.

        CONSELHO:
        """

        try:
            # Usando o parâmetro system para reforçar o comportamento (se o modelo suportar)
            response = ollama.generate(
                model=self.model, 
                system="Você é um assistente que nunca inventa informações fora do contexto fornecido.",
                prompt=prompt
            )
            return response['response']
        except Exception as e:
            return "Erro ao processar dicas."