<h1>
<a href="https://www.dio.me/">
     <img align="center" width="40px" src="https://hermes.digitalinnovation.one/assets/diome/logo-minimized.png"></a>
    <span>Conversando por Voz Com o LLM Utilizando Whisper e Python</span>
</h1>

O objetivo dessa atividade é implementar uma solução speech-to-text que utiliza o modelo Whisper para transcrever o audio para texto, processar utilizando uma LLM e uma solução text-to-speech para obter a resposta de texto para voz.

Este projeto implementa um assistente de voz completo e de baixa latência rodando 100% localmente. A solução integra captura de áudio, transcrição (STT), processamento de linguagem natural (LLM) e síntese de voz (TTS), otimizada para a arquitetura **NVIDIA Blackwell (RTX 50)**.

# :computer: Ambiente de Desenvolvimento

```text
====================== Informações do Sistema e Hardware ========================
Plataforma: Linux
Versão do SO: 6.12.63-1-MANJARO
Arquitetura: x86_64
Processador: AMD Ryzen 9 9950X3D 16-Core Processor
RAM Total: 60 GB
CPU Cores (físicos): 16
CPU Cores (lógicos): 32
GPU Name: NVIDIA GeForce RTX 5070 Ti
CUDA version PyTorch was built with: 12.8
Python version: 3.11.14
PyTorch version: 2.11.0.dev20260108+cu128
======================================== ========================================
```

# 🛠️ Stack Tecnológica

* **Gerenciamento de Pacotes:** `uv` (Fast Python package installer).
* **Speech-to-Text (STT):** `faster-whisper` utilizando o modelo **Medium** em `float16`.
* **LLM (Cérebro):** `Gemma 3:12b-it-qat` via **Ollama**.
* **Text-to-Speech (TTS):** `Piper` (Modelos ONNX) para síntese de voz brasileira natural.
* **Audio I/O:** `sounddevice` e `scipy`.


# 🚀 Instalação e Configuração

## 1. Preparação do Ambiente

Utilizando o `uv` para garantir a velocidade de instalação e compatibilidade com CUDA 12.8:

```bash
# Criação do ambiente virtual
uv venv --python 3.11
source .venv/bin/activate

# Aumentar o timeout de 30s para 120s para evitar erro no download
UV_HTTP_TIMEOUT=120
# Instalação do PyTorch Nightly (Suporte para RTX 50 / CUDA 12.8)
uv pip install --pre torch torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128

# Instalação das dependências do pipeline
uv pip install faster-whisper ollama ipykernel piper-tts sounddevice scipy "numpy<2.0"

```

## 2. Download dos Modelos TTS (Português Brasil)

O projeto utiliza o Piper para uma voz natural sem sotaque estrangeiro:

```bash
# Modelo de voz (Faber Medium)
curl -L "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx" -o voz_br.onnx
# Configuração do modelo
curl -L "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json" -o voz_br.onnx.json

```

# 🧩 Componentes do Projeto

O projeto completo está no arquivo `speech_with_LLM.ipynb`.

Certifique-se de que o **Ollama** está rodando com o modelo Gemma 3: `ollama run gemma3:12b-it-qat`.

## 1. Audição

O audio capturado utiliza o `sounddevice` para captura de áudio em 16kHz. O audio é salvo em um arquivo temporário para o Whisper ler.

```python
import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write
import tempfile
import os

def gravar_audio(duracao_segundos=5, taxa_amostragem=16000):

    """
    Grava áudio do microfone e salva em um arquivo temporário.
    Grava áudio do microfone e salva em um arquivo temporário.
    O Whisper funciona melhor com 16000Hz.
    """
    print(f"🎤 Ouvindo por {duracao_segundos} segundos... Fale agora!")

    # Captura o áudio (mono, float32)

    gravacao = sd.rec(
    int(duracao_segundos * taxa_amostragem),
    samplerate=taxa_amostragem,
    channels=1,
    dtype='float32'
    )

    # Aguarda a gravação terminar

    sd.wait()
    print("✅ Gravação finalizada.")

    # Salva em um arquivo temporário para o Whisper ler

    temp_file = tempfile.mktemp(suffix='.wav')
    write(temp_file, taxa_amostragem, gravacao)

    return temp_file

# Teste rápido de gravação:

arquivo_teste = gravar_audio(duracao_segundos=4)
```

## 2. Transcrição (STT)
O Whisper captura o áudio em 16kHz e converte para texto. O modelo `medium` foi escolhido pelo equilíbrio entre precisão fonética em português e velocidade na RTX 5070 Ti.

