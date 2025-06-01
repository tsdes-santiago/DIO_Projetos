<h1>
<a href="https://www.dio.me/">
     <img align="center" width="40px" src="https://hermes.digitalinnovation.one/assets/diome/logo-minimized.png"></a>
    <span>Github e Azure Devops para Versionamento e Backups</span>
</h1>

# :computer: Descrição

Tutorial para ajudar a integrar um repositório Git ao Azure Data Factory

# :pencil: Passo a passo

Para integrar um repositório Git ao **Azure Data Factory**:

1. **Acesse o Azure Data Factory** e vá até as configurações de **Git**.
2. **Escolha o provedor Git** (GitHub, Azure DevOps, GitLab ou Bitbucket).
3. **Configure as credenciais**:
   - Para repositórios públicos, basta inserir a **URL do repositório** e a **branch**.
   - Para repositórios privados, será necessário um **Token de Acesso Pessoal**.
4. **Habilite a sincronização do Git** na interface do usuário do **Gerenciador de Orquestração de Fluxos de Trabalho**.
5. **Realize commits e pull requests** para versionamento e controle de alterações.

Um tutorial mais detalhado está disponível no microsoft learn: [Controle do código-fonte no Azure Data Factory](https://learn.microsoft.com/pt-br/azure/data-factory/source-control)

# Vantagens da integração do Git

* **Controle do código-fonte:** à medida que as cargas de trabalho do seu data factory se tornam cruciais, você gostaria de integrar sua fábrica ao Git para aplicar vários benefícios de controle do código-fonte, como os seguintes:
    - Capacidade de controlar/auditar as alterações.
    - Capacidade de reverter as alterações que introduziram bugs.

* **Guardas parciais:** A criação no serviço de fábrica de dados, não é possível guardar alterações como rascunho e todas as publicações devem passar pela validação da fábrica de dados. Quer os seus pipelines não estejam concluídos ou simplesmente não queira perder alterações se o seu computador falhar, a integração do git permite alterações incrementais dos recursos da fábrica de dados, independentemente do estado em que se encontrem. Configurar um repositório git permite que você salve as alterações, permitindo que você publique apenas depois de testar suas alterações de forma satisfatória.

* **Colaboração e controle:** se você tiver vários membros da equipe contribuindo para o mesmo alocador, talvez queira permitir qu e seus colegas de equipe colaborem entre si por meio de um processo de revisão de código. Você também pode configurar seu alocador de forma que nem todos os colaboradores tenham permissões iguais. Alguns membros da equipe podem fazer alterações apenas por meio do Git, e somente determinadas pessoas da equipe têm permissão para publicar as alterações no seu alocador.


* **Melhor CI/CD:** se você estiver implantando em vários ambientes com um processo de entrega contínua, a integração do git facilita determinadas ações. Algumas dessas ações incluem:
    - Configurar seu pipeline de liberação para disparar automaticamente assim que houver uma alteração feita no alocador de "desenvolvimento".
    - Personalize as propriedades no alocador que estejam disponíveis como parâmetros no modelo do Resource Manager. Pode ser útil manter apenas o conjunto necessário de propriedades como parâmetros e ter todo o resto codificado.

* **Melhor desempenho:** Um alocador médio integrado ao Git é carregado 10 vezes mais rápido do que uma criação no serviço de Data Factory. Essa melhoria de desempenho ocorre porque os recursos são baixados por meio do Git.