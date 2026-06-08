<h1>
<a href="https://www.dio.me/">
<img align="center" width="40px" src="https://hermes.digitalinnovation.one/assets/diome/logo-minimized.png"></a>
<span>Copiloto de Vendas com IA para Atendimento ao Cliente
</span>
</h1>

## :gear: Declaração de uso de Inteligência Artificial

Durante o desenvolvimento deste projeto, foi utilizada Inteligência Artificial como ferramenta de apoio para:

- concepção e estruturação do prompt de copiloto de vendas;
- geração de ideias e exemplos práticos de roteiros de atendimento;
- elaboração de trechos de roteiro personalizados por perfil de cliente;
- revisão e organização do conteúdo do README.md.

Todo o conteúdo gerado pela IA foi **revisado, validado e adaptado manualmente**, garantindo que:
- as informações estejam adequadas ao contexto de vendas da HEINEKEN;
- os exemplos sejam coerentes com a realidade de pontos de venda;
- o texto final reflita minha compreensão e decisão como autor do projeto.

**Ferramenta utilizada:** Perplexity (modelo de IA conversacional).  
**Data de uso:** junho de 2026.  
**Prompts principais:** documentação disponível na seção “Estrutura do desafio” deste documento.
## :scroll: Visão geral
Este projeto apresenta a proposta de um copiloto de vendas com Inteligência Artificial voltado para atendimento ao cliente em pontos de venda, como bares, restaurantes e supermercados. A solução foi pensada para apoiar vendedores na abordagem comercial, na identificação de necessidades do cliente e na recomendação de produtos de forma mais personalizada, prática e eficiente.

A proposta está alinhada ao desafio criativo do Bootcamp HEINEKEN - Inteligência Artificial Aplicada a Vendas, cujo foco é aplicar IA para vender mais, atender melhor e estruturar prompts claros que gerem resultados úteis no contexto comercial.

## :bulb: Objetivo
Criar um prompt avançado capaz de orientar uma IA a gerar roteiros de atendimento de vendas personalizados, com foco em:

- aumentar a conversão;
- melhorar a experiência do cliente;
- apoiar o vendedor em interações reais do dia a dia;
- adaptar a abordagem conforme o perfil do cliente e o contexto do ponto de venda.

## :pencil: Estrutura do desafio
O desafio foi construído em três etapas principais:

### 1. Definição da intenção
Quero que a IA gere um roteiro de atendimento de vendas personalizado para clientes de bebidas, com o objetivo de aumentar a conversão e melhorar a experiência do cliente.

### 2. Contexto e restrições
Considere o seguinte contexto: atendimento em pontos de venda com foco em produtos da HEINEKEN e diferentes perfis de clientes. O conteúdo deve ter formato de passo a passo com exemplos de falas reais do vendedor, adaptadas ao perfil do cliente e ao local de atendimento. Evite linguagem excessivamente técnica e respostas genéricas.

### 3. Prompt final
```text
Você é um copiloto de vendas da HEINEKEN especializado em aumentar conversão e melhorar a experiência do cliente em pontos de venda (bares, restaurantes e supermercados).

Entradas:
- perfil_do_cliente: {econômico, premium, indeciso, técnico, social}
- local_de_atendimento: {bar, restaurante, supermercado, evento}
- produtos_disponíveis: {lista de produtos}
- objetivo_da_venda: {aumentar volume, vender premium, fechar carrinho, fidelizar}

Sua tarefa:
Gerar um roteiro de atendimento completo, personalizado e prático para o vendedor seguir durante a visita, com o objetivo de aumentar a conversão e melhorar a experiência do cliente.

Requisitos do roteiro:
1. Abertura:
   - 2 opções de abertura de abordagem (mais direta e mais empática).
   - Frase de conexão com o perfil do cliente e com o local.

2. Identificação de necessidades:
   - 3 perguntas estratégicas para entender:
     - público-alvo do cliente;
     - momento de consumo;
     - desafios atuais.

3. Sugestão de produtos e valor:
   - Recomendação de 2 a 3 produtos adaptados ao perfil, local e objetivo.
   - Para cada produto, explicar:
     - benefício para o cliente;
     - benefício para o consumidor final;
     - argumento de preço ou margem, quando relevante.

4. Fechamento e próximo passo:
   - 2 opções de fechamento de venda.
   - Sugestão de 1 próximo passo concreto.

5. Personalização por perfil:
   - 1 frase de adaptação da abordagem.
   - 1 argumento adicional específico.

6. Formato de saída:
   - Título: “Roteiro de Atendimento – [perfil_do_cliente] | [local_de_atendimento]”
   - Seções numeradas
   - Bullet points para ideias
   - Exemplos de falas do vendedor em bloco
   - Linguagem clara, natural e persuasiva

Restrições:
- Evite respostas genéricas.
- Não use linguagem excessivamente técnica.
- Mantenha o roteiro aplicável no dia a dia do vendedor.

Com base nas entradas fornecidas, gere o roteiro completo seguindo exatamente esses requisitos.
```

