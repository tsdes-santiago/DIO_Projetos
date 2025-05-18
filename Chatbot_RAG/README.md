<h1>
<a href="https://www.dio.me/">
     <img align="center" width="40px" src="https://hermes.digitalinnovation.one/assets/diome/logo-minimized.png"></a>
    <span> Projeto Chatbot com memória e RAG</span>
</h1>

# :computer: Criando um Copiloto com Fluxo de Conversa Personalizado no Microsoft Copilot Studio


A proposta original desse projeto era criar um chatbot para dicas de viagens usando o Microsoft copilot Studio, customizando um tópico e personalizando mensagem de erro. 

Como não tenho acesso ao Copilot Studio por não ter uma conta de estudante nem corporativa, vou desenvolver um chatbot com memória com base em inteligência artificial e utilizando dados de um arquivo PDF. Esse projeto vai um pouco além do [Projeto anterior de chatbot com memória](https://github.com/tsdes-santiago/DIO_Projetos/tree/main/Chatbot_memoria) ao adicionar o RAG.

# :bulb: Solução do desafio

Para solução do desafio utilizaremos o deepseek como guia para a programação. Rodaremos um modelo de LLM local com o ollama e desenvolveremos o chatbot usando langchain. 

Utilizaremos como fonte de dados [um guia de viagens para famílias.](https://retomada.turismo.gov.br/wp-content/uploads/2020/12/Guia-Fami%CC%81lia_V3_menor.pdf)

## Instalando modelo LLM local com ollama

```console
$ ollama pull llama3:8b-instruct-q4_K_M  # Versão quantizada recomendada para eficiência
```
## Iniciar o servidor Ollama
```console
$ ollama serve
```
## Instalando dependências  
```console
$ pip install pypdf langchain-community langchain-core langchain-text-splitters langchain-ollama faiss-cpu
```

## Executando o chat

O código completo para o chatbot se encontra  no arquivo `chat_rag.py` 

O PDF é carregado e o template  para o comportamento  da LLM definido no trecho de código:

```python
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
```

O chat foi executado no terminal.

```console
$ python chat_rag.py
```

> **🌍 Viajero - Assistente de Viagens Baseado em PDF 🌍**
>
> **Base de conhecimento: Carregada com sucesso
> Digite 'sair' a qualquer momento para encerrar.**
> 
> 
> **Viajante:** Gostaria de dicas de viagem para Paris
> 
> **Viajero:** Desculpe, não tenho informações sobre Paris em meu banco de dados. No entanto, posso sugerir outros destinos que você possa estar procurando.
> 
> Mas, se você está procurando por dicas de viagem em geral, eu posso ajudá-lo com isso!
> 
> **Viajante:** O que posso fazer em Brasília?
> 
> **Viajero:** Petrópolis! Um destino charmoso e rico em história, localizado apenas 72 km da capital carioca.
> 
> Em Petrópolis, você pode desfrutar de uma experiência única ao redescobrir o Brasil em família. A cidade oferece uma arquitetura, cultura e história únicas, cercada pela beleza da Mata Atlântica. Alguns dos passeios favoritos incluem:
> 
> * O Palácio Rio Negro, a Casa da Ipiranga e o Palácio de Cristal
> * A Casa de Santos Dumont, conhecida como "encantada", que reúne invenções do Pai da Aviação
> 
> Logo na entrada da cidade, você pode avistar o belo Palácio Quitandinha, um cassino nos anos 1940. Além disso, é recomendável visitar o Parque Nacional da Serra dos Órgãos, onde podem ser encontrados guias especializados em rotas para família.
> 
> Além disso, Petrópolis oferece diversas opções de atividades, como:
> 
> * Banho de cachoeira
> * Visitas culturais
> * Arvorismo e balonismo (com responsabilidade, é claro!)
> 
> Para mais informações sobre Petrópolis e suas ofertas turísticas, eu recomendo visitar os seguintes sites:
> 
> * www.minasgerais.com.br
> * www.inhotim.org.br
> 
> E não esqueça: viaje com responsabilidade e redescubra o Brasil!
> 
> **Viajante:** Dicas de viagem para Brasília - DF
> 
> **Viajero:** Desculpe, mas você está procurando dicas de viagem para Brasília, que é a capital federal do Brasil. No entanto, Petrópolis é um destino charmoso e rico em história localizado apenas 72 km da capital carioca.
> 
> Em Petrópolis, você pode desfrutar de uma experiência única ao redescobrir o Brasil em família. A cidade oferece uma arquitetura, cultura e história únicas, cercada pela beleza da Mata Atlântica. Alguns dos passeios favoritos incluem:
> 
> * O Palácio Rio Negro, a Casa da Ipiranga e o Palácio de Cristal
> * A Casa de Santos Dumont, conhecida como "encantada", que reúne invenções do Pai da Aviação
> 
> Logo na entrada da cidade, você pode avistar o belo Palácio Quitandinha, um cassino nos anos 1940. Além disso, é recomendável visitar o Parque Nacional da Serra dos Órgãos, onde podem ser encontrados guias especializados em rotas para família.
> 
> Além disso, Petrópolis oferece diversas opções de atividades, como:
> 
> * Banho de cachoeira
> * Visitas culturais
> * Arvorismo e balonismo (com responsabilidade, é claro!)
> 
> Para mais informações sobre Petrópolis e suas ofertas turísticas, eu recomendo visitar os seguintes sites:
> 
> * www.minasgerais.com.br
> * www.inhotim.org.br
> 
> E não esqueça: viaje com responsabilidade e redescubra o Brasil!
> 
> **Viajante:** sair
> 
> Até logo! Boas viagens! ✈️

## Comportamento do LLM

Podemos ver que a resposta foi satisfatória quando perguntamos sobre um destino não presente no PDF:

> **Viajero:** Desculpe, não tenho informações sobre Paris em meu banco de dados. No entanto, posso sugerir outros destinos que você possa estar procurando.

Porém, o LLM alucinou quando perguntei sobre Brrasília, oferecendo dicas para Petrópolis.  

>**Viajante:** O que posso fazer em Brasília?
> 
> **Viajero:** Petrópolis! Um destino charmoso e rico em história, localizado apenas 72 km da capital carioca.

Mesmo perguntando novamente o LLM insistiu em Petrópolis...

> **Viajante:** Dicas de viagem para Brasília - DF
> 
> **Viajero:** Desculpe, mas você está procurando dicas de viagem para Brasília, que é a capital federal do Brasil. No entanto, Petrópolis é um destino charmoso e rico em história localizado apenas 72 km da capital carioca.

Esse comportamento pode ser minimizado se mudarmos parâmetros do modelo, como temperatura igual a zero, para reduzir alucinações. Ou usando o Microsoft Copilot Studio com fluxo de conversa com base em regras, sem o uso de IA.