#!/usr/bin/env node

const path = require('path');

const DESAFIOS_PATH = path.join(__dirname, '../../data/desafios.json');

function carregarDados() {
  const desafiosRaw = require(DESAFIOS_PATH);
  return { desafios: desafiosRaw.desafios };
}

function buscarDesafios(tecnologia = null, nivel = null) {
  const { desafios } = carregarDados();
  let resultado = desafios;

  if (tecnologia) {
    resultado = resultado.filter(d => d.tecnologia.toLowerCase() === tecnologia.toLowerCase());
  }
  if (nivel) {
    resultado = resultado.filter(d => d.nivel.toLowerCase() === nivel.toLowerCase());
  }
  return resultado;
}

function buscarDesafio(id) {
  const { desafios } = carregarDados();
  return desafios.find(d => d.id === id) || null;
}

function desafioAleatorio(tecnologia = null, nivel = null) {
  const resultado = buscarDesafios(tecnologia, nivel);
  if (resultado.length === 0) return null;
  const idx = Math.floor(Math.random() * resultado.length);
  return resultado[idx];
}

module.exports = { buscarDesafios, buscarDesafio, desafioAleatorio };
