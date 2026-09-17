const API = '';
let chatHistorico = [];

document.addEventListener('DOMContentLoaded', () => {
  inicializarNavegacao();
  carregarTrilhas();
  carregarDesafios();
  carregarCertificados();
  verificarOllama();
});

function inicializarNavegacao() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`section-${btn.dataset.section}`).classList.add('active');
    });
  });
}

// Trilhas
async function carregarTrilhas() {
  const [trilhasRes, techRes] = await Promise.all([
    fetch(`${API}/api/trilhas`),
    fetch(`${API}/api/tecnologias`)
  ]);
  const { trilhas } = await trilhasRes.json();
  const { tecnologias } = await techRes.json();

  const select = document.getElementById('filterTecnologia');
  tecnologias.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });

  renderizarTrilhas(trilhas);

  select.addEventListener('change', async () => {
    const res = await fetch(`${API}/api/trilhas${select.value ? `?tecnologia=${select.value}` : ''}`);
    const { trilhas: filtradas } = await res.json();
    renderizarTrilhas(filtradas);
  });
}

function renderizarTrilhas(trilhas) {
  const grid = document.getElementById('trilhasGrid');
  grid.innerHTML = trilhas.map(t => `
    <div class="card" onclick="mostrarDetalheTrilha('${t.id}')">
      <div class="card-title">${t.nome}</div>
      <div class="card-meta">
        <span class="badge">${t.tecnologia}</span>
        <span class="badge badge-accent">${t.nivel}</span>
        <span>${t.duracao}</span>
      </div>
      <div class="card-desc">${t.modulos.length} módulos</div>
    </div>
  `).join('');
}

async function mostrarDetalheTrilha(id) {
  const res = await fetch(`${API}/api/trilhas/${id}`);
  const trilha = await res.json();
  const painel = document.getElementById('trilhaDetalhe');
  painel.classList.remove('hidden');
  painel.innerHTML = `
    <h2>${trilha.nome}</h2>
    <div class="detail-meta">
      <span class="badge">${trilha.tecnologia}</span>
      <span class="badge badge-accent">${trilha.nivel}</span>
      <span class="badge badge-green">${trilha.duracao}</span>
    </div>
    <ul class="modulo-list">
      ${trilha.modulos.map(m => `
        <li class="modulo-item">
          <span class="modulo-num">${m.ordem}</span>
          <div class="modulo-info">
            <h4>${m.titulo}</h4>
            <p>${m.conteudo}</p>
          </div>
          <span class="modulo-duracao">${m.duracao}</span>
        </li>
      `).join('')}
    </ul>
  `;
  painel.scrollIntoView({ behavior: 'smooth' });
}

// Desafios
async function carregarDesafios() {
  const [desafiosRes, techRes] = await Promise.all([
    fetch(`${API}/api/desafios`),
    fetch(`${API}/api/tecnologias`)
  ]);
  const { desafios } = await desafiosRes.json();
  const { tecnologias } = await techRes.json();

  const selectTech = document.getElementById('filterDesafioTech');
  tecnologias.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    selectTech.appendChild(opt);
  });

  renderizarDesafios(desafios);

  document.getElementById('btnGerarDesafio').addEventListener('click', gerarDesafio);

  selectTech.addEventListener('change', async () => {
    const nivel = document.getElementById('filterDesafioNivel').value;
    const params = new URLSearchParams();
    if (selectTech.value) params.set('tecnologia', selectTech.value);
    if (nivel) params.set('nivel', nivel);
    const res = await fetch(`${API}/api/desafios?${params}`);
    const { desafios: filtrados } = await res.json();
    renderizarDesafios(filtrados);
  });

  document.getElementById('filterDesafioNivel').addEventListener('change', async () => {
    const tech = document.getElementById('filterDesafioTech').value;
    const nivel = document.getElementById('filterDesafioNivel').value;
    const params = new URLSearchParams();
    if (tech) params.set('tecnologia', tech);
    if (nivel) params.set('nivel', nivel);
    const res = await fetch(`${API}/api/desafios?${params}`);
    const { desafios: filtrados } = await res.json();
    renderizarDesafios(filtrados);
  });
}

function renderizarDesafios(desafios) {
  const grid = document.getElementById('desafiosGrid');
  grid.innerHTML = desafios.map(d => `
    <div class="card" onclick="mostrarDesafio('${d.id}')">
      <div class="card-title">${d.titulo}</div>
      <div class="card-meta">
        <span class="badge">${d.tecnologia}</span>
        <span class="badge badge-accent">${d.nivel}</span>
      </div>
      <div class="card-desc">${d.enunciado.substring(0, 80)}...</div>
    </div>
  `).join('');
}

async function mostrarDesafio(id) {
  const res = await fetch(`${API}/api/desafios/${id}`);
  const d = await res.json();
  renderizarDesafioAtual(d);
}

async function gerarDesafio() {
  const tech = document.getElementById('filterDesafioTech').value;
  const nivel = document.getElementById('filterDesafioNivel').value;
  const params = new URLSearchParams();
  if (tech) params.set('tecnologia', tech);
  if (nivel) params.set('nivel', nivel);
  const res = await fetch(`${API}/api/desafios/aleatorio?${params}`);
  if (!res.ok) return alert('Nenhum desafio encontrado com esses filtros');
  const d = await res.json();
  renderizarDesafioAtual(d);
}

