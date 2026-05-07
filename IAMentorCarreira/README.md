<h1>
<a href="https://www.dio.me/">
     <img align="center" width="40px" src="https://hermes.digitalinnovation.one/assets/diome/logo-minimized.png"></a>
    <span>IA Mentor de Carreira: Descubra Seu Futuro em Tech</span>
</h1>

# Desafio

Nesse projeto utilizaremos um modelo de LLM como planejador e assistente de carreira. Os [modelos de prompt entrevistador e planejador](https://github.com/digitalinnovationone/copilot-prompts/tree/main) foram fornecidos pelo instrutor da DIO. Estou rodado localmente com o Ollama o modelo gemma3.

```bash
$ ollama run gemma3:12b-it-qat                                   
```

Mesmo com um modelo local com menos parâmetros, obtemos uma resposta satisfatória para escolher uma profissão para transição de carreira e elaboração de um plano de estudos.
___
___
# 💬 Conversa com o Agente 1 - Entrevistador de Carreira em Tecnologia

### 💡 Assistente (IA) - Agente 1
>Olá! 👋 
>
>Sou seu entrevistador de carreira em tecnologia. Vou fazer 7 perguntas 
>rápidas para entender seu perfil e depois vou sugerir as melhores 
>carreiras para você.
>
>Preparado? Então vamos lá!
>
>Para começar: o que mais te atrai em tecnologia - resolver problemas, 
>criar produtos ou entender sistemas?

### 👤 Usuário (Eu)
> resolver problemas

### 💡 Assistente (IA) - Agente 1

>Legal! E você já tem experiência na área de tecnologia ou está começando 
>do zero?

### 👤 Usuário (Eu)
> tenho experiência em programação com python

### 💡 Assistente (IA) - Agente 1

>Entendi! Quantas horas por semana você consegue dedicar aos estudos?

### 👤 Usuário (Eu)
> 12 horas

### 💡 Assistente (IA) - Agente 1

>Perfeito! No seu dia a dia, você prefere lidar mais com pessoas, dados ou 
>código?

### 👤 Usuário (Eu)
> código

### 💡 Assistente (IA) - Agente 1

>Ótimo! Qual é seu objetivo principal: conseguir o primeiro emprego, fazer 
>transição de carreira ou crescer na função atual?

### 👤 Usuário (Eu)
> fazer transição de carreira 

### 💡 Assistente (IA) - Agente 1

>Show! Quais assuntos ou tecnologias mais despertam seu interesse? Por 
>exemplo: desenvolvimento web, dados, inteligência artificial, 
>infraestrutura...

### 👤 Usuário (Eu)
> aprendizado de máquina e inteligência artificial

### 💡 Assistente (IA) - Agente 1

>Última pergunta: você tem alguma experiência prévia (mesmo que não seja em 
>tech) que gostaria de aproveitar nessa nova jornada?

### 👤 Usuário (Eu)
> tenho doutorado em física teórica e computacional. possuo experiência com ex
> tração manual de atributos de imagens (visão computacional) e treinamento de
> modelos de machine learning convencionais usando optuna e mlflow. Tenho pouca prática com modelos de deep learning.

### 💡 Assistente (IA) - Agente 1

>Perfeito! Tenho tudo que preciso. Deixa eu analisar o melhor caminho para 
>você...
>
>Com base no seu perfil, identifiquei 3 carreiras muito promissoras:
>
>____
>🥇 1º LUGAR: Engenheiro de Machine Learning - (18/20)
>____
>
>💡 POR QUE COMBINA COM VOCÊ:
>Sua experiência em física teórica e computacional, combinada com o uso de 
>Python, Optuna e MLflow demonstra um forte background em resolução de 
>problemas e modelagem matemática - pilares importantes para a área de 
>Machine Learning. Seu interesse em aprendizado de máquina e inteligência 
>artificial, juntamente com o conhecimento em visão computacional, indicam 
>um perfil naturalmente inclinado a essa carreira.
>
>⚖️ O QUE ESPERAR:
>
>VANTAGENS:
>- Alta demanda no mercado
>- Salários atrativos
>- Oportunidade de aplicar seus conhecimentos em modelagem e otimização
>- Alinhamento com seu interesse em IA e ML
>
>DESAFIOS:
>- Curva de aprendizado íngreme em deep learning
>- Necessidade de acompanhar as últimas tendências e técnicas
>- Exigência de conhecimento em matemática e estatística
>
>📈 MERCADO:
>A área de Machine Learning está em expansão, com oportunidades em diversos 
>setores (finanças, saúde, tecnologia). A demanda por engenheiros de ML 
>qualificados é alta, mas a competição também é acirrada. (Varia por 
>região/experiência)
>
>___
>🥈 2º LUGAR: Cientista de Dados - (16/20)
>___
>
>💡 POR QUE COMBINA COM VOCÊ:
>Sua experiência em física e a familiaridade com ferramentas como Optuna e 
>MLflow são valiosas para a análise de dados e a construção de modelos 
>preditivos.  O seu doutorado demonstra habilidades analíticas e de 
>resolução de problemas que são essenciais para a ciência de dados.
>
>⚖️ O QUE ESPERAR:
>
>VANTAGENS:
>- Ampla gama de aplicações em diferentes setores
>- Oportunidade de trabalhar com grandes volumes de dados
>- Possibilidade de gerar insights e tomar decisões baseadas em evidências
>
>DESAFIOS:
>- Necessidade de lidar com dados de diferentes fontes e formatos
>- Exigência de habilidades de comunicação para apresentar resultados
>- Necessidade de atualização constante sobre novas ferramentas e técnicas
>
>📈 MERCADO:
>A área de ciência de dados está em alta, com grande demanda por 
>profissionais capazes de transformar dados em conhecimento.  (Varia por 
>região/experiência)
>
>___
>🥉 3º LUGAR: Engenheiro de Visão Computacional - (14/20)
>___
>
>💡 POR QUE COMBINA COM VOCÊ:
>Sua experiência com extração manual de atributos de imagens e o interesse 
>em machine learning combinados a um doutorado em física teórica e 
>computacional te colocam em uma ótima posição para essa área.
>
>⚖️ O QUE ESPERAR:
>
>VANTAGENS:
>- Áreas de aplicação em crescimento (veículos autônomos, diagnóstico 
>médico, etc.)
>- Possibilidade de trabalhar com tecnologias de ponta
>- Alinhamento com seu interesse em machine learning e visão computacional
>
>DESAFIOS:
>- Necessidade de conhecimento em matemática e geometria
>- Exigência de habilidades de programação e depuração
>- Necessidade de acompanhamento das últimas tendências em deep learning
>
>📈 MERCADO:
>A área de visão computacional está em expansão, impulsionada pelo 
>desenvolvimento de veículos autônomos, sistemas de segurança e outras 
>aplicações. (Varia por região/experiência)
>
>___
>
>Qual dessas carreiras te chamou mais atenção?

### 👤 Usuário (Eu)

> Engenheiro de Machine Learning

### 💡 Assistente (IA) - Agente 1

>Excelente escolha! Vou te passar para meu colega especialista em 
>Engenharia de Machine Learning. Ele vai montar todo o plano de estudos 
>personalizado para você!
>
>TRANSFERIR PARA AGENT 2 COM ESTAS INFORMAÇÕES:
>- Nome da carreira escolhida: Engenheiro de Machine Learning
>- Horas disponíveis por semana: 12
>- Nível de experiência: Alguma (Python, Optuna, MLflow, experiência com 
>modelos de ML)
>- Objetivo: Transição de carreira
>- Preferência: Código
>- Interesses técnicos mencionados: Aprendizado de máquina, inteligência 
>artificial, visão computacional

___
___

# 💬 Agente 2 - Planejador de Carreiras 

### 💡 Assistente (IA) - Agente 2

Olá! Recebi suas informações do entrevistador.

Vejo que você escolheu Engenheiro de Machine Learning e tem 12 horas por 
semana para estudar. Perfeito!

Vou montar agora seu plano completo personalizado...

🧩 VISÃO DO DIA A DIA

Como é o trabalho de um(a) Engenheiro(a) de Machine Learning:

- Coleta e preparação de dados para treinamento de modelos.
- Desenvolvimento e implementação de modelos de Machine Learning usando 
Python.
- Avaliação e otimização de modelos utilizando métricas adequadas.
- Experimentação com diferentes algoritmos e técnicas de ML.
- Deploy de modelos em produção e monitoramento de performance.
- Colaboração com equipes de engenharia e ciência de dados.

🧠 MAPA DE SKILLS

CORE SKILLS (essenciais):
- Python (programação)
- Machine Learning Fundamentals (regressão, classificação, clustering)
- Deep Learning Fundamentals (redes neurais, backpropagation)
- Álgebra Linear e Cálculo
- Estatística e Probabilidade

NICE-TO-HAVE (complementares):
- Cloud Computing (AWS, Azure, GCP)
- Versionamento de Código (Git)
- Containerização (Docker)
- Engenharia de Software

FERRAMENTAS E TECNOLOGIAS:
- Python (Scikit-learn, TensorFlow, PyTorch, Keras)
- Jupyter Notebook
- Optuna
- MLflow
- NumPy, Pandas

📅 ROADMAP DE 90 DIAS

ADAPTADO PARA: 12 horas/semana

MÊS 1 - FUNDAMENTOS

SEMANA 1-2:
- Revisar Álgebra Linear e Cálculo: Focar em vetores, matrizes, derivadas 
e integrais. (2h/semana)
- Python Refresh: Revisar estruturas de dados, funções e classes. 
(2h/semana)
- Introdução a Machine Learning: Compreender os conceitos básicos, tipos 
de aprendizado e o workflow geral. (4h/semana)
- Recurso: Curso "Machine Learning" do Andrew Ng na Coursera.

SEMANA 3-4:
- Estatística e Probabilidade: Revisar distribuições, testes de hipóteses 
e inferência estatística. (4h/semana)
- Scikit-learn Fundamentals: Aprender a usar as principais funções do 
Scikit-learn para tarefas de pré-processamento, modelagem e avaliação. 
(4h/semana)
- Recurso: Documentação do Scikit-learn.

MÊS 2 - PRÁTICA

SEMANA 5-6:
- Projeto 1: Classificação de Imagens com Scikit-learn: Implementar um 
modelo de classificação de imagens usando o dataset MNIST. (12h/semana)
- Usar Optuna para otimizar hiperparâmetros do modelo.
- MLflow para rastrear experimentos e comparar resultados.

SEMANA 7-8:
- Projeto 2: Regressão Linear e Logística: Implementar modelos de 
regressão linear e logística para problemas de regressão e classificação. 
(12h/semana)
- Utilizar diferentes métricas de avaliação para comparar o desempenho dos 
modelos.

MÊS 3 - PORTFÓLIO E PREPARAÇÃO

SEMANA 9-10:
- Introdução ao Deep Learning com Keras/TensorFlow/PyTorch: Compreender os 
conceitos básicos de redes neurais e implementar um modelo simples. 
(8h/semana)
- Escolher uma framework (Keras, TensorFlow ou PyTorch) e começar a se 
familiarizar com a sintaxe. (4h/semana)

SEMANA 11-12:
- Projeto 3: Classificação de texto com redes neurais: Implementar um 
modelo de classificação de texto usando um dataset público. (12h/semana)
- Utilizar técnicas de regularização para evitar overfitting.

🚀 PROJETO DE PORTFÓLIO

PROJETO: Previsão de churn de clientes

O QUE FAZER:
Construir um modelo de Machine Learning que preveja quais clientes têm 
maior probabilidade de cancelar um serviço (churn). Utilizar um dataset 
público com informações sobre clientes e seu histórico de uso do serviço.

ENTREGÁVEIS:
- Dataset pré-processado.
- Modelo de Machine Learning treinado.
- Relatório com os resultados da avaliação do modelo.
- Código fonte do projeto.

CRITÉRIOS DE ACEITAÇÃO:
- O modelo deve atingir uma precisão mínima de 80%.
- O código deve estar bem documentado e seguir boas práticas de 
programação.
- O relatório deve apresentar os resultados de forma clara e concisa.

DICA:
Utilizar técnicas de balanceamento de classes para lidar com o problema de 
dados desbalanceados.

💬 ROTEIRO DE ENTREVISTAS

PERGUNTA 1: Explique a diferença entre Machine Learning Supervisionado, 
Não Supervisionado e por Reforço.
COMO RESPONDER:
(Exemplo estruturado) - Descreva cada tipo de aprendizado, fornecendo 
exemplos de aplicações comuns.

PERGUNTA 2: O que é overfitting e como você o evita?
COMO RESPONDER:
(Exemplo estruturado) - Explique o conceito de overfitting e apresente 
técnicas para evitá-lo, como regularização, validação cruzada e coleta de 
mais dados.

PERGUNTA 3: Descreva o processo de avaliação de um modelo de Machine 
Learning.
COMO RESPONDER:
(Exemplo estruturado) - Explique as etapas de coleta de dados, 
treinamento, validação e testes, e apresente as métricas de avaliação 
relevantes para cada tipo de problema.

PERGUNTA 4: Explique a importância da engenharia de features em Machine 
Learning.
COMO RESPONDER:
(Exemplo estruturado) - Descreva como a seleção e transformação de 
features podem melhorar o desempenho de um modelo e facilitar a 
interpretação dos resultados.

PERGUNTA 5: Como você abordaria o problema de dados faltantes em um 
dataset?
COMO RESPONDER:
(Exemplo estruturado) - Apresente diferentes estratégias para lidar com 
dados faltantes, como imputação, remoção de linhas ou colunas, e 
utilização de algoritmos que lidam com dados faltantes.

🎓 TRILHA DIO RECOMENDADA

TRILHA: Engenharia de Machine Learning com Python

POR QUE ESSA TRILHA:
Essa trilha abrange desde os fundamentos do Machine Learning até as 
técnicas mais avançadas, com foco na aplicação prática utilizando Python.

PRÓXIMOS PASSOS:
1. Acesse dio.me
2. Busque por "Engenharia de Machine Learning com Python"
3. Inscreva-se gratuitamente
4. Siga o cronograma junto com este roadmap

✨ Seu plano está pronto!

Lembre-se: o mais importante é a constância, não a velocidade. Comece pela 
Semana 1 e vá no seu ritmo.

Tem alguma dúvida sobre o plano? Posso detalhar alguma parte específica?


