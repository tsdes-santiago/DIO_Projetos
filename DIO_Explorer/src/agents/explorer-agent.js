#!/usr/bin/env node

const path = require('path');
const { trilhas } = require(path.join(__dirname, '../../data/trilhas.json'));
const { desafios } = require(path.join(__dirname, '../../data/desafios.json'));
const { gerarCertificado, salvarCertificado } = require('../commands/certificado');

class DIOExplorerAgent {
  constructor() {
    this.trilhas = trilhas;
    this.desafios = desafios;
  }

  processarMensagem(mensagem) {
    const msgOriginal = mensagem;
    const msg = mensagem.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (msg.includes('trilha') && (msg.includes('listar') || msg.includes('todas') || msg.includes('mostrar'))) {
      return this.listarTrilhas();
    }

    if (msg.includes('trilha') && msg.includes('tecnologia')) {
      const tech = this.extrairTecnologia(msg);
      return this.listarTrilhasPorTecnologia(tech);
    }

    if (msg.includes('trilha')) {
      const tech = this.extrairTecnologia(msg);
      if (tech) {
        return this.listarTrilhasPorTecnologia(tech);
      }
      return this.listarTrilhas();
    }

    if (msg.includes('desafio') && (msg.includes('gerar') || msg.includes('random') || msg.includes('aleatorio') || msg.includes('sortear'))) {
      const tech = this.extrairTecnologia(msg);
      const nivel = this.extrairNivel(msg);
      return this.gerarDesafio(tech, nivel);
    }

    if (msg.includes('desafio') && msg.includes('listar')) {
      const tech = this.extrairTecnologia(msg);
      const nivel = this.extrairNivel(msg);
      return this.listarDesafios(tech, nivel);
    }

    if (msg.includes('desafio')) {
      const tech = this.extrairTecnologia(msg);
      const nivel = this.extrairNivel(msg);
      return this.gerarDesafio(tech, nivel);
    }

    if (msg.includes('certificado')) {
      const nome = this.extrairNome(msgOriginal);
      if (nome) {
        return this.gerarCertificado(nome);
      }
      return 'Para gerar um certificado, preciso do seu nome. Exemplo: "gerar certificado Maria Silva"';
    }

    if (msg.includes('tecnologia') || msg.includes('tecnologias')) {
      return this.listarTecnologias();
    }

    if (msg.includes('nivel') || msg.includes('niveis')) {
      return 'Níveis disponíveis: básico, intermediário, avançado';
    }

    if (msg.includes('ajuda') || msg.includes('help') || msg.includes('o que voce faz')) {
      return this.obterAjuda();
    }

    if (msg.includes('ola') || msg.includes('oi') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite')) {
      return 'Olá! Sou o assistente do DIO Explorer. Posso ajudá-lo com:\n• Listar trilhas de aprendizagem\n• Gerar desafios de código\n• Gerar certificados fictícios\n\nDigite "ajuda" para mais informações.';
    }

    return 'Não entendi sua solicitação. Digite "ajuda" para ver o que posso fazer.';
  }

  extrairTecnologia(msg) {
    const tecnologiasUnicas = [...new Set(this.trilhas.map(t => t.tecnologia))];
    for (const tech of tecnologiasUnicas) {
      if (msg.includes(tech.toLowerCase())) {
        return tech;
      }
    }
    return null;
  }

  extrairNivel(msg) {
    if (msg.includes('basico') || msg.includes('básico') || msg.includes('iniciante')) return 'basico';
    if (msg.includes('intermediario') || msg.includes('intermediário') || msg.includes('medio')) return 'intermediario';
    if (msg.includes('avancado') || msg.includes('avançado') || msg.includes('expert')) return 'avancado';
    return null;
  }

  extrairNome(msg) {
    const match = msg.match(/certificado\s+(?:de\s+)?(.+)/i);
    if (match) return match[1].trim();
    return null;
  }

  listarTrilhas() {
    if (this.trilhas.length === 0) return 'Nenhuma trilha disponível.';
    let saida = `📚 Trilhas disponíveis (${this.trilhas.length}):\n\n`;
    this.trilhas.forEach(t => {
      const nivel = t.nivel.charAt(0).toUpperCase() + t.nivel.slice(1);
      saida += `• ${t.nome} | ${t.tecnologia} | ${nivel} | ${t.duracao}\n`;
    });
    return saida;
  }

