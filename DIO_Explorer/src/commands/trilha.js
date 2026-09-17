#!/usr/bin/env node

const path = require('path');

const TRILHAS_PATH = path.join(__dirname, '../../data/trilhas.json');
const DESAFIOS_PATH = path.join(__dirname, '../../data/desafios.json');

function carregarDados() {
  const trilhasRaw = require(TRILHAS_PATH);
  const desafiosRaw = require(DESAFIOS_PATH);
  return { trilhas: trilhasRaw.trilhas, desafios: desafiosRaw.desafios };
}

function listarTrilhas(tecnologia = null) {
  const { trilhas } = carregarDados();
  if (tecnologia) {
    return trilhas.filter(t => t.tecnologia.toLowerCase() === tecnologia.toLowerCase());
  }
  return trilhas;
}

function buscarTrilha(id) {
  const { trilhas } = carregarDados();
  return trilhas.find(t => t.id === id) || null;
}

function listarTecnologias() {
  const { trilhas } = carregarDados();
  const tecnologias = [...new Set(trilhas.map(t => t.tecnologia))];
  return tecnologias;
}

module.exports = { listarTrilhas, buscarTrilha, listarTecnologias };
