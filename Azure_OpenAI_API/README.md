<h1>
<a href="https://www.dio.me/">
     <img align="center" width="40px" src="https://hermes.digitalinnovation.one/assets/diome/logo-minimized.png"></a>
    <span>Projeto Azure OpenAI Aplicação de Chats e Configurações API</span>
</h1>

# :computer: Descrição

O objetivo deste desafio é explorar o desenvolvimento de aplicações práticas utilizando o Azure OpenAI, incluindo chamadas de API e integração com o Semantic Kernel.

# :bulb: Solução

No portal do azure, após criar o grupo de recursos e o serviço do Azure OpenAI, adicionei os modelos gpt-4.1-mini e dall-e-3 no Azure AI Foundry

<p align=center>
<img src = "modelos.png" witdh=80>
</p>

E adicionei os endpoints e API keys em um arquivo `.env`
## Chamada de API de chat

Um exemplo de chamada de API para chat pode ser visto no arquivo `api_call_chat.py`, em que usei a mensagem para o chat: "Cite um conto infantil famoso no Brasil?",

```console
$ python api_call_chat.py 
Um conto infantil famoso no Brasil é "A Menina do Narizinho Arrebitado", que faz parte das histórias do Sítio do Picapau Amarelo, criadas por Monteiro Lobato. Essas histórias são muito populares e fazem parte da literatura infantil brasileira. Posso ajudar com mais alguma coisa sobre literatura infantil?
```

## Geração de imagem com chamada de API

Um exemplo de geração de imagem com uso de API pode ser visto no arquivo `api_call_text2image.py` em que usei a mensagem: "Um tatu cobrando penalti com uma tartatuga de goleiro no meio da floresta amazônica"

```console
$ python api_call_text2image.py 
https://dalleproduse.blob.core.windows.net/private/images/c947941d-e25c-430a-a4f9-19b1089e96d8/generated_00.png?se=2025-05-23T23%3A12%3A37Z&sig=UQdmI3fC7Aw1N9eRQB2to4Dsgrf5%2FH1HoMEGZwVQ5ic%3D&ske=2025-05-29T08%3A34%3A31Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2025-05-22T08%3A34%3A31Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02
```

<p align=center>
<img src="generated_00.png" width=60%>
</p>


## Chat com memoria