## :pencil2: Diferencial da proposta
O principal diferencial deste projeto é transformar um prompt simples em uma estrutura de copiloto com entradas bem definidas, regras claras de saída e foco em aplicação prática. Em vez de solicitar apenas “dicas de vendas”, o prompt orienta a IA a produzir um roteiro acionável, contextualizado e adaptável a diferentes cenários de atendimento.

Isso demonstra um uso mais maduro da engenharia de prompts, porque define:

- papel da IA;
- objetivo de negócio;
- variáveis de entrada;
- estrutura esperada de resposta;
- restrições de linguagem e formato.

## :computer: Exemplos práticos
A seguir, três casos distintos para demonstrar como o prompt pode ser aplicado em situações reais.

### Caso 1 — Bar com público jovem
**Entradas:**
- perfil_do_cliente: social
- local_de_atendimento: bar
- produtos_disponíveis: HEINEKEN 330ml, HEINEKEN Grande, HEINEKEN Zero
- objetivo_da_venda: aumentar volume

**Exemplo de roteiro gerado:**

#### 1. Abertura
- Opção direta:
  > “Oi! Vim trazer uma ideia para aumentar o movimento do bar com produtos HEINEKEN que combinam com o perfil do seu público.”

- Opção empática:
  > “Percebi que o bar tem um público jovem e social. Dá para usar isso a favor nas vendas com uma oferta mais alinhada ao momento de consumo.”

#### 2. Identificação de necessidades
- “Qual é o perfil de cliente que mais frequenta o bar durante a semana?”
- “Quais dias têm menor movimento e precisam de incentivo de vendas?”
- “Hoje o maior desafio é giro, margem ou variedade de produto?”

#### 3. Sugestão de produtos e valor
- **HEINEKEN 330ml**
  - Benefício para o bar: produto com bom giro e fácil de inserir em promoções.
  - Benefício para o consumidor: embalagem prática para consumo em grupo.
- **HEINEKEN Zero**
  - Benefício para o bar: amplia o público atendido.
  - Benefício para o consumidor: opção para quem quer participar do momento social sem consumir álcool.
- **HEINEKEN Grande**
  - Benefício para o bar: agrega valor ao ticket médio.
  - Benefício para o consumidor: ideal para consumo mais prolongado.

#### 4. Fechamento e próximo passo
- Fechamento direto:
  > “Podemos testar uma combinação entre HEINEKEN 330ml e HEINEKEN Zero para aumentar o giro nesta semana?”

- Fechamento colaborativo:
  > “Se você achar interessante, montamos um teste pequeno e avaliamos juntos o resultado nos próximos dias.”

- Próximo passo:
  - Criar uma exposição destacada para os produtos próximos ao balcão.

#### 5. Personalização por perfil
- Frase de adaptação:
  > “Como o seu público valoriza socialização e experiência, faz sentido destacar produtos que acompanhem esse momento.”

- Argumento adicional:
  - A presença de uma opção sem álcool pode ampliar a aceitação do portfólio entre grupos diversos.

### Caso 2 — Restaurante com posicionamento premium
**Entradas:**
- perfil_do_cliente: premium
- local_de_atendimento: restaurante
- produtos_disponíveis: HEINEKEN Grande, HEINEKEN 330ml
- objetivo_da_venda: vender premium

**Exemplo de roteiro gerado:**

#### 1. Abertura
- Opção direta:
  > “Olá! Gostaria de apresentar uma forma de reforçar a experiência premium do restaurante com produtos HEINEKEN.”

- Opção empática:
  > “Seu restaurante transmite qualidade e cuidado na experiência. A escolha da cerveja pode fortalecer ainda mais essa percepção.”

