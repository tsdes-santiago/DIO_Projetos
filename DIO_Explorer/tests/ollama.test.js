const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  verificarOllama,
  chat,
  obterSystemPrompt,
  OLLAMA_BASE_URL,
  DEFAULT_MODEL,
} = require('../src/ollama/ollama');

describe('Módulo Ollama', () => {
  it('deve exportar constantes corretas', () => {
    assert.ok(OLLAMA_BASE_URL, 'OLLAMA_BASE_URL deve existir');
    assert.strictEqual(DEFAULT_MODEL, 'qwen3:14b-q4_K_M');
  });

  it('deve ter system prompt definido', () => {
    const prompt = obterSystemPrompt();
    assert.ok(prompt.includes('DIO Explorer'));
    assert.ok(prompt.includes('JavaScript'));
    assert.ok(prompt.includes('Python'));
    assert.ok(prompt.includes('português'));
  });

  it('verificarOllama deve retornar status', async () => {
    const status = await verificarOllama();
    assert.ok(typeof status.online === 'boolean');
    if (!status.online) {
      assert.ok(status.erro);
    } else {
      assert.ok(Array.isArray(status.modelos));
    }
  });

  it('chat deve retornar estrutura correta quando Ollama está offline', async () => {
    const status = await verificarOllama();
    if (!status.online) {
      try {
        await chat('teste');
        assert.fail('Deveria ter lançado erro');
      } catch (err) {
        assert.ok(err.message.includes('fetch') || err.message.includes('ECONNREFUSED') || err.message.includes('Erro'));
      }
    }
  });
});

describe('Módulo Ollama - Integração (requer Ollama rodando)', { skip: false }, () => {
  it('chat deve retornar resposta quando Ollama está online', async () => {
    const status = await verificarOllama();
    if (!status.online) {
      console.log('  ⏭ Pulado: Ollama não está rodando');
      return;
    }
    const resultado = await chat('Olá, responda apenas com "Oi"');
    assert.ok(resultado.resposta, 'Deve ter resposta');
    assert.ok(resultado.modelo, 'Deve informar modelo');
  });

  it('chat com histórico deve funcionar', async () => {
    const status = await verificarOllama();
    if (!status.online) {
      console.log('  ⏭ Pulado: Ollama não está rodando');
      return;
    }
    const historico = [
      { role: 'user', content: 'Meu nome é Pedro' },
      { role: 'assistant', content: 'Olá Pedro!' },
    ];
    const resultado = await chat('Qual é o meu nome?', historico);
    assert.ok(resultado.resposta);
  });
});
