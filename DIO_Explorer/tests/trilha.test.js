const { describe, it } = require('node:test');
const assert = require('node:assert');
const { listarTrilhas, buscarTrilha, listarTecnologias } = require('../src/commands/trilha');

describe('Comando Trilha', () => {
  it('deve listar todas as trilhas', () => {
    const trilhas = listarTrilhas();
    assert.ok(trilhas.length > 0, 'Deve retornar pelo menos uma trilha');
  });

  it('deve filtrar trilhas por tecnologia', () => {
    const trilhasJS = listarTrilhas('JavaScript');
    assert.ok(trilhasJS.length > 0, 'Deve retornar trilhas de JavaScript');
    trilhasJS.forEach(t => {
      assert.strictEqual(t.tecnologia, 'JavaScript');
    });
  });

  it('deve retornar array vazio para tecnologia inexistente', () => {
    const trilhas = listarTrilhas('Rust');
    assert.strictEqual(trilhas.length, 0);
  });

  it('deve buscar trilha por ID', () => {
    const trilha = buscarTrilha('javascript-basico');
    assert.ok(trilha, 'Trilha deve existir');
    assert.strictEqual(trilha.nome, 'JavaScript Básico');
    assert.strictEqual(trilha.tecnologia, 'JavaScript');
    assert.strictEqual(trilha.nivel, 'basico');
  });

  it('deve retornar null para trilha inexistente', () => {
    const trilha = buscarTrilha('trilha-inexistente');
    assert.strictEqual(trilha, null);
  });

  it('deve listar tecnologias disponíveis', () => {
    const tecnologias = listarTecnologias();
    assert.ok(tecnologias.length > 0, 'Deve ter pelo menos uma tecnologia');
    assert.ok(tecnologias.includes('JavaScript'), 'Deve incluir JavaScript');
    assert.ok(tecnologias.includes('Python'), 'Deve incluir Python');
  });

  it('cada trilha deve ter estrutura válida', () => {
    const trilhas = listarTrilhas();
    trilhas.forEach(t => {
      assert.ok(t.id, 'Trilha deve ter id');
      assert.ok(t.nome, 'Trilha deve ter nome');
      assert.ok(t.tecnologia, 'Trilha deve ter tecnologia');
      assert.ok(t.nivel, 'Trilha deve ter nivel');
      assert.ok(t.duracao, 'Trilha deve ter duracao');
      assert.ok(Array.isArray(t.modulos), 'Trilha deve ter modulos como array');
      assert.ok(t.modulos.length > 0, 'Trilha deve ter pelo menos 1 módulo');
    });
  });

  it('módulos devem ter estrutura válida', () => {
    const trilhas = listarTrilhas();
    trilhas.forEach(t => {
      t.modulos.forEach(m => {
        assert.ok(m.ordem, 'Módulo deve ter ordem');
        assert.ok(m.titulo, 'Módulo deve ter titulo');
        assert.ok(m.conteudo, 'Módulo deve ter conteudo');
        assert.ok(m.duracao, 'Módulo deve ter duracao');
      });
    });
  });
});
