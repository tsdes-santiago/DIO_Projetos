const { describe, it } = require('node:test');
const assert = require('node:assert');
const { buscarDesafios, buscarDesafio, desafioAleatorio } = require('../src/commands/desafio');

describe('Comando Desafio', () => {
  it('deve listar todos os desafios', () => {
    const desafios = buscarDesafios();
    assert.ok(desafios.length > 0, 'Deve retornar pelo menos um desafio');
  });

  it('deve filtrar desafios por tecnologia', () => {
    const desafios = buscarDesafios('JavaScript');
    assert.ok(desafios.length > 0, 'Deve retornar desafios de JavaScript');
    desafios.forEach(d => {
      assert.strictEqual(d.tecnologia, 'JavaScript');
    });
  });

  it('deve filtrar desafios por nível', () => {
    const desafios = buscarDesafios(null, 'basico');
    assert.ok(desafios.length > 0, 'Deve retornar desafios básicos');
    desafios.forEach(d => {
      assert.strictEqual(d.nivel, 'basico');
    });
  });

  it('deve filtrar por tecnologia e nível', () => {
    const desafios = buscarDesafios('Python', 'basico');
    desafios.forEach(d => {
      assert.strictEqual(d.tecnologia, 'Python');
      assert.strictEqual(d.nivel, 'basico');
    });
  });

  it('deve retornar array vazio para filtros inexistentes', () => {
    const desafios = buscarDesafios('Rust', 'avancado');
    assert.strictEqual(desafios.length, 0);
  });

  it('deve buscar desafio por ID', () => {
    const desafio = buscarDesafio('js-basico-01');
    assert.ok(desafio, 'Desafio deve existir');
    assert.strictEqual(desafio.titulo, 'FizzBuzz');
    assert.strictEqual(desafio.tecnologia, 'JavaScript');
  });

  it('deve retornar null para desafio inexistente', () => {
    const desafio = buscarDesafio('desafio-inexistente');
    assert.strictEqual(desafio, null);
  });

  it('deve retornar desafio aleatório', () => {
    const desafio = desafioAleatorio();
    assert.ok(desafio, 'Deve retornar um desafio');
    assert.ok(desafio.id, 'Desafio deve ter id');
    assert.ok(desafio.titulo, 'Desafio deve ter titulo');
  });

  it('deve retornar desafio aleatório filtrado', () => {
    const desafio = desafioAleatorio('JavaScript', 'basico');
    assert.ok(desafio, 'Deve retornar um desafio');
    assert.strictEqual(desafio.tecnologia, 'JavaScript');
    assert.strictEqual(desafio.nivel, 'basico');
  });

  it('deve retornar null para desafio aleatório com filtro inválido', () => {
    const desafio = desafioAleatorio('Rust', 'avancado');
    assert.strictEqual(desafio, null);
  });

  it('cada desafio deve ter estrutura válida', () => {
    const desafios = buscarDesafios();
    desafios.forEach(d => {
      assert.ok(d.id, 'Desafio deve ter id');
      assert.ok(d.tecnologia, 'Desafio deve ter tecnologia');
      assert.ok(d.nivel, 'Desafio deve ter nivel');
      assert.ok(d.titulo, 'Desafio deve ter titulo');
      assert.ok(d.enunciado, 'Desafio deve ter enunciado');
      assert.ok(d.exemplo_entrada, 'Desafio deve ter exemplo_entrada');
      assert.ok(d.exemplo_saida, 'Desafio deve ter exemplo_saida');
      assert.ok(d.dica, 'Desafio deve ter dica');
      assert.ok(d.solucao_sugerida, 'Desafio deve ter solucao_sugerida');
    });
  });
});