#### 2. Identificação de necessidades
- “Qual tipo de cliente mais consome bebidas aqui: famílias, casais ou executivos?”
- “Os pedidos de bebida acompanham mais almoço, jantar ou ocasiões especiais?”
- “Seu foco atual está em margem, imagem de marca ou aumento do ticket médio?”

#### 3. Sugestão de produtos e valor
- **HEINEKEN Grande**
  - Benefício para o restaurante: reforça posicionamento premium e pode aumentar ticket médio.
  - Benefício para o consumidor: experiência de consumo associada a qualidade.
- **HEINEKEN 330ml**
  - Benefício para o restaurante: opção mais versátil para diferentes perfis.
  - Benefício para o consumidor: praticidade com percepção de marca forte.

#### 4. Fechamento e próximo passo
- Fechamento direto:
  > “Faz sentido iniciar com uma seleção premium em destaque para observar o impacto no ticket médio?”

- Fechamento colaborativo:
  > “Podemos testar a exposição por uma semana e avaliar juntos a resposta dos clientes.”

- Próximo passo:
  - Inserir destaque visual da marca no cardápio ou na área de bebidas.

#### 5. Personalização por perfil
- Frase de adaptação:
  > “Como o restaurante já trabalha uma proposta mais sofisticada, faz sentido oferecer uma cerveja reconhecida por qualidade.”

- Argumento adicional:
  - O produto premium ajuda a sustentar percepção de valor sem depender apenas de preço.

### Caso 3 — Supermercado com foco em fechamento de carrinho
**Entradas:**
- perfil_do_cliente: indeciso
- local_de_atendimento: supermercado
- produtos_disponíveis: HEINEKEN 330ml, pack promocional, HEINEKEN Zero
- objetivo_da_venda: fechar carrinho

**Exemplo de roteiro gerado:**

#### 1. Abertura
- Opção direta:
  > “Olá! Vim propor uma estratégia simples para aumentar o giro de cervejas e facilitar a decisão de compra do consumidor.”

- Opção empática:
  > “Em supermercado, muitos clientes decidem na hora. Uma boa apresentação do portfólio pode fazer diferença no fechamento da compra.”

#### 2. Identificação de necessidades
- “O consumidor costuma comprar cerveja para consumo imediato ou para abastecimento da casa?”
- “Quais formatos vendem mais: unidade, pack ou versão sem álcool?”
- “Hoje o principal desafio está em giro de estoque, concorrência ou exposição?”

#### 3. Sugestão de produtos e valor
- **Pack promocional**
  - Benefício para o supermercado: aumenta volume por compra.
  - Benefício para o consumidor: percepção de economia e praticidade.
- **HEINEKEN 330ml**
  - Benefício para o supermercado: produto de alta lembrança e boa rotatividade.
  - Benefício para o consumidor: compra fácil e familiar.
- **HEINEKEN Zero**
  - Benefício para o supermercado: amplia alcance do portfólio.
  - Benefício para o consumidor: alternativa para diferentes ocasiões.

#### 4. Fechamento e próximo passo
- Fechamento direto:
  > “Podemos destacar o pack promocional em uma ponta de gôndola para estimular compras por impulso?”

- Fechamento colaborativo:
  > “Se concordar, organizamos um teste de exposição estratégica e acompanhamos o desempenho nas próximas vendas.”

- Próximo passo:
  - Reorganizar os produtos em área de maior fluxo para aumentar visibilidade.

#### 5. Personalização por perfil
- Frase de adaptação:
  > “Quando o cliente está indeciso, a exposição e a clareza da oferta pesam muito na decisão.”

- Argumento adicional:
  - Combinar marca forte com oferta objetiva facilita o fechamento da compra.

## Benefícios do uso de IA neste cenário
A aplicação de IA nesse contexto traz ganhos concretos para o processo comercial:

- mais agilidade na preparação de abordagens;
- personalização do discurso de vendas;
- padronização de boas práticas de atendimento;
- apoio a vendedores com diferentes níveis de experiência;
- maior foco em necessidades reais do cliente.

## Conclusão
O projeto mostra como a Inteligência Artificial pode ser usada de forma prática para apoiar vendas consultivas e melhorar o atendimento ao cliente. A construção de um prompt claro, estruturado e orientado por contexto permite transformar uma necessidade comercial em uma solução objetiva, replicável e de alto valor para a operação.

Mais do que gerar texto, a IA passa a atuar como apoio estratégico ao vendedor, ajudando a organizar a abordagem, adaptar argumentos e conduzir a conversa com mais foco em resultado.