const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const DIOExplorerAgent = require('../src/agents/explorer-agent');

describe('DIO Explorer Agent', () => {
  let agent;

  beforeEach(() => {
    agent = new DIOExplorerAgent();
  });

  it('deve responder a saudação', () => {
    const resposta = agent.processarMensagem('Olá');
    assert.ok(resposta.includes('Olá'), 'Deve cumprimentar');
    assert.ok(resposta.includes('DIO Explorer'), 'Deve mencionar o DIO Explorer');
  });

  it('deve listar trilhas', () => {
    const resposta = agent.processarMensagem('listar trilhas');
    assert.ok(resposta.includes('Trilhas disponíveis'), 'Deve listar trilhas');
  });

  it('deve listar trilhas por tecnologia', () => {
    const resposta = agent.processarMensagem('trilhas de JavaScript');
    assert.ok(resposta.includes('JavaScript'), 'Deve mencionar JavaScript');
  });

  it('deve listar tecnologias', () => {
    const resposta = agent.processarMensagem('quais tecnologias');
    assert.ok(resposta.includes('Tecnologias disponíveis'), 'Deve listar tecnologias');
  });

  it('deve gerar desafio', () => {
    const resposta = agent.processarMensagem('gerar desafio');
    assert.ok(resposta.includes('Desafio') || resposta.includes('desafio'), 'Deve retornar desafio');
  });

  it('deve gerar desafio filtrado por tecnologia', () => {
    const resposta = agent.processarMensagem('desafio de Python');
    assert.ok(resposta.includes('Python'), 'Deve mencionar Python');
  });

  it('deve listar desafios', () => {
    const resposta = agent.processarMensagem('listar desafios');
    assert.ok(resposta.includes('Desafios'), 'Deve listar desafios');
  });

  it('deve responder ajuda', () => {
    const resposta = agent.processarMensagem('ajuda');
    assert.ok(resposta.includes('Ajuda'), 'Deve mostrar ajuda');
    assert.ok(resposta.includes('TRILHAS'), 'Deve mencionar trilhas');
    assert.ok(resposta.includes('DESAFIOS'), 'Deve mencionar desafios');
    assert.ok(resposta.includes('CERTIFICADO'), 'Deve mencionar certificado');
  });

  it('deve gerar certificado', () => {
    const resposta = agent.processarMensagem('gerar certificado Maria Silva');
    assert.ok(resposta.includes('Certificado gerado'), 'Deve gerar certificado');
    assert.ok(resposta.includes('Maria Silva'), 'Deve mencionar o nome');
  });

  it('deve retornar mensagem de ajuda para certificado sem nome', () => {
    const resposta = agent.processarMensagem('gerar certificado');
    assert.ok(resposta.includes('nome'), 'Deve pedir nome');
  });

  it('deve responder para mensagem não entendida', () => {
    const resposta = agent.processarMensagem('blablabla');
    assert.ok(resposta.includes('Não entendi') || resposta.includes('ajuda'), 'Deve orientar');
  });

  it('deve extrair tecnologia corretamente', () => {
    assert.strictEqual(agent.extrairTecnologia('trilhas de javascript'), 'JavaScript');
    assert.strictEqual(agent.extrairTecnologia('desafio de python basico'), 'Python');
    assert.strictEqual(agent.extrairTecnologia('trilha de react'), 'React');
  });

  it('deve extrair nível corretamente', () => {
    assert.strictEqual(agent.extrairNivel('desafio básico'), 'basico');
    assert.strictEqual(agent.extrairNivel('desafio intermediário'), 'intermediario');
    assert.strictEqual(agent.extrairNivel('desafio avançado'), 'avancado');
  });
});
