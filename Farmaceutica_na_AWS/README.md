<h1>
<a href="https://www.dio.me/">
     <img align="center" width="40px" src="https://hermes.digitalinnovation.one/assets/diome/logo-minimized.png"></a>
    <span> Redução dos Custos em Farmácias com AWS</span>
</h1>

# :computer: Desenvolvimento do desafio

Para esse desafio de desenvolvimento, foi utilizado o *Markdown* para a elaboração do relatório de implementação de serviços AWS para uma empresa farmacêutica fictícia. Foi utilizado o *template* fornecido pelo instrutor e modificado conforme necessidade com o auxílio do modelo de LLM Google Gemini. Eu incluir no prompt uma quarta etapa para utilização de banco de dados com grafos para se ter *insights* de vendas e sugestão de descontos. Para um projeto real, os documentos propostos na seção anexos devem ser elaborados. Segue o relatório finalizado:

# 📋 RELATÓRIO DE IMPLEMENTAÇÃO DE SERVIÇOS AWS

- Data: 16 de Dezembro de 2025

- Empresa: **Abstergo Industries**

- Responsável: **Tiago Santiago**

## Introdução

Este relatório apresenta o processo de implementação de ferramentas na empresa **Abstergo Industries**, realizado por **Tiago Santiago**. O objetivo do projeto foi elencar 4 serviços AWS, com a finalidade de realizar diminuição de custos imediatos e otimizar a operação, especialmente na área de *insights* de vendas e relacionamento com o cliente, para uma empresa farmacêutica revendedora que atualmente não utiliza Cloud Computing.

## Descrição do Projeto

O projeto de implementação de ferramentas foi dividido em **4 etapas**, cada uma com seus objetivos específicos. A seguir, serão descritas as etapas do projeto, focadas em serviços AWS que oferecem alto impacto na redução de custos e melhoria operacional.

### Etapa 1: Migração de Armazenamento de Arquivos e *Backups* 

* **Nome da ferramenta:** **Amazon S3 (Simple Storage Service)**

* **Foco da ferramenta:** **Armazenamento de Objetos de Baixo Custo e Alta Durabilidade.**

* **Descrição de caso de uso:** Substituir o armazenamento local (servidores de arquivos, NAS) de documentos e *backups*. O S3 reduz os custos de *hardware*, energia e manutenção. Para dados acessados com pouca frequência (registros de conformidade antigos, *backups* de longa duração), a utilização das classes **S3 Standard-IA** e **S3 Glacier** oferece uma redução de custo por GB que chega a ser drasticamente menor que o custo de manutenção de discos locais.

### Etapa 2: Virtualização de Servidores e Otimização de Carga de Trabalho

* **Nome da ferramenta:** **Amazon EC2 (Elastic Compute Cloud) com opção de instâncias *Spot***

* **Foco da ferramenta:** **Redução de Custo de Capacidade de Computação Volátil.**

* **Descrição de caso de uso:** Migrar cargas de trabalho não críticas e flexíveis (como processamento em lote de relatórios noturnos, ou ambientes de desenvolvimento/testes) para instâncias EC2 Spot. Esta modalidade permite usar a capacidade não utilizada da AWS com **descontos que podem chegar a 90%** em comparação com as instâncias *On-Demand*, eliminando a necessidade de *over-provisioning* (*excesso de capacidade*) em servidores físicos locais.

### Etapa 3: Infraestrutura de Rede e Segurança Simplificada

* **Nome da ferramenta:** **Amazon VPC (Virtual Private Cloud)**

* **Foco da ferramenta:** **Criação de Rede Isolada e Segura na Nuvem (Segurança como Serviço).**

* **Descrição de caso de uso:** Criar uma rede virtual privada para isolar os serviços. A VPC, juntamente com o uso de **Security Groups** (funcionalidades de *firewall* nativas da AWS), permite que a empresa desative *firewalls* físicos e licenças de VPNs caras. O custo e a complexidade da gestão de segurança de rede são simplificados, gerando uma economia indireta de *hardware* e pessoal.

### Etapa 4: Insights de Vendas e Sugestão de Descontos

* **Nome da ferramenta:** **Amazon Neptune**

* **Foco da ferramenta:** **Banco de Dados de Grafos para Modelagem de Relacionamentos Complexos.**

* **Descrição de caso de uso:** Implementar um banco de dados de grafos para analisar as relações entre Clientes, Produtos, Histórico de Compras e Descontos Aplicados. O Neptune facilita a identificação de padrões de compra complexos (Ex: *Clientes que compram X tendem a comprar Y quando a Farmácia Z faz uma promoção de 15%*). Esses *insights* otimizam a alocação de descontos e direcionam campanhas de vendas com precisão, o que resulta em **aumento de receita** (ROI) que justifica o custo do serviço.

## Conclusão

A implementação de ferramentas na empresa **Abstergo Industries** tem como esperado **uma redução significativa nos custos operacionais (*OPEX*) e de capital (*CAPEX*) através da substituição do *hardware* local e uma otimização da receita por meio de *insights* avançados de vendas**, o que aumentará a eficiência e a produtividade da empresa.

### Estimativa de Redução de Custos Imediatos:

| Serviço | Foco na Economia | Impacto Estimado |
| --- | --- | --- |
| **Amazon S3** | Armazenamento e *Backup* | Redução de até **80%** nos custos de armazenamento local e manutenção. |
| **Amazon EC2 Spot** | Servidores de Teste/Processamento em Lote | Redução de até **90%** nos custos de computação para cargas de trabalho flexíveis. |
| **Amazon VPC** | *Firewall* e VPNs Físicas | Economia indireta ao eliminar licenças de segurança de rede e manutenção de *hardware* dedicado. |

### Benefícios Estratégicos:

O **Amazon Neptune**, embora represente um novo custo de serviço, garante um alto **Retorno sobre o Investimento (ROI)**. A otimização de descontos e o aumento da assertividade das sugestões de vendas devem gerar um incremento na receita que supera o custo de sua implementação e operação. Recomenda-se a continuidade da utilização das ferramentas implementadas e a busca por novas tecnologias que possam melhorar ainda mais os processos da empresa.

## Anexos

* [Proposta de Dimensionamento de S3 - Abstergo V1.0]
* [Estimativa Detalhada de Custo AWS (S3, EC2 Spot, Neptune) - Comparativo com *On-Premises*]
* [Manual de Configuração Inicial de VPC e Security Groups]
* [Modelo de Dados de Grafos para Neptune - Cliente/Produto/Venda]

Assinatura do Responsável pelo Projeto:

[Tiago Santiago]