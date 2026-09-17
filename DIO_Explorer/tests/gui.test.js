const { describe, it, after, before } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { app } = require('../src/web/server');

let server;
let BASE_URL;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      BASE_URL = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(() => { server.close(); });

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(rawData) }); }
        catch { resolve({ status: res.statusCode, body: rawData }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

describe('GUI - API de Trilhas', () => {
  it('GET /api/trilhas deve retornar lista de trilhas', async () => {
    const res = await get('/api/trilhas');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.trilhas));
    assert.ok(res.body.trilhas.length > 0);
  });

  it('GET /api/trilhas?tecnologia=JavaScript deve filtrar', async () => {
    const res = await get('/api/trilhas?tecnologia=JavaScript');
    assert.strictEqual(res.status, 200);
    res.body.trilhas.forEach(t => {
      assert.strictEqual(t.tecnologia, 'JavaScript');
    });
  });

  it('GET /api/trilhas/:id deve retornar trilha específica', async () => {
    const res = await get('/api/trilhas/javascript-basico');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 'javascript-basico');
    assert.ok(res.body.modulos.length > 0);
  });

  it('GET /api/trilhas/:id inexistente deve retornar 404', async () => {
    const res = await get('/api/trilhas/nao-existe');
    assert.strictEqual(res.status, 404);
  });

  it('GET /api/tecnologias deve retornar lista', async () => {
    const res = await get('/api/tecnologias');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.tecnologias));
    assert.ok(res.body.tecnologias.includes('JavaScript'));
  });
});

describe('GUI - API de Desafios', () => {
  it('GET /api/desafios deve retornar lista', async () => {
    const res = await get('/api/desafios');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.desafios));
    assert.ok(res.body.desafios.length > 0);
  });

  it('GET /api/desafios?tecnologia=Python deve filtrar', async () => {
    const res = await get('/api/desafios?tecnologia=Python');
    assert.strictEqual(res.status, 200);
    res.body.desafios.forEach(d => {
      assert.strictEqual(d.tecnologia, 'Python');
    });
  });

  it('GET /api/desafios/aleatorio deve retornar desafio', async () => {
    const res = await get('/api/desafios/aleatorio');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.id);
    assert.ok(res.body.titulo);
  });

  it('GET /api/desafios/aleatorio com filtro deve funcionar', async () => {
    const res = await get('/api/desafios/aleatorio?tecnologia=JavaScript&nivel=basico');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.tecnologia, 'JavaScript');
    assert.strictEqual(res.body.nivel, 'basico');
  });

  it('GET /api/desafios/:id deve retornar desafio', async () => {
    const res = await get('/api/desafios/js-basico-01');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.titulo, 'FizzBuzz');
  });
});

describe('GUI - API de Certificados', () => {
  it('POST /api/certificados deve gerar certificado', async () => {
    const res = await post('/api/certificados', {
      nomeAluno: 'Teste GUI',
      nomeTrilha: 'JavaScript Básico',
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.certificado);
    assert.strictEqual(res.body.certificado.nomeAluno, 'Teste GUI');
    assert.ok(res.body.arquivos.json);
    assert.ok(res.body.arquivos.html);
  });

  it('POST /api/certificados sem nome deve retornar 400', async () => {
    const res = await post('/api/certificados', { nomeTrilha: 'X' });
    assert.strictEqual(res.status, 400);
  });

  it('POST /api/certificados com trilha inexistente deve retornar 404', async () => {
    const res = await post('/api/certificados', {
      nomeAluno: 'Teste',
      nomeTrilha: 'Trilha Fake',
    });
    assert.strictEqual(res.status, 404);
  });
});

describe('GUI - Frontend', () => {
  it('GET / deve retornar HTML', async () => {
    const res = await get('/');
    assert.strictEqual(res.status, 200);
    assert.ok(typeof res.body === 'string');
    assert.ok(res.body.includes('DIO Explorer'));
  });

  it('GET /style.css deve retornar CSS', async () => {
    const res = await get('/style.css');
    assert.strictEqual(res.status, 200);
  });

  it('GET /app.js deve retornar JS', async () => {
    const res = await get('/app.js');
    assert.strictEqual(res.status, 200);
  });
});
