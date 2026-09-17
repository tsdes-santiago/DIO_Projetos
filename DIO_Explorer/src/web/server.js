const express = require('express');
const path = require('path');
const { listarTrilhas, buscarTrilha, listarTecnologias } = require('../commands/trilha');
const { buscarDesafios, buscarDesafio, desafioAleatorio } = require('../commands/desafio');
const { gerarCertificado, salvarCertificado } = require('../commands/certificado');
const ollama = require('../ollama/ollama');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/trilhas', (req, res) => {
  const { tecnologia } = req.query;
  const trilhas = listarTrilhas(tecnologia || null);
  res.json({ trilhas, total: trilhas.length });
});

app.get('/api/trilhas/:id', (req, res) => {
  const trilha = buscarTrilha(req.params.id);
  if (!trilha) return res.status(404).json({ erro: 'Trilha não encontrada' });
  res.json(trilha);
});

app.get('/api/tecnologias', (_req, res) => {
  res.json({ tecnologias: listarTecnologias() });
});

app.get('/api/desafios', (req, res) => {
  const { tecnologia, nivel } = req.query;
  const desafios = buscarDesafios(tecnologia || null, nivel || null);
  res.json({ desafios, total: desafios.length });
});

app.get('/api/desafios/aleatorio', (req, res) => {
  const { tecnologia, nivel } = req.query;
  const desafio = desafioAleatorio(tecnologia || null, nivel || null);
  if (!desafio) return res.status(404).json({ erro: 'Nenhum desafio encontrado' });
  res.json(desafio);
});

app.get('/api/desafios/:id', (req, res) => {
  const desafio = buscarDesafio(req.params.id);
  if (!desafio) return res.status(404).json({ erro: 'Desafio não encontrado' });
  res.json(desafio);
});

app.post('/api/certificados', (req, res) => {
  const { nomeAluno, nomeTrilha } = req.body;
  if (!nomeAluno || !nomeTrilha) {
    return res.status(400).json({ erro: 'nomeAluno e nomeTrilha são obrigatórios' });
  }
  const { trilhas } = require(path.join(__dirname, '../../data/trilhas.json'));
  const trilha = trilhas.find(t => t.nome.toLowerCase() === nomeTrilha.toLowerCase());
  if (!trilha) return res.status(404).json({ erro: 'Trilha não encontrada' });

  const certificado = gerarCertificado(nomeAluno, trilha);
  const arquivos = salvarCertificado(certificado);
  res.json({ certificado, arquivos });
});

app.get('/api/ollama/status', async (_req, res) => {
  const status = await ollama.verificarOllama();
  res.json(status);
});

app.post('/api/ollama/chat', async (req, res) => {
  const { mensagem, historico } = req.body;
  if (!mensagem) return res.status(400).json({ erro: 'Mensagem é obrigatória' });

  try {
    const resultado = await ollama.chat(mensagem, historico || []);
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/ollama/stream', async (req, res) => {
  const { mensagem, historico } = req.body;
  if (!mensagem) return res.status(400).json({ erro: 'Mensagem é obrigatória' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    await ollama.gerarRespostaStreaming(mensagem, historico || {}, {}, (chunk, completo) => {
      res.write(`data: ${JSON.stringify({ chunk, completo })}\n\n`);
    });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ erro: err.message })}\n\n`);
    res.end();
  }
});

app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function iniciarServidor(porta = PORT) {
  return new Promise((resolve) => {
    const server = app.listen(porta, () => {
      console.log(`\n🚀 DIO Explorer GUI rodando em http://localhost:${porta}\n`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  iniciarServidor();
}

module.exports = { app, iniciarServidor };
