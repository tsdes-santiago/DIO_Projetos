const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = 'qwen3:14b-q4_K_M';

async function verificarOllama() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) return { online: false, erro: `Status ${response.status}` };
    const data = await response.json();
    const modelos = data.models || [];
    const qwen3 = modelos.find(m => m.name.includes('qwen3'));
    return {
      online: true,
      modelos: modelos.map(m => m.name),
      qwen3Disponivel: !!qwen3,
      modeloAtual: qwen3 ? qwen3.name : null,
    };
  } catch (err) {
    return { online: false, erro: err.message };
  }
}

async function chat(mensagem, historico = [], opcoes = {}) {
  const model = opcoes.modelo || DEFAULT_MODEL;
  const systemPrompt = opcoes.systemPrompt || obterSystemPrompt();

  const messages = [
    { role: 'system', content: systemPrompt },
    ...historico,
    { role: 'user', content: mensagem },
  ];

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature: opcoes.temperature || 0.7,
        num_predict: opcoes.maxTokens || 1024,
      },
    }),
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(`Ollama erro ${response.status}: ${erro}`);
  }

  const data = await response.json();
  return {
    resposta: data.message?.content || '',
    modelo: data.model,
    totalDuration: data.total_duration,
    evalCount: data.eval_count,
  };
}

async function gerarRespostaStreaming(mensagem, historico = [], opcoes = {}, onChunk) {
  const model = opcoes.modelo || DEFAULT_MODEL;
  const systemPrompt = opcoes.systemPrompt || obterSystemPrompt();

  const messages = [
    { role: 'system', content: systemPrompt },
    ...historico,
    { role: 'user', content: mensagem },
  ];

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      options: {
        temperature: opcoes.temperature || 0.7,
        num_predict: opcoes.maxTokens || 1024,
      },
    }),
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(`Ollama erro ${response.status}: ${erro}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let respostaCompleta = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const linhas = chunk.split('\n').filter(l => l.trim());
    for (const linha of linhas) {
      try {
        const parsed = JSON.parse(linha);
        if (parsed.message?.content) {
          respostaCompleta += parsed.message.content;
          if (onChunk) onChunk(parsed.message.content, respostaCompleta);
        }
      } catch (_) {}
    }
  }

  return respostaCompleta;
}

function obterSystemPrompt() {
  return `Você é o assistente do DIO Explorer, uma plataforma de aprendizagem de programação.
Responda sempre em português brasileiro. Seja objetivo, didático e encorajador.
Você tem acesso às seguintes trilhas de aprendizagem disponíveis na plataforma:
- JavaScript (Básico e Intermediário)
- React Básico
- Node.js Básico
- Python (Básico e Intermediário)
- TypeScript Básico
- Java Básico
- C# Básico
- HTML e CSS Básico
- SQL Básico
- Git e GitHub

Quando o usuário perguntar sobre uma trilha, forneça informações detalhadas.
Quando pedir um desafio, sugira exercícios práticos e forneça exemplos de código.
Quando perguntar sobre certificados, explique o processo de conclusão.`;
}

module.exports = {
  verificarOllama,
  chat,
  gerarRespostaStreaming,
  obterSystemPrompt,
  OLLAMA_BASE_URL,
  DEFAULT_MODEL,
};