  listarTrilhasPorTecnologia(tecnologia) {
    const filtradas = this.trilhas.filter(t => t.tecnologia.toLowerCase() === tecnologia.toLowerCase());
    if (filtradas.length === 0) return `Nenhuma trilha encontrada para "${tecnologia}".`;
    let saida = `📚 Trilhas de ${tecnologia}:\n\n`;
    filtradas.forEach(t => {
      const nivel = t.nivel.charAt(0).toUpperCase() + t.nivel.slice(1);
      saida += `• ${t.nome} | ${nivel} | ${t.duracao} | ${t.modulos.length} módulos\n`;
    });
    return saida;
  }

  listarTecnologias() {
    const tecnologias = [...new Set(this.trilhas.map(t => t.tecnologia))];
    return `🔬 Tecnologias disponíveis:\n${tecnologias.map(t => `• ${t}`).join('\n')}`;
  }

  gerarDesafio(tecnologia = null, nivel = null) {
    let resultado = this.desafios;
    if (tecnologia) resultado = resultado.filter(d => d.tecnologia.toLowerCase() === tecnologia.toLowerCase());
    if (nivel) resultado = resultado.filter(d => d.nivel.toLowerCase() === nivel.toLowerCase());
    if (resultado.length === 0) return '❌ Nenhum desafio encontrado com esses filtros.';
    const desafio = resultado[Math.floor(Math.random() * resultado.length)];
    const nivelFormatado = desafio.nivel.charAt(0).toUpperCase() + desafio.nivel.slice(1);
    return `🎯 Desafio: ${desafio.titulo}\n\n` +
           `Tecnologia: ${desafio.tecnologia}\n` +
           `Nível: ${nivelFormatado}\n\n` +
           `ENUNCIADO:\n${desafio.enunciado}\n\n` +
           `Exemplo: ${desafio.exemplo_entrada} → ${desafio.exemplo_saida}\n\n` +
           `💡 Dica: ${desafio.dica}`;
  }

  listarDesafios(tecnologia = null, nivel = null) {
    let resultado = this.desafios;
    if (tecnologia) resultado = resultado.filter(d => d.tecnologia.toLowerCase() === tecnologia.toLowerCase());
    if (nivel) resultado = resultado.filter(d => d.nivel.toLowerCase() === nivel.toLowerCase());
    if (resultado.length === 0) return 'Nenhum desafio encontrado.';
    let saida = `🎯 Desafios (${resultado.length}):\n\n`;
    resultado.forEach(d => {
      const nivelFormatado = d.nivel.charAt(0).toUpperCase() + d.nivel.slice(1);
      saida += `• ${d.titulo} | ${d.tecnologia} | ${nivelFormatado}\n`;
    });
    return saida;
  }

  gerarCertificado(nome) {
    const trilha = this.trilhas[Math.floor(Math.random() * this.trilhas.length)];
    const cert = gerarCertificado(nome, trilha);
    const arquivos = salvarCertificado(cert);
    return `🎓 Certificado gerado com sucesso!\n\n` +
           `Aluno: ${cert.nomeAluno}\n` +
           `Trilha: ${cert.trilha}\n` +
           `Tecnologia: ${cert.tecnologia}\n` +
           `Data: ${cert.dataConclusao}\n` +
           `ID: ${cert.id}\n\n` +
           `📁 Arquivos:\n• ${arquivos.json}\n• ${arquivos.html}`;
  }

  obterAjuda() {
    return `
╔══════════════════════════════════════════════╗
║       DIO Explorer Agent - Ajuda            ║
╠══════════════════════════════════════════════╣

O que posso fazer:

📚 TRILHAS
  • "listar trilhas" - Lista todas as trilhas
  • "trilhas de JavaScript" - Filtra por tecnologia
  • "quais tecnologias" - Lista tecnologias disponíveis

🎯 DESAFIOS
  • "gerar desafio" - Gera um desafio aleatório
  • "desafio de Python" - Filtra por tecnologia
  • "desafio básico" - Filtra por nível
  • "listar desafios" - Lista todos os desafios

🎓 CERTIFICADO
  • "gerar certificado Maria Silva" - Gera certificado

💡 OUTROS
  • "ajuda" - Esta mensagem
  • "olá" - Saudação

╚══════════════════════════════════════════════╝`;
  }
}

if (require.main === module) {
  const agent = new DIOExplorerAgent();
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('🤖 DIO Explorer Agent iniciado! Digite "ajuda" para ver os comandos.\n');

  const pergunta = () => {
    rl.question('Você: ', (resposta) => {
      if (resposta.toLowerCase() === 'sair') {
        console.log('Até mais!');
        rl.close();
        return;
      }
      const respostaAgent = agent.processarMensagem(resposta);
      console.log(`\nAgent: ${respostaAgent}\n`);
      pergunta();
    });
  };

  pergunta();
}

module.exports = DIOExplorerAgent;
