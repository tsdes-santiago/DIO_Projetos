<h1>
<a href="https://www.dio.me/">
     <img align="center" width="40px" src="https://hermes.digitalinnovation.one/assets/diome/logo-minimized.png"></a>
    <span>Explorando IA Generativa em um Pipeline de ETL com Python</span>
</h1>

O objetivo desse desafio é fazer um *pipeline* de ETL com python e utilizar uma API de um modelo LLM para atualizar os dados. Para simplificar o problema, não utilizarei REST APIs externas, os dados serão salvos em um dicionário durante a execução.

# :computer: Desenvolvimento do desafio

Vamos imaginar que temos um banco de dados de possíveis clientes para os quais enviaremos mensagens de *marketing*. 

## :pencil: Estrutura dos dados

Cada cliente será salvo em um dicionário na forma:

```code
{
   id:,
   nome:,
   CPF:,
   marketing:{
      {
         id:,
         mensagem:
      }
   }
}
```

## :clipboard: Populando o banco de dados

Iniciamos o dicionário _clientes_ com alguns valores de entrada. 

```python
clientes = {
    1: {"nome": "João", "CPF": "12345678910"},
    2: {"nome": "Maria", "CPF": "98765432100"},
    3: {"nome": "Pedro", "CPF": "11122233344"},
    4: {"nome": "Lucia", "CPF": "44455566677"},
    5: {"nome": "Ana", "CPF": "77788899990"}
}
```

## :clipboard: Extração dos dados (Extract)

Agora que possuímos nosso "banco de dados", podemos retornar uma lista com todos os _ids_:

```python
# retornando uma lista dom os ids dos clientes
id_clientes = list(clientes.keys())
print('Id dos clientess: ', id_clientes)
```
E acessar os dados usando as keys do dicionário:

```python
for id in id_clientes:
    print(f'Cliente {id}: {clientes[id]["nome"]} - CPF: {clientes[id]["CPF"]}')
```
Resposta:
```console
Cliente 1: João - CPF: 12345678910
Cliente 2: Maria - CPF: 98765432100
Cliente 3: Pedro - CPF: 11122233344
Cliente 4: Lucia - CPF: 44455566677
Cliente 5: Ana - CPF: 77788899990
```
## :clipboard: Transformação dos dados (Transform)

Podemos adicionar um novo cliente

```python
clientes[6] = {"nome": "Carlos", "CPF": "22233344455"}
id_clientes.append(6)
print(f'Cliente 6: {clientes[6]["nome"]} - CPF: {clientes[6]["CPF"]}')
```
Resposta:
```console
Cliente 6: Carlos - CPF: 22233344455
```
Ainda adicionar uma mensagem de boas-vindas como a primeira mensagem de marketing:

```python
for id in id_clientes:
    id_mensagem = 1
    mensagem_marketing = {
        id_mensagem: f"Olá {clientes[id]['nome']}, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!"
    }
    clientes[id]['mensagem_marketing'] = mensagem_marketing
```

```python
for id in id_clientes:
    print(f'Cliente {id}: {clientes[id]["nome"]} - CPF: {clientes[id]["CPF"]}')
    print(f'Mensagem de Marketing: {clientes[id]["mensagem_marketing"][1]}')
```
Resposta:
```console
Cliente 1: João - CPF: 12345678910
Mensagem de Marketing: Olá João, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Cliente 2: Maria - CPF: 98765432100
Mensagem de Marketing: Olá Maria, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Cliente 3: Pedro - CPF: 11122233344
Mensagem de Marketing: Olá Pedro, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Cliente 4: Lucia - CPF: 44455566677
Mensagem de Marketing: Olá Lucia, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Cliente 5: Ana - CPF: 77788899990
Mensagem de Marketing: Olá Ana, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Cliente 6: Carlos - CPF: 22233344455
Mensagem de Marketing: Olá Carlos, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
```
## :clipboard: Carga (Load)

Vamos gerar e adicionar novas mensagens de _marketing_ usando um LLM. 

Usaremos um modelo local, o **gemma3:12b-it-qat** com o Ollama, para tal é necessário rodar o ollama localmente e baixar o modelo, após instalador rodar em um terminal:

```console
$ollama serve
$ollama pull gemma3:12b-it-qat
```

Definimos uma função para chamar o modelo local e gerar as mensagens. Um dicionário com o histórico de mensagens geradas é necessário para evitar mensagens repetitivas. Essa instrução é passada no prompt. 

