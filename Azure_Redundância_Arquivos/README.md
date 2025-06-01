<h1>
<a href="https://www.dio.me/">
     <img align="center" width="40px" src="https://hermes.digitalinnovation.one/assets/diome/logo-minimized.png"></a>
    <span>Criando Processos de Redundância de Arquivos na Azure</span>
</h1>

# :computer: Descrição

O objetivo desse desafio é se familiarizar com o Azure Data Factory e entender o processo de criar redundância de arquivos fazendo cópia de diferentes fontes de dados. Vou seguir o tutorial da microsoft learn:

* [Use a ferramenta Copiar dados no Azure Data Factory Studio para copiar dados](https://learn.microsoft.com/en-us/azure/data-factory/quickstart-hello-world-copy-data-tool)

Para copiar arquivos de um blob storage da Azure.

# :bulb: Solução do desafio

1. Preparando dados seguindo o [template do tutorial](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.datafactory%2Fdata-factory-copy-data-tool%2Fazuredeploy.json), o arquivo moviesDB2.csv é armazenado em uma pasta chamada input no Armazenamento de Blobs.

2. Criando um data factory seguindo o tutorial [criar uma fábrica de dados](https://learn.microsoft.com/en-us/azure/data-factory/quickstart-create-data-factory).

3. Acessar o data Factory Studio e selecionar o tipo de tarefa de ingestão

<p align=center>
<img src="imagens/ingest.png" width=30%>
</p>

4. Criando tarefa de cópia de dados

<p align=center>
<img src="imagens/copy_task.png" width=80%>
</p>

5. Criando nova conexão

<p align=center>
<img src="imagens/connection_integration_runtime.png" width=50%>
</p>

6. Configurando fonte de arquivo

<p align=center>
<img src="imagens/copy_source.png" width=80%>
</p>

7. Configurando destino do arquivo

<p align=center>
<img src="imagens/copy_destination.png" width=80%>
</p>

8. Nomeando a tarefa

<p align=center>
<img src="imagens/copy_settings.png" width=80%>
</p>

9. Implantando

<p align=center>
<img src="imagens/deploy_copy.png" width=80%>
</p>

10. Observando a pipeline no monitor

<p align=center>
<img src="imagens/monitor_pipeline.png" width=80%>
</p>

11. Excluir os grupos de recursos para evitar cobranças adicionais

<p align=center>
<img src="imagens/grupos_recursos_deletar.png" width=80%>
</p>
