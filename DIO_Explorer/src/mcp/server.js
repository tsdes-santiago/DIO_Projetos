#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const path = require('path');

const { trilhas } = require(path.join(__dirname, '../../data/trilhas.json'));
const { desafios } = require(path.join(__dirname, '../../data/desafios.json'));
const { gerarCertificado, salvarCertificado } = require(path.join(__dirname, '../commands/certificado'));

const server = new Server(
  {
    name: 'dio-explorer',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'dio://trilhas',
      name: 'Trilhas de Aprendizagem',
      description: 'Lista completa de trilhas disponíveis no DIO Explorer',
      mimeType: 'application/json',
    },
    {
      uri: 'dio://desafios',
      name: 'Desafios de Código',
      description: 'Lista completa de desafios de código disponíveis',
      mimeType: 'application/json',
    },
    {
      uri: 'dio://tecnologias',
      name: 'Tecnologias Disponíveis',
      description: 'Lista de todas as tecnologias com trilhas',
      mimeType: 'application/json',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'dio://trilhas':
      return {
        contents: [
          {
            uri: 'dio://trilhas',
            mimeType: 'application/json',
            text: JSON.stringify(trilhas, null, 2),
          },
        ],
      };

    case 'dio://desafios':
      return {
        contents: [
          {
            uri: 'dio://desafios',
            mimeType: 'application/json',
            text: JSON.stringify(desafios, null, 2),
          },
        ],
      };

    case 'dio://tecnologias': {
      const tecnologias = [...new Set(trilhas.map(t => t.tecnologia))];
      return {
        contents: [
          {
            uri: 'dio://tecnologias',
            mimeType: 'application/json',
            text: JSON.stringify(tecnologias, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Recurso desconhecido: ${uri}`);
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'listar_trilhas',
      description: 'Lista todas as trilhas de aprendizagem disponíveis',
      inputSchema: {
        type: 'object',
        properties: {
          tecnologia: {
            type: 'string',
            description: 'Filtrar por tecnologia (opcional)',
          },
        },
      },
    },
    {
      name: 'buscar_trilha',
      description: 'Busca uma trilha específica pelo ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID da trilha (ex: javascript-basico)',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'listar_desafios',
      description: 'Lista desafios de código disponíveis',
      inputSchema: {
        type: 'object',
        properties: {
          tecnologia: {
            type: 'string',
            description: 'Filtrar por tecnologia (opcional)',
          },
          nivel: {
            type: 'string',
            enum: ['basico', 'intermediario', 'avancado'],
            description: 'Filtrar por nível (opcional)',
          },
        },
      },
    },
    {
      name: 'gerar_desafio',
      description: 'Gera um desafio de código aleatório',
      inputSchema: {
        type: 'object',
        properties: {
          tecnologia: {
            type: 'string',
            description: 'Filtrar por tecnologia (opcional)',
          },
          nivel: {
            type: 'string',
            enum: ['basico', 'intermediario', 'avancado'],
            description: 'Filtrar por nível (opcional)',
          },
        },
      },
    },
    {
      name: 'gerar_certificado',
      description: 'Gera um certificado fictício para uma trilha concluída',
      inputSchema: {
        type: 'object',
        properties: {
          nomeAluno: {
            type: 'string',
            description: 'Nome do aluno',
          },
          idTrilha: {
            type: 'string',
            description: 'ID da trilha concluída',
          },
        },
        required: ['nomeAluno', 'idTrilha'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'listar_trilhas': {
      const { tecnologia } = args || {};
      let resultado = trilhas;
      if (tecnologia) {
        resultado = trilhas.filter(t => t.tecnologia.toLowerCase() === tecnologia.toLowerCase());
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(resultado, null, 2),
          },
        ],
      };
    }

    case 'buscar_trilha': {
      const { id } = args;
      const trilha = trilhas.find(t => t.id === id);
      if (!trilha) {
        return {
          content: [
            {
              type: 'text',
              text: `Trilha com ID "${id}" não encontrada. IDs disponíveis: ${trilhas.map(t => t.id).join(', ')}`,
            },
          ],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(trilha, null, 2),
          },
        ],
      };
    }

    case 'listar_desafios': {
      const { tecnologia, nivel } = args || {};
      let resultado = desafios;
      if (tecnologia) {
        resultado = resultado.filter(d => d.tecnologia.toLowerCase() === tecnologia.toLowerCase());
      }
      if (nivel) {
        resultado = resultado.filter(d => d.nivel.toLowerCase() === nivel.toLowerCase());
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(resultado, null, 2),
          },
        ],
      };
    }

    case 'gerar_desafio': {
      const { tecnologia, nivel } = args || {};
      let resultado = desafios;
      if (tecnologia) {
        resultado = resultado.filter(d => d.tecnologia.toLowerCase() === tecnologia.toLowerCase());
      }
      if (nivel) {
        resultado = resultado.filter(d => d.nivel.toLowerCase() === nivel.toLowerCase());
      }
      if (resultado.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'Nenhum desafio encontrado com esses filtros.',
            },
          ],
          isError: true,
        };
      }
      const desafio = resultado[Math.floor(Math.random() * resultado.length)];
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(desafio, null, 2),
          },
        ],
      };
    }

    case 'gerar_certificado': {
      const { nomeAluno, idTrilha } = args;
      const trilha = trilhas.find(t => t.id === idTrilha);
      if (!trilha) {
        return {
          content: [
            {
              type: 'text',
              text: `Trilha com ID "${idTrilha}" não encontrada.`,
            },
          ],
          isError: true,
        };
      }
      const certificado = gerarCertificado(nomeAluno, trilha);
      const arquivos = salvarCertificado(certificado);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              certificado,
              arquivos,
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Tool desconhecida: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DIO Explorer MCP Server rodando via stdio');
}

main().catch(console.error);
