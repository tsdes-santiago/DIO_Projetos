<h1>
<a href="https://www.dio.me/">
     <img align="center" width="40px" src="https://hermes.digitalinnovation.one/assets/diome/logo-minimized.png"></a>
    <span>Microsoft Azure - Configurando uma instância de Banco de Dados na Azure</span>
</h1>

# :computer: Descrição

O objetivo deste resumo é se familiarizar com as instâncias de bancos de dados disponíveis no portal do Azure.

# :pencil: Banco de dados

O Azure oferece diversas instâncias de bancos de dados para atender a diferentes necessidades de armazenamento e processamento de dados. Aqui estão algumas das principais opções e seus casos recomendados:

### **1. Banco de Dados SQL do Azure**
- **Caso recomendado**: Aplicações que precisam de um banco de dados relacional gerenciado, com escalabilidade e alta disponibilidade.
- **Benefícios**: Suporte a SQL Server, segurança integrada, escalabilidade automática.

### **2. Azure Cosmos DB**
- **Caso recomendado**: Aplicações globais que exigem baixa latência e alta disponibilidade, como sistemas distribuídos e IoT.
- **Benefícios**: Suporte a múltiplos modelos de dados (documentos, chave-valor, grafos), replicação global.

### **3. Banco de Dados do Azure para PostgreSQL**
- **Caso recomendado**: Aplicações que utilizam PostgreSQL e precisam de um serviço gerenciado com alta disponibilidade.
- **Benefícios**: Suporte a extensões do PostgreSQL, escalabilidade automática.

### **4. Banco de Dados do Azure para MySQL**
- **Caso recomendado**: Aplicações web que utilizam MySQL, como WordPress e Magento.
- **Benefícios**: Gerenciamento simplificado, segurança integrada.

### **5. Banco de Dados do Azure para MariaDB**
- **Caso recomendado**: Aplicações que precisam de compatibilidade com MySQL, mas preferem MariaDB.
- **Benefícios**: Alta disponibilidade, suporte a replicação.

### **6. Instâncias Gerenciadas do SQL do Azure**
- **Caso recomendado**: Migração de bancos de dados SQL Server locais para a nuvem sem grandes alterações.
- **Benefícios**: Compatibilidade total com SQL Server, suporte a redes privadas.

Cada uma dessas opções tem características específicas que podem ser ideais para diferentes cenários.

# :pencil: Banco de Dados SQL do Azure

Configurar um **Banco de Dados SQL do Azure** é um processo simples e pode ser feito diretamente pelo **Portal do Azure**. Aqui está um guia passo a passo:

### **1. Criar um Banco de Dados SQL**
1. **Acesse o Portal do Azure** e vá para a seção **Banco de Dados SQL**.
2. **Clique em "Criar"** e selecione **"Banco de Dados SQL do Azure"**.
3. **Escolha a assinatura e o grupo de recursos** onde o banco será criado.
4. **Defina o nome do banco de dados** e crie um **servidor SQL** (caso não tenha um).
5. **Escolha o modelo de compra** (DTU ou vCore) e a camada de desempenho.
6. **Configure a rede**, permitindo ou restringindo acessos externos.
7. **Revise e crie** o banco de dados.

### **2. Configurar Acesso e Segurança**
- **Criar usuários e permissões** no banco de dados.
- **Configurar regras de firewall** para permitir conexões seguras.
- **Habilitar autenticação do Microsoft Entra ID** para maior segurança.

### **3. Conectar ao Banco de Dados**
- Use **Azure Data Studio**, **SQL Server Management Studio (SSMS)** ou **Visual Studio** para conectar-se ao banco.
- Utilize a **string de conexão** disponível no portal para integrar com aplicações.

### **4. Executar Consultas e Gerenciar Dados**
- Acesse o **Editor de Consultas** no portal para rodar comandos SQL.
- Configure **backup automático** e **monitoramento** para garantir a integridade dos dados.

Para um guia detalhado, confira este [tutorial oficial](https://learn.microsoft.com/pt-br/azure/azure-sql/database/single-database-create-quickstart?view=azuresql) da Microsoft!
