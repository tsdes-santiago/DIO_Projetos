# DIO Explorer - Skills

## Skill: Consultar Trilha
**Trigger:** Usuário quer ver informações sobre uma trilha de aprendizagem
**Ações:**
1. Identificar a tecnologia ou ID da trilha desejada
2. Buscar na base de trilhas
3. Retornar nome, tecnologia, nível, duração e módulos

**Exemplo de uso:**
- "Quero ver a trilha de JavaScript"
- "Mostre a trilha react-basico"

---

## Skill: Gerar Desafio
**Trigger:** Usuário quer um desafio de código para praticar
**Ações:**
1. Identificar tecnologia e nível desejados (se informados)
2. Filtrar desafios disponíveis
3. Selecionar aleatoriamente um desafio
4. Retornar enunciado, exemplo e dica

**Exemplo de uso:**
- "Me dê um desafio de Python"
- "Quero um desafio básico de JavaScript"

---

## Skill: Gerar Certificado
**Trigger:** Usuário completou uma trilha e quer certificado
**Ações:**
1. Receber nome do usuário
2. Validar que a trilha existe
3. Gerar certificado com dados fictícios
4. Criar arquivo JSON e HTML
5. Retornar localização dos arquivos

**Exemplo de uso:**
- "Gerar certificado para Maria Silva na trilha JavaScript Básico"

---

## Skill: Explorar Tecnologias
**Trigger:** Usuário quer saber quais tecnologias estão disponíveis
**Ações:**
1. Extrair todas as tecnologias únicas da base
2. Retornar lista formatada

**Exemplo de uso:**
- "Quais tecnologias você tem?"
- "Lista de tecnologias"

---

## Skill: Assistente Interativo
**Trigger:** Usuário inicia uma conversa com o agent
**Ações:**
1. Identificar a intenção do usuário (trilha, desafio, certificado, ajuda)
2. Processar a solicitação com os dados apropriados
3. Retornar resposta formatada e útil

**Exemplo de uso:**
- "Olá"
- "Ajuda"
- "O que você faz?"

---

## Skill: Filtrar por Nível
**Trigger:** Usuário quer desafios ou trilhas de um nível específico
**Ações:**
1. Identificar nível desejado (básico, intermediário, avançado)
2. Aplicar filtro na busca
3. Retornar resultados filtrados

**Exemplo de uso:**
- "Trilhas intermediárias"
- "Desafios avançados de Java"

---

## Skill: Listar Módulos
**Trigger:** Usuário quer ver os módulos de uma trilha
**Ações:**
1. Buscar trilha pelo ID ou nome
2. Listar todos os módulos com ordem, título e duração

**Exemplo de uso:**
- "Quais módulos tem na trilha de Node.js?"
- "Mostrar módulos do curso de Python"
