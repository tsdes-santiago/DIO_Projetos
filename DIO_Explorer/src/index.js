#!/usr/bin/env node

const path = require('path');
const { listarTrilhas, buscarTrilha, listarTecnologias } = require('./commands/trilha');
const { buscarDesafios, buscarDesafio, desafioAleatorio } = require('./commands/desafio');
const { gerarCertificado, salvarCertificado } = require('./commands/certificado');

const args = process.argv.slice(2);
const comando = args[0];

function exibirAjuda() {
  console.log(`
╔══════════════════════════════════════════════════════╗
║           DIO Explorer - Explore Aprenda Conquiste   ║
╚══════════════════════════════════════════════════════╝

Uso: dio-explorer <comando> [opções]

Comandos disponíveis:
  trilha [tecnologia]              Lista trilhas ou filtra por tecnologia
  trilha --id <id>                 Mostra detalhes de uma trilha específica
  trilha --tecnologias             Lista todas as tecnologias disponíveis
  desafio [tecnologia] [nivel]     Gera um desafio aleatório
  desafio --listar [tech] [nivel]  Lista desafios disponíveis
  desafio --id <id>                Mostra um desafio específico
  certificado <nome> <trilha>      Gera um certificado para uma trilha concluída
  ajuda                            Exibe esta mensagem

Exemplos:
  dio-explorer trilha
  dio-explorer trilha JavaScript
  dio-explorer trilha --id react-basico
  dio-explorer desafio JavaScript basico
  dio-explorer desafio --listar Python
  dio-explorer certificado "Maria Silva" "JavaScript Básico"
`);
}

function formatarTrilha(trilha) {
  const nivelFormatado = trilha.nivel.charAt(0).toUpperCase() + trilha.nivel.slice(1);
  let saida = `
┌─────────────────────────────────────────────
│ 📚 ${trilha.nome}
├─────────────────────────────────────────────
│ Tecnologia: ${trilha.tecnologia}
│ Nível: ${nivelFormatado}
│ Duração: ${trilha.duracao}
│ Módulos: ${trilha.modulos.length}
├─────────────────────────────────────────────`;

  trilha.modulos.forEach(m => {
    saida += `
│   ${m.ordem}. ${m.titulo} (${m.duracao})
│      ${m.conteudo}`;
  });

  saida += `
└─────────────────────────────────────────────`;
  return saida;
}

function formatarDesafio(desafio) {
  const nivelFormatado = desafio.nivel.charAt(0).toUpperCase() + desafio.nivel.slice(1);
  return `
╔══════════════════════════════════════════════╗
║  🎯 Desafio: ${desafio.titulo}
╠══════════════════════════════════════════════╣
║ Tecnologia: ${desafio.tecnologia}
║ Nível: ${nivelFormatado}
╠══════════════════════════════════════════════╣
║ ENUNCIADO:
║ ${desafio.enunciado}
╠══════════════════════════════════════════════╣
║ Exemplo de entrada: ${desafio.exemplo_entrada}
║ Exemplo de saída: ${desafio.exemplo_saida}
╠══════════════════════════════════════════════╣
║ 💡 Dica: ${desafio.dica}
╚══════════════════════════════════════════════╝`;
}

function formatarCertificado(certificado) {
  return `
╔══════════════════════════════════════════════╗
║     🎓 CERTIFICADO DE CONCLUSÃO             ║
╠══════════════════════════════════════════════╣
║ ID: ${certificado.id}
║ Aluno: ${certificado.nomeAluno}
║ Trilha: ${certificado.trilha}
║ Tecnologia: ${certificado.tecnologia}
║ Nível: ${certificado.nivel}
║ Duração: ${certificado.duracao}
║ Módulos: ${certificado.modulosConcluidos}
║ Data: ${certificado.dataConclusao}
╠══════════════════════════════════════════════╣
║ ${certificado.mensagem}
╚══════════════════════════════════════════════╝`;
}