O uso do semantic_kernel possibilita adicionar novos plugins para desenvolver várias tarefas. Além disso ele já gerencia automaticamente algumas tarefas como memória. Adaptando o [tutorial da microsoft learn](https://learn.microsoft.com/en-us/semantic-kernel/get-started/quick-start-guide?pivots=programming-language-python), podemos definir o modelo de chat com o semantic kernel em que ele gerencia automaticamente a memória. O exemplo completo está no arquivo `semantic_kernel_api.py`. A memória é gerenciada com a função:

```python
    # Create a history of the conversation
    history = ChatHistory()
    # Add user input to the history
    history.add_user_message(userInput)
    # Add the message from the agent to the chat history
    history.add_message(result)
```
## Exemplo de chat executado no terminal
```console
$ python semantic_kernel_api.py 
User > Quais destinos turísticos temos no brasil com vinícolas?    
```
Assistant > No Brasil, o turismo de vinícolas tem crescido bastante, especialmente em regiões onde a produção de vinho é tradicional e em desenvolvimento. Abaixo, listo alguns dos principais destinos turísticos no país conhecidos pelas vinícolas:

### 1. **Vale dos Vinhedos (Rio Grande do Sul)**
- **Descrição:** O Vale dos Vinhedos, localizado na serra gaúcha, é a região mais famosa do Brasil para o enoturismo. Possui muitas vinícolas tradicionais e modernas, oferecendo degustações, visitas guiadas, restaurantes e hospedagens rurais.
- **Principais municípios:** Bento Gonçalves, Garibaldi e Monte Belo do Sul.
- **Destaques:** Miolo, Casa Valduga, Aurora, Salton.

### 2. **Serra Gaúcha (Rio Grande do Sul)**
- Além do Vale dos Vinhedos, outras áreas da serra gaúcha também têm vinícolas e produção de vinhos, como Caxias do Sul e Farroupilha, com vinícolas tradicionais e opções de enoturismo.

### 3. **Campanha Gaúcha (Rio Grande do Sul)**
- Região menos conhecida mas com grande potencial, localizada na fronteira com o Uruguai. Vinícolas como a Guatambu e a Don Laurindo vêm ganhando destaque.

### 4. **Campos de Cima da Serra (Rio Grande do Sul)**
- Regiões como São José dos Ausentes e Cambará do Sul têm vinícolas mais recentes, aproveitando o clima mais frio para cultivos diferenciados.

### 5. **São Roque (São Paulo)**
- Conhecida como a "Terra do Vinho", São Roque está bem próxima de São Paulo e oferece várias vinícolas para visitação. É uma opção prática para quem está na capital paulista.
- Destaques: Vinícola Góes, Vinícola Canguera, Vinícola Bella Quinta.

### 6. **Vale do São Francisco (Pernambuco e Bahia)**
- Uma região surpreendente, situada no Nordeste, onde se produz vinhos e espumantes em meio ao clima semiárido, graças à irrigação do rio São Francisco.
- Destaques: Vinícola Rio Sol, Vinícola Miolo (que possui unidade na região).

### 7. **Paraná**
- Algumas vinícolas estão se destacando no interior do Paraná, como em Curitiba (Vinícola Durigan) e em regiões próximas.

---

### Considerações adicionais:
- **Experiência:** Muitas dessas vinícolas oferecem além da degustação e visitação, restaurantes especializados, hospedagem em pousadas e eventos temáticos, como colheita, vindima e festivais do vinho.
- **Melhores meses:** De setembro a abril costumam ser meses mais indicados para visitar, pois coincidem com a época da colheita e boas condições climáticas.

---

Se desejar, posso indicar vinícolas específicas, roteiros ou dicas para visitar alguma dessas regiões!

```console
User > me indique um roteiro para opção 5
```
Assistant > Claro! Aqui está um roteiro de 2 dias para aproveitar o turismo de vinícolas em **São Roque (São Paulo)**, a famosa "Terra do Vinho". O roteiro inclui visitas a vinícolas, degustações, gastronomia e opções de lazer na região.

---

## Roteiro Enoturístico em São Roque (2 dias)

### **Dia 1: Chegada e visita às vinícolas**

#### Manhã
- **Saída de São Paulo**: São Roque fica a cerca de 60 km da capital, aproximadamente 1h30 de carro.
- **Vinícola Góes**  
  - Endereço: Estrada do Vinho, Km 2,5 – Quinta do Olivardo  
  - A vinícola mais tradicional da região, oferece visita guiada por suas instalações, explicando o processo de produção do vinho e cachaça artesanal, além de degustação.  
  - Conta ainda com restaurante e empório.

#### Almoço
- **Restaurante Quinta do Olivardo**  
  - Localizado dentro da própria vinícola Góes, é conhecido pela comida típica italiana e pela carta de vinhos próprios e da região.

#### Tarde
- **Vinícola Bella Quinta**  
  - Endereço: Estrada do Vinho, Km 3  
  - Vinícola boutique que oferece visitação, explicação do processo de produção e degustações de vinhos finos e espumantes.  
  - Espaço aconchegante com loja para compras.

- **Vinícola Canguera**  
  - Localizada também na Estrada do Vinho, é uma vinícola familiar com produção artesanal.  
  - Vale conhecer o processo e provar vinhos e sucos de uva.

#### Noite
- Hospedagem em pousadas próximas à Estrada do Vinho ou no centro de São Roque (há várias opções de pousadas charmosas e confortáveis).

---

### **Dia 2: Turismo e lazer em São Roque**

#### Manhã
- **Parque Temático Ski Mountain Park**  
  - Caso queira variar as atividades, o local oferece opções de lazer como tirolesa, esqui (na pista sintética), montanha russa e trilhas.
- **Centro Histórico de São Roque**  
  - Passeio pelos pontos históricos da cidade, igrejas, praças e lojas.

#### Almoço
- **Restaurante Vila Don Patto**  
  - Restaurante tradicional que combina gastronomia italiana com vinhos da região.

#### Tarde
- Se ainda quiser visitar alguma vinícola ou fazer compras, recomenda-se passar por lojas de vinhos e queijos no centro de São Roque, ou aproveitar para relaxar em alguma pousada ou café local.

---

### Dicas gerais:
- Use roupas confortáveis e calçados adequados para caminhadas.
- Reserve visitas às vinícolas com antecedência, principalmente aos finais de semana.
- Se beber, não dirija. Considere contratar um transfer ou motorista para o passeio.

---

Se desejar, posso ajudar com indicações de pousadas ou restaurantes específicos, assim como sugestões para estender o roteiro!

```console
User > exit
```