```python
from faster_whisper import WhisperModel
import os

# 1. Inicialização do modelo (se ainda não o fez nesta sessão)
# Para a série 50, o flash_attention pode acelerar ainda mais se disponível
print("🚀 Carregando modelo na RTX 5070 Ti...")
model_stt = WhisperModel(
    "medium", 
    device="cuda", 
    compute_type="float16"
)

def transcrever_audio(caminho_arquivo):
    if not os.path.exists(caminho_arquivo):
        print("❌ Arquivo não encontrado!")
        return ""

    print("🔍 Iniciando transcrição...")
    
    # Parâmetros vitais para evitar transcrições vazias:
    # - language="pt": Evita que ele perca tempo tentando identificar o idioma.
    # - vad_filter=True: Remove silêncios brancos que podem confundir o modelo.
    # - beam_size=5: Melhora a precisão da busca.
    segments, info = model_stt.transcribe(
        caminho_arquivo, 
        beam_size=5,
        language="pt",
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=500)
    )

    print(f"Detectado idioma: {info.language} (Probabilidade: {info.language_probability:.2f})")

    texto_final = ""
    # Itera pelos segmentos e imprime conforme aparecem
    for segment in segments:
        # CORREÇÃO: Usamos .2f para float. O 's' de segundos deve ficar fora das chaves.
        print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
        texto_final += segment.text + " "

    return texto_final.strip()
```

## 3. Inteligência (LLM)

O **Gemma 3** processa a transcrição. Foi aplicado um filtro de limpeza para remover tokens de parada como `</end_of_turn>`, garantindo que a resposta enviada ao sintetizador seja limpa.

```python
import ollama

def testar_gemma(texto_usuario):
    try:
        response = ollama.chat(
            model='gemma3:12b-it-qat', 
            messages=[
                {'role': 'system', 'content': 'Você é um assistente conciso. Responda apenas com texto puro.'},
                {'role': 'user', 'content': texto_usuario},
            ]
        )
        
        resposta_texto = response['message']['content']
        
        # LIMPEZA: Remove tokens de parada e espaços extras
        tokens_para_remover = ["</end_of_turn>", "<pad>", "<eos>"]
        for token in tokens_para_remover:
            resposta_texto = resposta_texto.replace(token, "")
            
        resposta_texto = resposta_texto.strip()
        
        print(f"🤖 Oráculo: {resposta_texto}")
        return resposta_texto

    except Exception as e:
        print(f"❌ Erro: {e}")
        return "Erro na inteligência."

# Teste manual
resposta = testar_gemma("Quem é você e qual placa de vídeo você está usando?")
```

## 4. Voz (TTS)

O sintetizador processa a resposta em chunks de áudio PCM, convertendo-os em arrays NumPy para reprodução imediata via `sounddevice`, eliminando a necessidade de escrita constante em disco.

```python
import numpy as np
import sounddevice as sd
from piper.voice import PiperVoice

# 1. Carregar o modelo
model_path = "voz_br.onnx"
config_path = "voz_br.onnx.json"
voice = PiperVoice.load(model_path, config_path)

def sintetizar_voz_br(texto):
    print("🗣️ Sintetizando áudio (Piper PT-BR)...")
    
    audio_segments = []
    
    # Iteramos sobre os chunks gerados pelo Piper
    for chunk in voice.synthesize(texto):
        # Baseado no seu dir(chunk), o atributo correto é audio_int16_array
        if hasattr(chunk, 'audio_int16_array'):
            audio_segments.append(chunk.audio_int16_array)
    
    if not audio_segments:
        print("❌ Nenhum dado de áudio foi gerado.")
        return

    # Concatena os arrays NumPy
    full_audio = np.concatenate(audio_segments)
    
    # Normaliza int16 -> float32 para o sounddevice (divisão por 32768)
    audio_float = full_audio.astype(np.float32) / 32768.0
    
    # Taxa de amostragem padrão (22050Hz para o modelo Faber)
    rate = 22050 
    
    print(f"🔊 Reproduzindo na sua RTX 5070 Ti...")
    sd.play(audio_float, samplerate=rate)
    sd.wait()
    print("✅ Concluído!")

# Teste final:
sintetizar_voz_br("O oráculo está vivo e falando português brasileiro perfeitamente!")
```

## Pipeline completo


```python
# 1. Grava e Transcreve (o que fizemos antes)
arquivo_audio = gravar_audio(duracao_segundos=5)
texto_pergunta = transcrever_audio(arquivo_audio)

if texto_pergunta:
    # 2. Envia para a LLM
    resposta_ia = testar_gemma(texto_pergunta)
    
    # 3. Faz a IA falar (usando a função do Piper que validamos)
    sintetizar_voz_br(resposta_ia)
else:
    print("Nenhum texto detectado para enviar à LLM.")
```

O assistente funcionou corretamente e imprime as etapas com sucesso.

```text
🎤 Ouvindo por 5 segundos... Fale agora!
✅ Gravação finalizada.
🔍 Iniciando transcrição...
Detectado idioma: pt (Probabilidade: 1.00)
[0.18s -> 3.18s]  Qual a melhor forma de estudar a programação?
🤖 Oráculo: Prática, projetos, comunidade, recursos online.
🗣️ Sintetizando áudio (Piper PT-BR)...
🔊 Reproduzindo na sua RTX 5070 Ti...
✅ Concluído!
```