```python
import ollama

# Cria o cliente. Ele se conectará automaticamente ao Ollama em execução.
client = ollama.Client()

# Defina o histórico da sessão (Lista de dicionários de mensagens)
# Inicialmente, o histórico conterá apenas a instrução do sistema.
HISTORICO_MENSAGENS = [
    {
        'role': 'system',
        'content': 'Você é um marketplace amigável e criativo. Suas respostas devem ser curtas (no máximo 1 linha) e focadas em sugerir presentes de Natal. **É crucial que você evite repetir as mensagens ou ideias que já foram geradas no histórico de mensagens.**'
    }
]

print("Cliente Ollama inicializado com sucesso!")

def mensagem_marketing_ollama(nome_cliente, temperatura=0.8):
    # Definindo o modelo a ser usado
    MODELO = 'gemma3:12b-it-qat'
   # Import e HISTORICO_MENSAGENS e client mantidos como antes
    prompt_usuario = f"Crie uma nova mensagem de marketing curta, de no máximo 1 linha, para ser enviada para o cliente {nome_cliente}."

    # 1. Adiciona a nova mensagem do usuário ao histórico
    HISTORICO_MENSAGENS.append(
        {
            'role': 'user',
            'content': prompt_usuario
        }
    )

    # 2. Faz a chamada usando 'chat'
    response_chat = client.chat(
        model=MODELO,
        messages=HISTORICO_MENSAGENS,
        options={
            'temperature': temperatura
        }
    )
    
    # 3. Obtém o conteúdo da resposta e LIMPA A STRING
    mensagem_crua = response_chat['message']['content']
    
    # Define o token de parada que você quer remover
    STOP_TOKEN = '\n</start_of_turn>' 
    
    # Limpa o token e quaisquer espaços em branco extras no início/fim
    mensagem_limpa = mensagem_crua.replace(STOP_TOKEN, '').strip()

    # 4. Adiciona a resposta do assistente LIMPA ao histórico
    HISTORICO_MENSAGENS.append(
        {
            'role': 'assistant',
            'content': mensagem_limpa
        }
    )

    return mensagem_limpa # Retorna a string limpa
```

Podemos adicionar uma mensagem para um cliente individualmente:

```python
# Adicionando ou atualizando a mensagem de marketing para o cliente com id 1
criar_ou_atualizar_mensagem_marketing(1, clientes)
```
Resposta:
```console
'João, que tal um kit de cervejas artesanais para relaxar no Natal?'
```

Ou para todos os clientes na id_clientes:

```python 
for id in id_clientes:
    print(f'Cliente {id}: {clientes[id]["nome"]} - CPF: {clientes[id]["CPF"]}')
    mensagem = criar_ou_atualizar_mensagem_marketing(id, clientes)
    print(f'Nova mensagem de Marketing: {mensagem}')
```
Resposta:
```console
Cliente 1: João - CPF: 12345678910
Nova mensagem de Marketing: João, personalize um álbum de fotos com seus melhores momentos do ano!
Cliente 2: Maria - CPF: 98765432100
Nova mensagem de Marketing: Maria, um difusor de aromas relaxantes para um Natal tranquilo?
Cliente 3: Pedro - CPF: 11122233344
Nova mensagem de Marketing: Pedro, que tal um jogo de tabuleiro estratégico para a família se divertir?
Cliente 4: Lucia - CPF: 44455566677
Nova mensagem de Marketing: Lucia, um elegante conjunto de joias para brilhar no Natal!
Cliente 5: Ana - CPF: 77788899990
Nova mensagem de Marketing: Ana, um conjunto de pincéis de maquiagem profissional para realçar sua beleza?
Cliente 6: Carlos - CPF: 22233344455
Nova mensagem de Marketing: Carlos, que tal um smartwatch para monitorar sua saúde e atividades?
```

Podemos conferir todas as mensagens salvas para todos os clientes no dicionário:

```python
for id in id_clientes:
    print(f'Cliente {id}: {clientes[id]["nome"]} - CPF: {clientes[id]["CPF"]}')
    for key in clientes[id]["mensagem_marketing"].keys():
        print(f'Mensagem de Marketing: {clientes[id]["mensagem_marketing"][key]}')
```
Resposta:
```console
Cliente 1: João - CPF: 12345678910
Mensagem de Marketing: Olá João, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Mensagem de Marketing: João, que tal um kit de cervejas artesanais para relaxar no Natal?
Mensagem de Marketing: João, personalize um álbum de fotos com seus melhores momentos do ano!
Cliente 2: Maria - CPF: 98765432100
Mensagem de Marketing: Olá Maria, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Mensagem de Marketing: Maria, um difusor de aromas relaxantes para um Natal tranquilo?
Cliente 3: Pedro - CPF: 11122233344
Mensagem de Marketing: Olá Pedro, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Mensagem de Marketing: Pedro, que tal um jogo de tabuleiro estratégico para a família se divertir?
Cliente 4: Lucia - CPF: 44455566677
Mensagem de Marketing: Olá Lucia, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Mensagem de Marketing: Lucia, um elegante conjunto de joias para brilhar no Natal!
Cliente 5: Ana - CPF: 77788899990
Mensagem de Marketing: Olá Ana, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Mensagem de Marketing: Ana, um conjunto de pincéis de maquiagem profissional para realçar sua beleza?
Cliente 6: Carlos - CPF: 22233344455
Mensagem de Marketing: Olá Carlos, bem vindo ao nosso marketplace! Aproveite nossas ofertas exclusivas!
Mensagem de Marketing: Carlos, que tal um smartwatch para monitorar sua saúde e atividades?
```

O código completo pode ser visto no arquivo **ETL.ipynb**