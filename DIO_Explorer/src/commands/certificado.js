#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function gerarCertificado(nome, trilha) {
  const data = new Date().toLocaleDateString('pt-BR');
  const id = `DIO-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const certificado = {
    id,
    nomeAluno: nome,
    trilha: trilha.nome,
    tecnologia: trilha.tecnologia,
    nivel: trilha.nivel,
    duracao: trilha.duracao,
    dataConclusao: data,
    modulosConcluidos: trilha.modulos.length,
    mensagem: `Parabéns, ${nome}! Você concluiu a trilha "${trilha.nome}" com ${trilha.modulos.length} módulos.`
  };

  return certificado;
}

function gerarHTMLCertificado(certificado) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado DIO Explorer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a2e; font-family: 'Segoe UI', sans-serif; }
    .certificado { width: 800px; padding: 60px; background: #16213e; border-radius: 12px; text-align: center; color: white; border: 3px solid #0f3460; }
    .logo { font-size: 2rem; font-weight: bold; color: #e94560; margin-bottom: 20px; }
    .titulo { font-size: 1.5rem; color: #0f3460; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 3px; }
    .aluno { font-size: 2rem; color: #e94560; margin: 20px 0; font-weight: bold; }
    .trilha { font-size: 1.3rem; color: #a0a0a0; margin: 10px 0; }
    .detalhes { margin: 20px 0; padding: 15px; background: #0f3460; border-radius: 8px; }
    .detalhes p { margin: 5px 0; color: #e0e0e0; font-size: 0.9rem; }
    .id { font-family: monospace; color: #53d769; font-size: 0.8rem; margin-top: 20px; }
    .borda-decorativa { border-top: 3px solid #e94560; margin: 20px 0; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="certificado">
    <div class="logo">DIO Explorer</div>
    <div class="borda-decorativa">
      <div class="titulo">Certificado de Conclusão</div>
      <p style="color: #a0a0a0;">Concedemos o presente certificado a</p>
      <div class="aluno">${certificado.nomeAluno}</div>
      <div class="detalhes">
        <p><strong>Trilha:</strong> ${certificado.trilha}</p>
        <p><strong>Tecnologia:</strong> ${certificado.tecnologia}</p>
        <p><strong>Nível:</strong> ${certificado.nivel.charAt(0).toUpperCase() + certificado.nivel.slice(1)}</p>
        <p><strong>Duração:</strong> ${certificado.duracao}</p>
        <p><strong>Módulos Concluídos:</strong> ${certificado.modulosConcluidos}</p>
        <p><strong>Data:</strong> ${certificado.dataConclusao}</p>
      </div>
    </div>
    <div class="id">ID: ${certificado.id}</div>
  </div>
</body>
</html>`;
}

function salvarCertificado(certificado, dirSaida = null) {
  const baseDir = dirSaida || path.join(process.cwd(), 'certificados');
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  const nomeArquivo = `certificado-${certificado.id.replace(/[^a-zA-Z0-9-]/g, '_')}.json`;
  const htmlArquivo = nomeArquivo.replace('.json', '.html');

  fs.writeFileSync(path.join(baseDir, nomeArquivo), JSON.stringify(certificado, null, 2));
  fs.writeFileSync(path.join(baseDir, htmlArquivo), gerarHTMLCertificado(certificado));

  return {
    json: path.join(baseDir, nomeArquivo),
    html: path.join(baseDir, htmlArquivo)
  };
}

module.exports = { gerarCertificado, gerarHTMLCertificado, salvarCertificado };