function renderizarDesafioAtual(d) {
  const painel = document.getElementById('desafioAtual');
  painel.classList.remove('hidden');
  painel.innerHTML = `
    <h2>${d.titulo}</h2>
    <div class="card-meta" style="margin-bottom:12px">
      <span class="badge">${d.tecnologia}</span>
      <span class="badge badge-accent">${d.nivel}</span>
    </div>
    <div class="desafio-enunciado">${d.enunciado}</div>
    <div class="desafio-exemplo">
      <div><label>Entrada</label><code>${d.exemplo_entrada}</code></div>
      <div><label>Saída</label><code>${d.exemplo_saida}</code></div>
    </div>
    <div class="desafio-dica">${d.dica}</div>
    <div class="desafio-solucao">
      <details>
        <summary style="cursor:pointer;color:var(--accent);font-weight:600;margin-top:12px">Ver solução sugerida</summary>
        <pre>${d.solucao_sugerida}</pre>
      </details>
    </div>
  `;
  painel.scrollIntoView({ behavior: 'smooth' });
}

// Certificados
async function carregarCertificados() {
  const res = await fetch(`${API}/api/trilhas`);
  const { trilhas } = await res.json();
  const select = document.getElementById('inputTrilha');
  trilhas.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.nome;
    opt.textContent = t.nome;
    select.appendChild(opt);
  });

  document.getElementById('btnGerarCert').addEventListener('click', gerarCertificado);
}

async function gerarCertificado() {
  const nome = document.getElementById('inputNome').value.trim();
  const trilha = document.getElementById('inputTrilha').value;
  if (!nome) return alert('Informe o nome do aluno');

  const res = await fetch(`${API}/api/certificados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nomeAluno: nome, nomeTrilha: trilha }),
  });

  if (!res.ok) {
    const erro = await res.json();
    return alert(erro.erro);
  }

  const { certificado, arquivos } = await res.json();
  const painel = document.getElementById('certResultado');
  painel.classList.remove('hidden');
  painel.innerHTML = `
    <h3>Certificado Gerado com Sucesso!</h3>
    <p><strong>Aluno:</strong> ${certificado.nomeAluno}</p>
    <p><strong>Trilha:</strong> ${certificado.trilha}</p>
    <p><strong>Tecnologia:</strong> ${certificado.tecnologia}</p>
    <p><strong>Duração:</strong> ${certificado.duracao}</p>
    <p><strong>Data:</strong> ${certificado.dataConclusao}</p>
    <p class="cert-id">ID: ${certificado.id}</p>
    <div class="cert-links">
      <span>Abrir certificado no navegador</span>
    </div>
  `;
}

// Ollama / Chat
async function verificarOllama() {
  const statusEl = document.getElementById('ollamaStatus');
  try {
    const res = await fetch(`${API}/api/ollama/status`);
    const status = await res.json();
    const dot = statusEl.querySelector('.status-dot');
    const text = statusEl.querySelector('.status-text');
    if (status.online) {
      dot.className = 'status-dot online';
      text.textContent = status.qwen3Disponivel ? `Qwen3 OK` : 'Ollama online';
    } else {
      dot.className = 'status-dot offline';
      text.textContent = 'Ollama offline';
    }
  } catch {
    statusEl.querySelector('.status-dot').className = 'status-dot offline';
    statusEl.querySelector('.status-text').textContent = 'Erro ao conectar';
  }
}

document.getElementById('btnEnviarChat').addEventListener('click', enviarMensagem);
document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    enviarMensagem();
  }
});

async function enviarMensagem() {
  const input = document.getElementById('chatInput');
  const mensagem = input.value.trim();
  if (!mensagem) return;

  adicionarMensagem('user', mensagem);
  input.value = '';

  const loadingId = adicionarLoading();

  try {
    const res = await fetch(`${API}/api/ollama/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem, historico: chatHistorico }),
    });

    removerLoading(loadingId);

    if (!res.ok) {
      const erro = await res.json();
      adicionarMensagem('assistant', `Erro: ${erro.erro}`);
      return;
    }

    const resultado = await res.json();
    adicionarMensagem('assistant', resultado.resposta);

    chatHistorico.push({ role: 'user', content: mensagem });
    chatHistorico.push({ role: 'assistant', content: resultado.resposta });

    if (chatHistorico.length > 20) chatHistorico = chatHistorico.slice(-20);
  } catch (err) {
    removerLoading(loadingId);
    adicionarMensagem('assistant', `Erro de conexão com Ollama. Verifique se o servidor está rodando.`);
  }
}

function adicionarMensagem(tipo, texto) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `message ${tipo}`;
  div.innerHTML = `
    <div>
      <div class="message-label">${tipo === 'user' ? 'Você' : 'Assistente'}</div>
      <div class="message-content">${escapeHtml(texto)}</div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function adicionarLoading() {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'message assistant';
  div.id = `loading-${Date.now()}`;
  div.innerHTML = `<div class="message-content"><div class="loading"></div></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div.id;
}

function removerLoading(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
