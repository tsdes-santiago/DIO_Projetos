const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { gerarCertificado, gerarHTMLCertificado, salvarCertificado } = require('../src/commands/certificado');
const { trilhas } = require('../src/commands/trilha').listarTrilhas ? {} : require('../data/trilhas.json');

describe('Comando Certificado', () => {
  const trilhaTeste = {
    nome: 'JavaScript Básico',
    tecnologia: 'JavaScript',
    nivel: 'basico',
    duracao: '25h',
    modulos: [
      { ordem: 1, titulo: 'Módulo 1', conteudo: 'Conteúdo', duracao: '5h' },
      { ordem: 2, titulo: 'Módulo 2', conteudo: 'Conteúdo', duracao: '5h' },
    ],
  };

  it('deve gerar certificado com dados corretos', () => {
    const cert = gerarCertificado('Maria Silva', trilhaTeste);

    assert.ok(cert.id, 'Certificado deve ter ID');
    assert.ok(cert.id.startsWith('DIO-'), 'ID deve começar com DIO-');
    assert.strictEqual(cert.nomeAluno, 'Maria Silva');
    assert.strictEqual(cert.trilha, 'JavaScript Básico');
    assert.strictEqual(cert.tecnologia, 'JavaScript');
    assert.strictEqual(cert.nivel, 'basico');
    assert.strictEqual(cert.duracao, '25h');
    assert.strictEqual(cert.modulosConcluidos, 2);
    assert.ok(cert.dataConclusao, 'Deve ter data');
    assert.ok(cert.mensagem, 'Deve ter mensagem');
  });

  it('deve gerar HTML válido', () => {
    const cert = gerarCertificado('João', trilhaTeste);
    const html = gerarHTMLCertificado(cert);

    assert.ok(html.includes('<!DOCTYPE html>'), 'Deve ser HTML válido');
    assert.ok(html.includes('Maria Silva') || html.includes('João'), 'Deve conter nome do aluno');
    assert.ok(html.includes('JavaScript Básico'), 'Deve conter nome da trilha');
    assert.ok(html.includes(cert.id), 'Deve conter ID do certificado');
  });

  it('deve salvar arquivos JSON e HTML', () => {
    const dirTeste = path.join(__dirname, 'certificados-teste');
    const cert = gerarCertificado('Teste User', trilhaTeste);
    const arquivos = salvarCertificado(cert, dirTeste);

    assert.ok(fs.existsSync(arquivos.json), 'Arquivo JSON deve existir');
    assert.ok(fs.existsSync(arquivos.html), 'Arquivo HTML deve existir');

    const conteudoJSON = JSON.parse(fs.readFileSync(arquivos.json, 'utf-8'));
    assert.strictEqual(conteudoJSON.nomeAluno, 'Teste User');

    const conteudoHTML = fs.readFileSync(arquivos.html, 'utf-8');
    assert.ok(conteudoHTML.includes('<!DOCTYPE html>'));

    fs.rmSync(dirTeste, { recursive: true, force: true });
  });

  it('deve gerar IDs únicos', () => {
    const cert1 = gerarCertificado('Aluno 1', trilhaTeste);
    const cert2 = gerarCertificado('Aluno 2', trilhaTeste);
    assert.notStrictEqual(cert1.id, cert2.id, 'IDs devem ser únicos');
  });

  it('mensagem deve conter nome do aluno', () => {
    const cert = gerarCertificado('Ana Beatriz', trilhaTeste);
    assert.ok(cert.mensagem.includes('Ana Beatriz'), 'Mensagem deve mencionar o aluno');
  });
});