function executar() {
  if (!comando || comando === 'ajuda' || comando === '--help') {
    exibirAjuda();
    return;
  }

  switch (comando) {
    case 'trilha': {
      const flag = args[1];

      if (flag === '--tecnologias') {
        const tecnologias = listarTecnologias();
        console.log('\n📋 Tecnologias disponíveis:\n');
        tecnologias.forEach(t => console.log(`  • ${t}`));
        return;
      }

      if (flag === '--id') {
        const id = args[2];
        if (!id) {
          console.error('❌ Informe o ID da trilha. Use: dio-explorer trilha --id <id>');
          return;
        }
        const trilha = buscarTrilha(id);
        if (!trilha) {
          console.error(`❌ Trilha com ID "${id}" não encontrada.`);
          const { trilhas } = require('./commands/trilha').listarTrilhas ? { trilhas: [] } : require('../data/trilhas.json');
          console.log('IDs disponíveis:', trilhas.map(t => t.id).join(', '));
          return;
        }
        console.log(formatarTrilha(trilha));
        return;
      }

      const tecnologia = flag;
      const trilhas = listarTrilhas(tecnologia || null);
      if (trilhas.length === 0) {
        console.log(`❌ Nenhuma trilha encontrada${tecnologia ? ` para "${tecnologia}"` : ''}.`);
        console.log('Use "dio-explorer trilha --tecnologias" para ver as disponíveis.');
        return;
      }

      console.log(`\n📚 Trilhas${tecnologia ? ` de ${tecnologia}` : ''} disponíveis:\n`);
      trilhas.forEach(t => {
        const nivelFormatado = t.nivel.charAt(0).toUpperCase() + t.nivel.slice(1);
        console.log(`  • ${t.id} | ${t.nome} | ${nivelFormatado} | ${t.duracao}`);
      });
      console.log('\n💡 Use "dio-explorer trilha --id <id>" para ver detalhes.\n');
      break;
    }

    case 'desafio': {
      const flag = args[1];

      if (flag === '--listar') {
        const tecnologia = args[2];
        const nivel = args[3];
        const desafios = buscarDesafios(tecnologia || null, nivel || null);
        if (desafios.length === 0) {
          console.log('❌ Nenhum desafio encontrado com esses filtros.');
          return;
        }
        console.log(`\n🎯 Desafios encontrados (${desafios.length}):\n`);
        desafios.forEach(d => {
          const nivelFormatado = d.nivel.charAt(0).toUpperCase() + d.nivel.slice(1);
          console.log(`  • ${d.id} | ${d.titulo} | ${d.tecnologia} | ${nivelFormatado}`);
        });
        return;
      }

      if (flag === '--id') {
        const id = args[2];
        if (!id) {
          console.error('❌ Informe o ID do desafio.');
          return;
        }
        const desafio = buscarDesafio(id);
        if (!desafio) {
          console.error(`❌ Desafio com ID "${id}" não encontrado.`);
          return;
        }
        console.log(formatarDesafio(desafio));
        return;
      }

      const tecnologia = flag;
      const nivel = args[2];
      const desafio = desafioAleatorio(tecnologia || null, nivel || null);
      if (!desafio) {
        console.log('❌ Nenhum desafio encontrado com esses filtros.');
        console.log('Use "dio-explorer desafio --listar" para ver todos disponíveis.');
        return;
      }
      console.log(formatarDesafio(desafio));
      break;
    }

    case 'certificado': {
      const nome = args[1];
      const nomeTrilha = args[2];

      if (!nome || !nomeTrilha) {
        console.error('❌ Uso: dio-explorer certificado <nome> <trilha>');
        console.error('   Exemplo: dio-explorer certificado "Maria Silva" "JavaScript Básico"');
        return;
      }

      const { trilhas } = require('../data/trilhas.json');
      const trilha = trilhas.find(t => t.nome.toLowerCase() === nomeTrilha.toLowerCase());

      if (!trilha) {
        console.error(`❌ Trilha "${nomeTrilha}" não encontrada.`);
        console.log('Trilhas disponíveis:');
        trilhas.forEach(t => console.log(`  • ${t.nome}`));
        return;
      }

      const certificado = gerarCertificado(nome, trilha);
      const arquivos = salvarCertificado(certificado);

      console.log(formatarCertificado(certificado));
      console.log(`\n📁 Arquivos gerados:`);
      console.log(`   JSON: ${arquivos.json}`);
      console.log(`   HTML: ${arquivos.html}`);
      console.log('\n✨ Abrir o HTML no navegador para visualizar o certificado.\n');
      break;
    }

    default:
      console.error(`❌ Comando desconhecido: "${comando}"`);
      console.log('Use "dio-explorer ajuda" para ver os comandos disponíveis.');
  }
}

executar();
